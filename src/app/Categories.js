import { Typography } from "@material-ui/core";
import React from "react";
import { EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const Categories = () => {
  const { loading, data: categories, update } = useReadData("categories");
  const { upsert, remove } = useWriteData("categories");

  const deleteCategory = async (idToDelete) => {
    await remove(idToDelete);
    update((currentCategories) =>
      currentCategories.filter(({ id }) => id !== idToDelete)
    );
  };

  const upsertCategory = async (newCategory) => {
    const returnedCategory = await upsert(newCategory);
    update((currentCategories) =>
      upsertById(currentCategories, returnedCategory)
    );
  };

  return (
    <>
      <Typography variant="h5">Categories</Typography>

      {loading ? (
        "Cargando..."
      ) : (
        <EditableList
          source={categories.map((category) => ({
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

export default Categories;
