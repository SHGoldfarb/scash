import React from "react";
import { string } from "prop-types";
import { TextField } from "@material-ui/core";
import { useReadData } from "hooks";
import { DelayedCircularProgress } from "components";
import { isActive } from "utils";

const CategoryField = ({ transactionType, ...props }) => {
  const categoriesTable =
    transactionType === "expense" ? "categories" : "incomeCategories";

  const { data: categories = [], loading } = useReadData(categoriesTable);

  if (transactionType === "transfer") {
    return null;
  }

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

CategoryField.propTypes = {
  transactionType: string.isRequired,
};

export default CategoryField;
