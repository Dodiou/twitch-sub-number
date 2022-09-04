import React, { useState } from "react";
import NumberSetter from "./components/NumberSetter/NumberSetter";
import FilePicker from "./components/FilePicker/FilePicker";

const App = () => {
  const [filepath, setFilepath] = useState<string>("./sub-number.txt");
  const [loadNumber, setLoadNumber] = useState<boolean>(true);
  const [subNumber, setSubNumber] = useState<number>(0);

  return (
    <div>
      React!
      <FilePicker
        filepathChange={(newFilepath) => setFilepath(newFilepath)}
        loadNumber={loadNumber}
        loadNumberChange={setLoadNumber}
      />
      <NumberSetter
        numberChange={setSubNumber}
      />

      <div className="Number">
        <div>Current number:</div>
        <div>{subNumber}</div>
      </div>
    </div>
  )
};

export default App;
