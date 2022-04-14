import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { DelayedCircularProgress, EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const IncomeSources = () => {
  const { loading, data: incomeSources = [], update } = useReadData(
    "incomeSources"
  );
  const { upsert } = useWriteData("incomeSources");

  const deleteIncomeSource = async (incomeSourceToDelete) => {
    const returnedIncomeSource = await upsert({
      ...incomeSourceToDelete,
      closedAt: DateTime.local().toSeconds(),
    });
    update((currentIncomeSources) =>
      upsertById(currentIncomeSources, returnedIncomeSource)
    );
  };

  const upsertIncomeSource = async (newIncomeSource) => {
    const returnedIncomeSource = await upsert(newIncomeSource);
    update((currentIncomeSources) =>
      upsertById(currentIncomeSources, returnedIncomeSource)
    );
  };

  const openIncomeSources = incomeSources.filter(
    (incomeSource) => !incomeSource.closedAt
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
