import { Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import React from "react";
import { EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const IncomeCategories = () => {
  const { loading, data: incomeCategories = [], update } = useReadData(
    "incomeCategories"
  );
  const { upsert } = useWriteData("incomeCategories");

  const deleteCategory = async (categoryToDelete) => {
    const returnedCategory = await upsert({
      ...categoryToDelete,
      deactivatedAt: DateTime.local().toSeconds(),
    });
    update((currentCategories) =>
      upsertById(currentCategories, returnedCategory)
    );
  };

  const upsertCategory = async (newCategory) => {
    const returnedCategory = await upsert(newCategory);
    update((currentCategories) =>
      upsertById(currentCategories, returnedCategory)
    );
  };

  const activeCategories = incomeCategories.filter(
    (category) => !category.deactivatedAt
  );

  return (
    <>
      <Typography variant="h5" color="textPrimary">
        Income Categories
      </Typography>

      {loading ? (
        "Cargando..."
      ) : (
        <EditableList
          source={activeCategories.map((category) => ({
            ...category,
            label: category.name,
          }))}
          onUpdate={(category) =>
            upsertCategory({ id: category.id, name: category.label })
          }
          onAdd={(category) => upsertCategory({ name: category.label })}
          onRemove={deleteCategory}
        />
      )}
    </>
  );
};

export default IncomeCategories;
