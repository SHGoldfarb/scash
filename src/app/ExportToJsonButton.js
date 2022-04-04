import React from "react";
import { Button } from "@mui/material";
import { exportToJSON, download } from "utils";
import { DateTime } from "luxon";

const exportData = async () => {
  download(
    `scash_data_${DateTime.local().toFormat("yyyy-MM-dd_HH_mm")}`,
    await exportToJSON()
  );
};

const ExportToJsonButton = () => {
  return (
    <Button component="label" onClick={exportData}>
      Export to JSON
    </Button>
  );
};

export default ExportToJsonButton;
