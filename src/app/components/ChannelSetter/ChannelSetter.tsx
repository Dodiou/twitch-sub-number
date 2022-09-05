import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

export interface ChannelSetterProps {
  value: string;
  valueChange: (newChannel: string) => void;
}

// TODO common component with NumberSetter

const ChannelSetter = (props: ChannelSetterProps) => {
  const [channel, setChannel] = useState<string>(props.value);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (!editMode) {
      setChannel(props.value);
    }
  }, [props.value, editMode]);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEditMode(true);
    setChannel(event.target.value);
  }

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    props.valueChange(channel);
    setEditMode(false);
  };

  return (
    <form className="ChannelSetter" onSubmit={submitHandler}>
      <input type="text" className="Input" onChange={updateNumberValue} value={channel} />
      <div className="ChannelSetter__button-bar">
        <button type="submit" className="Button Button__primary" disabled={!editMode}>Set channel</button>
        <button type="button" className="Button" disabled={!editMode} onClick={() => setEditMode(false)}>Cancel</button>
      </div>
    </form>
  )
};

export default ChannelSetter;
