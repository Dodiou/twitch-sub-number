import React, { PropsWithChildren } from "react";

export interface ExpandPanelProps extends PropsWithChildren {
  expanded: boolean;
  expandedChange: (newExpanded: boolean) => void;
  label: string;
}

const COLLAPSE_ICON_CODE = "&darr";
const EXPAND_ICON_CODE = "&uarr";

const ExpandPanel = (props: ExpandPanelProps) => {
  return (
    <div className="ExpandPanel">
      <div className="ExpandPanel__toolbar">{ props.label } { props.expanded ? COLLAPSE_ICON_CODE : EXPAND_ICON_CODE }</div>
      { props.expanded && props.children }
    </div>
  )
};

export default ExpandPanel;
