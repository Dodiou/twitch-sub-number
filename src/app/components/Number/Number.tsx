import React from "react";
import { ClassNameProps } from "../types";
import "./Number.css";

export interface NumberProps extends ClassNameProps {
  value: number;
}

const Number = (props: NumberProps) => {
  return (
    <div className={ "Number " + (props.className || "")}>
      <div className="Number__label">Current sub number</div>
      <div className="Number__value">{props.value}</div>
    </div>
  )
};

export default Number;
