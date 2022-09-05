import React, { ChangeEvent } from "react";
import FilePicker from "../FilePicker/FilePicker";

export interface SettingsProps {
  countUpgrades?: boolean;
  countUpgradesChange: (newCountUpgrades: boolean) => void;
  loadNumber?: boolean;
  loadNumberChange: (newLoadNumber: boolean) => void;
  filepath: string;
  filepathChange: (newFilepath: string) => void;
}

const Settings = (props: SettingsProps) => {
  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const firstFilepath = event.target.files?.[0]?.path;
    if (!firstFilepath) {
      return;
    }

    props.filepathChange(firstFilepath);
  };

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
        <FilePicker filepath={props.filepath} filepathChange={props.filepathChange} />
      </label>
    </div>
  )
};

export default Settings;
