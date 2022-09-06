import React, { useCallback, useEffect, useState } from "react";
import { ElectronTSN, SelectFileEvent } from "../types/preload";
import "./App.css";

import { SubCounter } from "./services/sub-counter";
import SingleValueForm from "./components/SingleValueForm/SingleValueForm";
import Number from "./components/Number/Number";
import Settings from "./components/Settings/Settings";

declare const electronTSN: ElectronTSN;

const INITIAL_CHANNEL = "DumbDog";
const subCounter = new SubCounter({ channel: INITIAL_CHANNEL });

const App = () => {
  const [filepath, setFilepath] = useState<string>("");
  const [loadNumber, setLoadNumber] = useState<boolean>(true);
  const [countUpgrades, setCountUpgrades] = useState<boolean>(false);

  const [channel, setChannel] = useState<string>(INITIAL_CHANNEL);
  const [subNumber, setSubNumber] = useState<number>(0);

  useEffect(() => {
    const offHandler = subCounter.onChange((newNumber) => {
      setSubNumber(newNumber);
      electronTSN.writeToFile("" + newNumber).catch(console.error);
    });
    return () => {
      offHandler();
      subCounter.disconnect();
    };
  }, []);

  // No useEffect for subNumber, since subCounter will emit it when it is changed through there.
  useEffect(() => subCounter.setChannel(channel), [channel]);
  useEffect(() => subCounter.setCountUpgrades(countUpgrades), [countUpgrades]);

  const fileChangeHandler = useCallback((event: SelectFileEvent) => {
    setFilepath(event.filepath);
    if (event.contents !== undefined) {
      subCounter.setNumber(event.contents);
      // don't re-write to file, we just read it.
      setSubNumber(event.contents);
    }
  }, []);

  const numberFormHandler = (newValue: string) => {
    const newNumber = parseInt(newValue);
    if (isNaN(newNumber)) {
      return false;
    }

    subCounter.setNumber(newNumber);
    setSubNumber(newNumber);
    electronTSN.writeToFile("" + newNumber).catch(console.error);
    return true;
  }

  return (
    <div className="App">
      <div className="App__controls">
        <Settings
          countUpgrades={countUpgrades}
          countUpgradesChange={setCountUpgrades}
          filepath={filepath}
          fileChange={fileChangeHandler}
          loadNumber={loadNumber}
          loadNumberChange={setLoadNumber}
        />
        <SingleValueForm
          buttonLabel="Connect"
          label="Connect to channel:"
          name="channel"
          type="text"
          value={channel}
          valueChange={setChannel}
        />
        <SingleValueForm
          buttonLabel="Set number"
          label="Number:"
          name="number"
          type="number"
          value={"" + subNumber}
          valueChange={numberFormHandler}
        />
      </div>
      <Number value={subNumber} />
    </div>
  )
};

export default App;
