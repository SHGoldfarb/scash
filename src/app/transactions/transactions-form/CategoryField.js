import React from "react";
import { string } from "prop-types";
import { TextField } from "@material-ui/core";
import { DelayedCircularProgress } from "components";
import { useFormCategories } from "./hooks";

const CategoryField = ({ transactionType, ...props }) => {
  const { activeCategories, loading } = useFormCategories(transactionType);

  if (transactionType === "transfer") {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

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
      {activeCategories.map((category) => (
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
