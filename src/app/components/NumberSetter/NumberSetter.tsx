import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./NumberSetter.css";

export interface NumberSetterProps {
  value: number;
  valueChange: (newNumber: number) => void;
}

const NumberSetter = (props: NumberSetterProps) => {
  const [number, setNumber] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (!editMode) {
      setNumber(props.value);
    }
  }, [props.value, editMode]);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    setEditMode(true);

    const newNumber = parseInt(event.target.value);
    if (isNaN(newNumber)) {
      return;
    }

    setNumber(newNumber);
  }

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    props.valueChange(number);
    setEditMode(false);
  };

  return (
    <form className="NumberSetter" onSubmit={submitHandler}>
      <input type="number" className="Input" onChange={updateNumberValue} value={number} />
      <div className="NumberSetter__button-bar">
        <button type="submit" className="Button Button__primary" disabled={!editMode}>Set number</button>
        <button type="button" className="Button" disabled={!editMode} onClick={() => setEditMode(false)}>Cancel</button>
      </div>
    </form>
  )
};

export default NumberSetter;
