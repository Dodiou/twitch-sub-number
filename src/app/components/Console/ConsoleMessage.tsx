import React from "react";
import { Log } from "../../services/ui-logger";

export interface ConsoleMessageProps {
  log: Log;
}

const ConsoleMessage = (props: ConsoleMessageProps) => {
  return <div className={"ConsoleMessage__" + props.log.type}>
    <span>{ props.log.timestamp }</span>
    <span>{ props.log.message }</span>
  </div>;
};

export default ConsoleMessage;
