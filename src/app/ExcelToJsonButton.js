import React from "react";
import { Button } from "@mui/material";
import { read } from "xlsx";
import { download, excelToJson } from "utils";
import { DateTime } from "luxon";

const readAsArrayBuffer = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  });

const handleFileSelect = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    // eslint-disable-next-line no-console
    console.warn("No file selected?");
    return;
  }

  const workbook = read(await readAsArrayBuffer(file));

  const jsonData = excelToJson(workbook);

  download(
    `scash_converted_data_${DateTime.local().toFormat("yyyy-MM-dd_HH_mm_ss")}`,
    jsonData
  );
};

const ExcelToJsonButton = () => {
  return (
    <Button component="label">
      Excel to JSON
      <input
        type="file"
        hidden
        onChange={async (ev) => {
          await handleFileSelect(ev);
        }}
      />
    </Button>
  );
};

export default ExcelToJsonButton;
