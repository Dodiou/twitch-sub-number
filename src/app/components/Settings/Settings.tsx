import React from "react";
import { SelectFileEvent } from "../../../types/preload";
import FilePicker from "../FilePicker/FilePicker";

export interface SettingsProps {
  countUpgrades?: boolean;
  countUpgradesChange: (newCountUpgrades: boolean) => void;
  loadNumber?: boolean;
  loadNumberChange: (newLoadNumber: boolean) => void;
  filepath: string;
  fileChange: (event: SelectFileEvent) => void;
}

const Settings = (props: SettingsProps) => {
  return (
    <div className="Settings Form">
      <div className="Form__group">
        <div className="Form__label">Settings:</div>
        <label>
          <input
            className="Input"
            type="checkbox"
            onChange={() => props.loadNumberChange(!props.loadNumber)}
            checked={props.loadNumber}
          />
          <span className="Form__checkbox-label">Load number from file</span>
        </label>

        <label>
          <input
            className="Input"
            type="checkbox"
            onChange={() => props.countUpgradesChange(!props.loadNumber)}
            checked={props.countUpgrades}
          />
          <span className="Form__checkbox-label">Count sub upgrades</span>
        </label>
      </div>

      <label className="Form__group">
        <div className="Form__label">Output file:</div>
        <FilePicker
          readFromFile={props.loadNumber}
          filepath={props.filepath}
          fileChange={props.fileChange}
        />
      </label>
    </div>
  )
};

export default Settings;
