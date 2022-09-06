import React from "react";

export interface ConsoleProps {
  loadNumber?: boolean;
  loadNumberChange: (newLoadNumber: boolean) => void;
  filepathChange: (newFilepath: string) => void;
}

const Console = (props: ConsoleProps) => {
  return (
    <div className="Console">
      <div>{props.loadNumber && "Load"}</div>
    </div>
  )
};

export default Console;
