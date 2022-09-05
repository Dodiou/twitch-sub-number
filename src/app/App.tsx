import React, { useEffect, useState } from "react";
import NumberSetter from "./components/NumberSetter/NumberSetter";
import Number from "./components/Number/Number";
import FilePicker from "./components/FilePicker/FilePicker";
import { SubCounter } from "./services/sub-counter";
import ChannelSetter from "./components/ChannelSetter/ChannelSetter";

const INITIAL_CHANNEL = "DumbDog";
const subCounter = new SubCounter({ channel: INITIAL_CHANNEL });

const App = () => {
  const [filepath, setFilepath] = useState<string>("./sub-number.txt");
  const [channel, setChannel] = useState<string>(INITIAL_CHANNEL);
  const [loadNumber, setLoadNumber] = useState<boolean>(true);
  const [subNumber, setSubNumber] = useState<number>(0);

  useEffect(() => {
    const offHandler = subCounter.onChange((newNumber) => setSubNumber(newNumber));
    return () => {
      offHandler();
      subCounter.disconnect();
    };
  }, []);

  useEffect(() => subCounter.setNumber(subNumber), [subNumber]);
  useEffect(() => subCounter.setChannel(channel), [channel]);

  return (
    <div className="App">
      Settings:
      <FilePicker
        filepathChange={(newFilepath) => setFilepath(newFilepath)}
        loadNumber={loadNumber}
        loadNumberChange={setLoadNumber}
      />
      <ChannelSetter
        value={channel}
        valueChange={setChannel}
      />
      <NumberSetter
        value={subNumber}
        valueChange={setSubNumber}
      />
      <Number value={subNumber} />
    </div>
  )
};

export default App;
