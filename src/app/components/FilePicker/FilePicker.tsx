import React, { ChangeEvent } from "react";

export interface FilePickerProps {
  loadNumber?: boolean;
  loadNumberChange: (newLoadNumber: boolean) => void;
  filepathChange: (newFilepath: string) => void;
}

const FilePicker = (props: FilePickerProps) => {
  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const firstFilepath = event.target.files?.[0]?.path;
    if (!firstFilepath) {
      return;
    }

    props.filepathChange(firstFilepath);
  };

  return (
    <div className="FilePicker">
      <label>
        <input type="checkbox" onChange={() => props.loadNumberChange(!props.loadNumber)} checked={props.loadNumber}/>
        Load number from file?
      </label>
      <label>
        Output file:
        <input type="file" onChange={onFilesChange} />
      </label>
    </div>
  )
};

export default FilePicker;
