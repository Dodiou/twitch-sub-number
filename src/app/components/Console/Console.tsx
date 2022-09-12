import React, { useEffect, useRef, useState } from "react";

import { Log, Logger } from "../../services/ui-logger";
import ConsoleMessage from "./ConsoleMessage";
import "./Console.css";

const Console = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Logger.onChange((newLogs) => setLogs([...newLogs]));
    return () => Logger.onChange(undefined);
  }, []);

  // update when logs (or ref) updates.
  useEffect(() => scrollToBottomRef.current?.scrollIntoView(), [scrollToBottomRef, logs]);

  let logsHtml: JSX.Element | JSX.Element[] = (<div className="Console__no-data">No messages.</div>);
  if (logs.length) {
    logsHtml = logs.map((log) => <ConsoleMessage log={log} key={log.id} />);
  }

  return (
    <div className="Console">
      { logsHtml }
      <div ref={scrollToBottomRef}></div>
    </div>
  );
};

export default React.memo(Console);
