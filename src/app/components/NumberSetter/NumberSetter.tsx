import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./NumberSetter.css";

export interface NumberSetterProps {
  value: number;
  valueChange: (newNumber: number) => void;
}

const NumberSetter = (props: NumberSetterProps) => {
  const [number, setNumber] = useState<number>(0);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!dirty) {
      setNumber(props.value);
    }
  }, [props.value, dirty]);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    setDirty(true);

    const newNumber = parseInt(event.target.value);
    if (isNaN(newNumber)) {
      return;
    }

    setNumber(newNumber);
  }

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    props.valueChange(number);
    setDirty(false);
  };

  const cancelHandler = () => setDirty(false);

  return (
    <form className="NumberSetter" onSubmit={submitHandler}>
      <input
        type="number"
        name="number"
        className="Input"
        onChange={updateNumberValue}
        value={number}
      />
      <div className="ButtonBar">
        <button type="submit" className="Button Button__primary" disabled={!dirty}>Set number</button>
        <button type="button" className="Button" disabled={!dirty} onClick={cancelHandler}>Cancel</button>
      </div>
    </form>
  )
};

export default NumberSetter;
