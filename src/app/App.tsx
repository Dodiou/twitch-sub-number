import React, { useCallback, useEffect, useState } from "react";
import { ElectronTSN, SelectFileEvent } from "../types/preload";
import "./App.css";

import { Logger } from "./services/ui-logger";
import { SubCounter } from "./services/sub-counter";
import Console from "./components/Console/Console";
import ExpandPanel from "./components/ExpandPanel/ExpandPanel";
import Number from "./components/Number/Number";
import SingleValueForm from "./components/SingleValueForm/SingleValueForm";
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
  const [consoleExpanded, setConsoleExpanded] = useState<boolean>(true);

  useEffect(() => {
    subCounter.onChange((newNumber) => {
      setSubNumber(newNumber);
      electronTSN.writeToFile("" + newNumber).catch((err) => Logger.error("Error writing sub number to file.", err));
    });
    return () => subCounter.disconnect();
  }, []);

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
    electronTSN.writeToFile("" + newNumber).catch((err) => Logger.error("Error writing sub number to file.", err));
  };

  const channelChangeHandler = (newChannel: string) => {
    if (!newChannel) {
      return false;
    }

    subCounter.setChannel(newChannel);
    setChannel(newChannel);
  };

  const countUpgradesChangeHandler = (newValue: boolean) => {
    subCounter.setCountUpgrades(newValue);
    setCountUpgrades(newValue);
  };

  return (
    <div className="App">
      <div className="App__controls">
        <Settings
          countUpgrades={countUpgrades}
          countUpgradesChange={countUpgradesChangeHandler}
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
          valueChange={channelChangeHandler}
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
      <Number className="flex-remainder" value={subNumber} />
      
      <ExpandPanel
        expanded={consoleExpanded}
        expandedChange={setConsoleExpanded}
        expandedHeight="20rem"
        label="Console"
      >
        <Console />
      </ExpandPanel>
    </div>
  )
};

export default App;
