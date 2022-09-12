import React, { PropsWithChildren } from "react";
import { ClassNameProps } from "../types";
import "./ExpandPanel.css";

export interface ExpandPanelProps extends ClassNameProps, PropsWithChildren {
  expanded: boolean;
  expandedChange: (newExpanded: boolean) => void;
  expandedHeight: string;
  label: string;
}

const COLLAPSE_ICON_CODE = "\u2193";
const EXPAND_ICON_CODE = "\u2191";

const ExpandPanel = (props: ExpandPanelProps) => {
  let expandClass = " ExpandPanel__expanded";
  let expandIcon = COLLAPSE_ICON_CODE;
  let expandStyles: Record<string, string> = { height: props.expandedHeight };

  if (!props.expanded) {
    expandClass = " ExpandPanel__collapsed";
    expandIcon = EXPAND_ICON_CODE;
    expandStyles = {};
  }

  const clickHandler = () => props.expandedChange(!props.expanded);

  return (
    <div
      className={ "ExpandPanel " + (props.className || "") + expandClass }
      style={expandStyles}
    >
      <div className="ExpandPanel__toolbar">
        <span onClick={clickHandler}>{ expandIcon + " " + props.label }</span>
      </div>
      { props.expanded && props.children }
    </div>
  )
};

export default ExpandPanel;
