import { Client, CommonSubUserstate, SubUserstate } from "tmi.js";

import { Logger } from "./ui-logger";
import { SingleListenerEventEmitter } from "./event-emitter";

export interface SubCounterOpts {
  channel: string;
  subNumber?: number;
}

export type OffChangeFunc = () => void;

const logMysteryGifts = (user: string, numOfSubs: number) => Logger.log(`"${user}" gifted ${numOfSubs} subs. Total will be updated per each sub event.`);

const MAX_QUEUE_LENGTH = 5;

export class SubCounter extends SingleListenerEventEmitter<number> {
  private readonly client: Client;

  private nextHandlerId = 0;
  private connected = false;
  private _subNumber: number;
  private _channel: string | undefined;
  private _countUpgrades = false;
  private primeSubQueue: string[] = [];

  constructor({ channel, subNumber = 0 }: SubCounterOpts = { channel: "DumbDog" }) {
    super();
    this._subNumber = subNumber;
    this._channel = channel;

    this.client = new Client({
      channels: [this._channel],
      connection: {
        reconnect: true,
        maxReconnectInverval: 10
      }
    });

    this.client.connect().catch((err) => Logger.error(`Error connecting to Twitch chat server. Auto-reconnecting. ${err}`));

    // Optionally count these events:
    //   - anongiftpaidupgrade, giftpaidupgrade, primepaidupgrade;   these do not increase actual sub count immediately
    this.client.on("anongiftpaidupgrade", (_channel, user, state) => this.onSubUpgrade(state, "Gift", user));
    this.client.on("giftpaidupgrade", (_channel, user, _sender, state) => this.onSubUpgrade(state, "Gift", user));
    this.client.on("primepaidupgrade", (_channel, user, _methods, state) => this.onSubUpgrade(state, "Prime", user));

    // Do not count the following events:
    //   - anonsubmysterygift, submysterygift;   these are the "gifted # subs" messages. these are followed by the # of individual anonsubgift/subgift events
    //     these are ignored b/c gifting 1 sub will not show these, so need to rely on anonsubgift/subgift events
    this.client.on("anonsubmysterygift", (_channel, numOfSubs) => logMysteryGifts("Anon", numOfSubs));
    this.client.on("submysterygift", (_channel, user, numOfSubs) => logMysteryGifts(user, numOfSubs));


    // These sub events count.
    this.client.on("resub", (_channel, user, _months, _message, state) => this.addStateToNumber(state, user));
    this.client.on("subgift", (_channel, _gifter, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
    this.client.on("anonsubgift", (_channel, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
     // TODO fix tmi.js types for this
    this.client.on("sub" as any, (_channel, user: string, _months, _message, state: SubUserstate) => this.addStateToNumber(state, user));

    this.client.on("part", (channel, user, self) => self && Logger.log(`User "${user}" leaving channel "${channel}".`));
    this.client.on("join", (channel, user, self) => self && Logger.log(`User "${user}" joining channel "${channel}".`));
    this.client.on("connected", () => this.connected = true);
    this.client.on("disconnected", () => this.connected = false);
  }

  public disconnect(): void {
    this.client.disconnect().catch((err) => Logger.error(`Error disconnecting from Twitch chat server. ${err}`));
  }

  public setChannel(channel: string | undefined): void {
    const prevChannel = this._channel;
    this._channel = channel;

    if (!this.connected || prevChannel === this._channel) {
      return;
    }

    if (prevChannel) {
      this.client.part(prevChannel).catch(
        // TODO figure out how to leave a channel if there is an error.
        (err) => Logger.error(`Error leaving chat channel "${prevChannel}". You should probably restart the program.   ${err}`)
      );
    }

    if (this._channel) {
      this.client.join(this._channel).catch(
        (err) => {
          Logger.error(`Error joining chat channel "${this._channel}". ${err}`);
          this._channel = undefined;
        }
      );
    }
    this.primeSubQueue = [];
  }

  public setNumber(value: number): void {
    this._subNumber = value;
  }

  public getNumber(): number {
    return this._subNumber;
  }

  public setCountUpgrades(countUpgrades: boolean): void {
    if (countUpgrades === this._countUpgrades) {
      return;
    }

    const logMessage = countUpgrades ? "Now counting sub upgrades." : "No longer counting sub upgrades."
    this._countUpgrades = countUpgrades;
    Logger.log(logMessage);
  }
  
  public getCountUpgrades(): boolean {
    return this._countUpgrades;
  }

  private onSubUpgrade(state: CommonSubUserstate | undefined, type: "Prime" | "Gift", user: string): void {
    if (this._countUpgrades) {
      this.addStateToNumber(state, user);
    }
    else {
      Logger.log(`${type} sub upgrade for "${user}". Not updating total.`);
    }
  }

  /**
   * 9/5/2022, I have seen some Prime subs get duplicate messages in chat,
   * this method will check the prime sub username against the previous X.
   * The duplicates seem to be come immediately, so queue size can be small.
   */
  private getPrimeMultiplierFor(user: string): number {
    if (this.primeSubQueue.includes(user)) {
      Logger.log(`Duplicate prime sub for "${user}" detected.`);
      return 0;
    }

    if (this.primeSubQueue.length >= MAX_QUEUE_LENGTH) {
      this.primeSubQueue.shift();
    }
    this.primeSubQueue.push(user);
    return 1;
  }

  private addStateToNumber(state: CommonSubUserstate | undefined, user: string): void {
    let tierMultiplier = 1;
    let monthMultiplier = 1; // only changes for T1 gift subs
    let tierString = "tier 1";
    if (state) {
      monthMultiplier = parseInt(state["msg-param-gift-months"]) || 1;

      switch (state["msg-param-sub-plan"]) {
        case "2000":
          tierMultiplier = 2;
          tierString = "tier 2";
          break;
        case "3000":
          tierMultiplier = 5;
          tierString = "tier 3";
          break;
        case "Prime":
          tierMultiplier = this.getPrimeMultiplierFor(user);
          tierString = "prime";
          break;
      }
    }

    // duplicate prime sub issue
    if (tierMultiplier === 0) {
      return;
    }

    this._subNumber += tierMultiplier * monthMultiplier;
    Logger.log(`New ${tierString} sub for "${user}". Total: ${this._subNumber}`);
    if (monthMultiplier !== 1) {
      Logger.log(`  -> Sub was gifted for ${monthMultiplier} months!`);
    }
    this.emitChange(this._subNumber);
  }
}
