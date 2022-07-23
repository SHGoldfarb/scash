import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { by } from "src/utils";
import { DelayedCircularProgress, EditableList } from "../components";
import { useData } from "../hooks";

const IncomeSources = () => {
  const { loading, data: incomeSources = [], upsert } = useData(
    "incomeSources"
  );

  const deleteIncomeSource = async (incomeSourceToDelete) => {
    await upsert({
      ...incomeSourceToDelete,
      closedAt: DateTime.local().toSeconds(),
    });
  };

  const upsertIncomeSource = async (newIncomeSource) => {
    await upsert(newIncomeSource);
  };

  const openIncomeSources = useMemo(
    () =>
      incomeSources
        .filter((incomeSource) => !incomeSource.closedAt)
        .sort(by("name")),
    [incomeSources]
  );

  return (
    <>
      <Typography variant="h5" color="textPrimary">
        Income Sources
      </Typography>

      {loading ? (
        <DelayedCircularProgress />
      ) : (
        <EditableList
          source={openIncomeSources.map((incomeSource) => ({
            ...incomeSource,
            label: incomeSource.name,
            onUpdate: (label) =>
              upsertIncomeSource({ id: incomeSource.id, name: label }),
            onRemove: () => deleteIncomeSource(incomeSource),
          }))}
          onAdd={(incomeSource) =>
            upsertIncomeSource({ name: incomeSource.label })
          }
        />
      )}
    </>
  );
};

export default IncomeSources;
