import React, { useCallback } from "react";
import { ElectronTSN } from "../../../types/preload";
import "./FilePicker.css";

declare const electronTSN: ElectronTSN;

export interface FilePickerProps {
  showFullpath?: boolean;
  filepath: string;
  filepathChange: (newFilepath: string) => void;
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
  const buttonClickHandler = useCallback(async () => {
    const newFilepath = await electronTSN.onSelectFile();
    if (newFilepath) {
      props.filepathChange(newFilepath);
    }
  }, []);

  const displayPath = props.showFullpath ? props.filepath : trimFilepath(props.filepath);

  return (
    <div className="FilePicker Input">
      <span className="FilePicker__path" title={displayPath}>{displayPath}</span>
      <button className="FilePicker__button Button" onClick={buttonClickHandler}>Browse...</button>
    </div>
  )
};

export default FilePicker;
