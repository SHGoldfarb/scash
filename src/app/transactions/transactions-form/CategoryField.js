import React from "react";
import { TextField } from "@material-ui/core";
import { useReadData } from "hooks";
import { DelayedCircularProgress } from "components";
import { isActive } from "utils";

const CategoryField = (props) => {
  const { data: categories = [], loading } = useReadData("categories");

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const activeCategories = categories.filter(isActive);

  const defaultCategoryId = activeCategories[0]?.id;

  return (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Category"
      variant="filled"
      name="categoryId"
      id="transaction-category"
      fullWidth
      defaultValue={defaultCategoryId}
      {...props}
    >
      {categories.map((category) => (
        <option value={category.id} key={category.id}>
          {category.name}
        </option>
      ))}
    </TextField>
  );
};

export default CategoryField;
