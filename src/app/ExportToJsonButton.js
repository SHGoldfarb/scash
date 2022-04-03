import React from "react";
import { Button } from "@mui/material";
import { download } from "utils";
import { DateTime } from "luxon";
import { getAll } from "../database";

const exportData = async () => {
  download(
    `scash_data_${DateTime.local().toFormat("yyyy-MM-dd_HH_mm")}`,
    JSON.stringify({
      transactions: await getAll("transactions"),
      accounts: await getAll("accounts"),
      categories: await getAll("categories"),
      incomeCategories: await getAll("incomeCategories"),
    })
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
