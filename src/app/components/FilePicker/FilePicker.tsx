import React from "react";
import { ElectronTSN, SelectFileEvent } from "../../../types/preload";
import "./FilePicker.css";

import { Logger } from "../../services/ui-logger";

declare const electronTSN: ElectronTSN;

export interface FilePickerProps {
  filepath: string;
  fileChange: (event: SelectFileEvent) => void;
  readFromFile?: boolean;
  showFullpath?: boolean;
}

const trimFilepath = (filepath: string): string => {
  let lastDirIndex = filepath.lastIndexOf('/');
  lastDirIndex = lastDirIndex >= 0 ? lastDirIndex : filepath.lastIndexOf('\\');

  if (lastDirIndex >= 0 && lastDirIndex < filepath.length - 1) {
    return filepath.substring(lastDirIndex + 1);
  }
  return filepath;
};

const FilePicker = (props: FilePickerProps) => {
  const buttonClickHandler = async () => {
    try {
      const event = await electronTSN.onSelectFile(props.readFromFile);

      if (event.filepath) {
        props.fileChange(event);
      }
    }
    catch(err) {
      Logger.error("Error selecting file.", err);
    }
  };

  const displayPath = props.showFullpath ? props.filepath : trimFilepath(props.filepath);

  return (
    <div className="FilePicker Input">
      <span className="FilePicker__path" title={props.filepath}>{displayPath}</span>
      <button className="FilePicker__button Button" onClick={buttonClickHandler}>Browse...</button>
    </div>
  )
};

export default FilePicker;
