import React, { useEffect, useState } from "react";

import { Log, Logger } from "../../services/ui-logger";
import ExpandPanel from "../ExpandPanel/ExpandPanel";
import ConsoleMessage from "./ConsoleMessage";

const Console = () => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    Logger.onChange((newLogs) => setLogs([...newLogs]));
    return () => Logger.onChange(undefined);
  })

  let logsHtml: JSX.Element | JSX.Element[] = (<div>No messages</div>);
  if (expanded) {
    logsHtml = logs.map((log) => <ConsoleMessage log={log} key={log.id} />)
  }

  return (
    <div className="Console">
      <ExpandPanel expanded={expanded} expandedChange={setExpanded} label="Console">
        { logsHtml }
      </ExpandPanel>
    </div>
  );
};

export default Console;
