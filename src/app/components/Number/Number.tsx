import React from "react";
import "./Number.css";

export interface NumberProps {
  value: number;
}

const Number = (props: NumberProps) => {
  return (
    <div className="Number">
      <div className="Number__label">Current sub number:</div>
      <div className="Number__value">{props.value}</div>
    </div>
  )
};

export default Number;
