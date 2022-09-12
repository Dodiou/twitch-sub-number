import React from "react";
import { Log } from "../../services/ui-logger";

export interface ConsoleMessageProps {
  log: Log;
}

const ConsoleMessage = (props: ConsoleMessageProps) => {
  return <div className={"ConsoleMessage ConsoleMessage__" + props.log.type}>
    <span className="ConsoleMessage__timestamp">{ props.log.timestamp }</span>
    <span className="ConsoleMessage__message">{ props.log.message }</span>
  </div>;
};

export default ConsoleMessage;
