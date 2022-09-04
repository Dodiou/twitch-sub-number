import { AnonSubGiftUserstate, Client, SubGiftUserstate, SubUserstate } from "tmi.js";

export interface SubCounterOpts {
  channel?: string;
  subNumber?: number;
}

export type HandlerFunc = (this: undefined, subNumber: number) => void;
export type OffChangeFunc = () => void;

interface HandlerMap {
  [key: string]: HandlerFunc;
}

const logGiftContinuation = (_channel: string, user: string) => console.log("Gift sub continuation for %s.   Not updating total.", user);
const logMysteryGifts = (user: string, numOfSubs: number) => console.log("%s gifted %d subs. Total will be updated per each sub event.", user, numOfSubs);

export class SubCounter {
  private readonly client: Client;
  private readonly handlers: HandlerMap = {};
  private nextHandlerId = 0;
  private _subNumber: number;

  constructor({ channel = "DumbDog", subNumber = 0 }: SubCounterOpts = {}) {
    this._subNumber = subNumber;

    this.client = new Client({
      channels: [channel],
      connection: {
        reconnect: true
      }
    });

    this.client.connect().catch(console.error);

    // Do not count the following events:
    //   - anongiftpaidupgrade, giftpaidupgrade, primepaidupgrade;   these do not increase actual sub count immediately
    //   - anonsubmysterygift, submysterygift;   these are the "gifted # subs" messages. these are followed by the # of individual anonsubgift/subgift events
    this.client.on("anongiftpaidupgrade", logGiftContinuation);
    this.client.on("giftpaidupgrade", logGiftContinuation);
    this.client.on("primepaidupgrade", logGiftContinuation);

    this.client.on("anonsubmysterygift", (_channel, numOfSubs) => logMysteryGifts("Anon", numOfSubs));
    this.client.on("submysterygift", (_channel, user, numOfSubs) => logMysteryGifts(user, numOfSubs));


    // These sub events count.
    this.client.on("resub", (_channel, user, _months, _message, state) => this.addStateToNumber(state, user));
    this.client.on("subgift", (_channel, _gifter, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
    this.client.on("anonsubgift", (_channel, _months, recip, _methods, state) => this.addStateToNumber(state, recip));
     // TODO fix tmi.js types for this
    this.client.on("sub" as any, (_channel, user: string, _months, _message, state: SubUserstate) => this.addStateToNumber(state, user));

    console.log('Connecting to channel "%s". Starting number at "%d". Waiting for subs...', channel, subNumber);
  }

  public setNumber(value: number): void {
    this._subNumber = value;
    this.emitNumber(this._subNumber);
  }

  public getNumber(): number {
    return this._subNumber;
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

  private emitNumber(value: number): void {
    Object.values<HandlerFunc>(this.handlers).forEach(
      (handler) => handler.call(undefined, value)
    )
  }

  private addStateToNumber(state: SubUserstate | SubGiftUserstate | AnonSubGiftUserstate, user = "UNKNOWN"): void {
    let tierMultiplier = 1;
    let tierString = "tier 1";
    if (state) {
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
          tierString = "prime";
          break;
      }
    }

    this.setNumber(this._subNumber + tierMultiplier);
    console.log("New %s sub for %s.   Total: %d", tierString, user, this._subNumber);
  }
}
