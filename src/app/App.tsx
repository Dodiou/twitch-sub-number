import React, { useEffect, useState } from "react";
import NumberSetter from "./components/NumberSetter/NumberSetter";
import Number from "./components/Number/Number";
import FilePicker from "./components/FilePicker/FilePicker";
import { SubCounter } from "./services/sub-counter";

const subCounter = new SubCounter({ channel: "Raysfire" });

const App = () => {
  const [filepath, setFilepath] = useState<string>("./sub-number.txt");
  const [loadNumber, setLoadNumber] = useState<boolean>(true);
  const [subNumber, setSubNumber] = useState<number>(0);

  useEffect(() => {
    return subCounter.onChange((newNumber) => setSubNumber(newNumber));
  }, []);

  return (
    <div className="App">
      Settings:
      <FilePicker
        filepathChange={(newFilepath) => setFilepath(newFilepath)}
        loadNumber={loadNumber}
        loadNumberChange={setLoadNumber}
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
