import React, { ChangeEvent, FormEvent, useState } from "react";

export interface NumberSetterProps {
  numberChange: (newNumber: number) => void;
}

const NumberSetter = (props: NumberSetterProps) => {
  const [number, setNumber] = useState<number>(0);

  const updateNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseInt(event.target.value);
    if (isNaN(newNumber)) {
      return;
    }

    setNumber(newNumber);
  }

  const subitHandler = (event: FormEvent): void => {
    event.preventDefault();
    props.numberChange(number);
  };

  return (
    <form className="NumberSetter" onSubmit={subitHandler}>
      <input type="number" onChange={updateNumberValue} value={number} />
      <button type="submit">Set number</button>
    </form>
  )
};

export default NumberSetter;
