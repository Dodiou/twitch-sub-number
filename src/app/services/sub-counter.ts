import { Client, CommonSubUserstate, SubUserstate } from "tmi.js";

import { Logger } from "./ui-logger";

export interface SubCounterOpts {
  channel: string;
  subNumber?: number;
}

export type HandlerFunc = (this: undefined, subNumber: number) => void;
export type OffChangeFunc = () => void;

interface HandlerMap {
  [key: string]: HandlerFunc;
}

const logMysteryGifts = (user: string, numOfSubs: number) => Logger.log("%s gifted %d subs. Total will be updated per each sub event.", user, numOfSubs);

const MAX_QUEUE_LENGTH = 5;

export class SubCounter {
  private readonly client: Client;
  private readonly handlers: HandlerMap = {};

  private nextHandlerId = 0;
  private connected = false;
  private _subNumber: number;
  private _channel: string | undefined;
  private _countUpgrades = false;
  private primeSubQueue: string[] = [];

  constructor({ channel, subNumber = 0 }: SubCounterOpts = { channel: "DumbDog" }) {
    this._subNumber = subNumber;
    this._channel = channel;

    this.client = new Client({
      channels: [this._channel],
      connection: {
        reconnect: true,
        maxReconnectInverval: 10
      }
    });

    this.client.connect().catch(Logger.error);

    // Do not count the following events:
    //   - anongiftpaidupgrade, giftpaidupgrade, primepaidupgrade;   these do not increase actual sub count immediately
    //   - anonsubmysterygift, submysterygift;   these are the "gifted # subs" messages. these are followed by the # of individual anonsubgift/subgift events
    this.client.on("anongiftpaidupgrade", (_channel, user, state) => this.onSubUpgrade(state, "Gift", user));
    this.client.on("giftpaidupgrade", (_channel, user, _sender, state) => this.onSubUpgrade(state, "Gift", user));
    this.client.on("primepaidupgrade", (_channel, user, _methods, state) => this.onSubUpgrade(state, "Prime", user));

    this.client.on("anonsubmysterygift", (_channel, numOfSubs) => logMysteryGifts("Anon", numOfSubs));
    this.client.on("submysterygift", (_channel, user, numOfSubs) => logMysteryGifts(user, numOfSubs));


    // These sub events count.
    this.client.on("resub", (_channel, user, _months, _message, state) => this.addStateToNumber(state, user));
    this.client.on("subgift", (_channel, _gifter, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
    this.client.on("anonsubgift", (_channel, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
     // TODO fix tmi.js types for this
    this.client.on("sub" as any, (_channel, user: string, _months, _message, state: SubUserstate) => this.addStateToNumber(state, user));

    this.client.on("part", (channel, user, self) => self && Logger.log("User %s leaving channel %s.", user, channel));
    this.client.on("join", (channel, user, self) => self && Logger.log("User %s joining channel %s.", user, channel));
    this.client.on("connected", () => this.connected = true);
    this.client.on("disconnected", () => this.connected = false);
  }

  public disconnect(): void {
    this.client.disconnect().catch(Logger.error);
  }

  public setChannel(channel: string | undefined): void {
    const prevChannel = this._channel;
    this._channel = channel;

    if (!this.connected || prevChannel === this._channel) {
      return;
    }

    if (prevChannel) {
      this.client.part(prevChannel).catch(Logger.error);
    }

    if (this._channel) {
      this.client.join(this._channel).catch(Logger.error);
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
    if (countUpgrades !== this._countUpgrades) {
      return;
    }

    const logMessage = countUpgrades ? "Counting sub upgrades." : "No longer counting sub upgrades."
    this._countUpgrades = countUpgrades;
    Logger.log(logMessage);
  }
  
  public getCountUpgrades(): boolean {
    return this._countUpgrades;
  }

  public onChange(handler: HandlerFunc): OffChangeFunc {
    const handlerId = "" + this.nextHandlerId;
    this.nextHandlerId++;

    const removeHandler: OffChangeFunc = () => {
      delete this.handlers[handlerId];
    };

    this.handlers[handlerId] = handler;

    return removeHandler;
  }

  private onSubUpgrade(state: CommonSubUserstate, type: "Prime" | "Gift", user: string): void {
    if (this._countUpgrades) {
      this.addStateToNumber(state, user);
    }
    else {
      Logger.log("%s sub upgrade for %s.   Not updating total.", type, user);
    }
  }

  private emitNumber(value: number): void {
    Object.values<HandlerFunc>(this.handlers).forEach(
      (handler) => handler.call(undefined, value)
    )
  }

  /**
   * 9/5/2022, I have seen some Prime subs get duplicate messages in chat,
   * this method will check the prime sub username against the previous X.
   * The duplicates seem to be come immediately, so queue size can be small.
   */
  private getPrimeMultiplierFor(user: string): number {
    if (this.primeSubQueue.includes(user)) {
      Logger.log("Duplicate prime sub for %s detected.", user);
      return 0;
    }

    if (this.primeSubQueue.length >= MAX_QUEUE_LENGTH) {
      this.primeSubQueue.shift();
    }
    this.primeSubQueue.push(user);
    return 1;
  }

  private addStateToNumber(state: CommonSubUserstate, user: string): void {
    let tierMultiplier = 1;
    let tierString = "tier 1";
    if (state) {
      // TODO there is a "msg-param-gift-months", which should say how many months were gifted.
      //      might be nice to add an option to count those.
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

    this._subNumber += tierMultiplier;
    Logger.log("New %s sub for %s.   Total: %d", tierString, user, this._subNumber);
    this.emitNumber(this._subNumber);
  }
}
