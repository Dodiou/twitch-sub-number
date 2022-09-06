import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

export interface NumberSetterProps {
  buttonLabel?: string;
  label: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  valueChange: (newValue: string) => boolean | void;
}

const NumberSetter = (props: NumberSetterProps) => {
  const [value, setValue] = useState<string>(props.value);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!dirty) {
      setValue(props.value);
    }
  }, [props.value, dirty]);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    setValue(event.target.value);
  }

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    // if return value was undefined or true, accept the change
    const rejected = props.valueChange(value) === false;

    setDirty(rejected);
  };

  const cancelHandler = () => setDirty(false);

  return (
    <form className="Form" onSubmit={submitHandler}>
      <label className="Form__group">
        <div className="Form__label">{props.label}</div>
        <input
          type={props.type}
          name={props.name}
          className="Input"
          onChange={updateNumberValue}
          value={value}
        />
      </label>
      <div className="ButtonBar">
        <button type="submit" className="Button Button__primary" disabled={!dirty}>{props.buttonLabel || "Submit"}</button>
        <button type="button" className="Button" disabled={!dirty} onClick={cancelHandler}>Cancel</button>
      </div>
    </form>
  )
};

export default NumberSetter;