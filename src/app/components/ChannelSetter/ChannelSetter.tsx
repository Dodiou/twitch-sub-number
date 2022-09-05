import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

export interface ChannelSetterProps {
  value: string;
  valueChange: (newChannel: string) => void;
}

// TODO common component with NumberSetter

const ChannelSetter = (props: ChannelSetterProps) => {
  const [channel, setChannel] = useState<string>(props.value);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!dirty) {
      setChannel(props.value);
    }
  }, [props.value, dirty]);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    setChannel(event.target.value);
  }

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    props.valueChange(channel);
    setDirty(false);
  };

  const cancelHandler = () => setDirty(false);

  return (
    <form className="ChannelSetter" onSubmit={submitHandler}>
      <input
        type="text"
        name="channel"
        className="Input"
        onChange={updateNumberValue}
        value={channel}
      />
      <div className="ButtonBar">
        <button type="submit" className="Button Button__primary" disabled={!dirty}>Set channel</button>
        <button type="button" className="Button" disabled={!dirty} onClick={cancelHandler}>Cancel</button>
      </div>
    </form>
  )
};

export default ChannelSetter;
