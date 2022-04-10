import React from "react";
import { func, string } from "prop-types";
import { TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useFormCategories } from "./hooks";

const CategoryField = ({ transactionType, register }) => {
  const { availableCategories, loading } = useFormCategories(transactionType);

  if (transactionType === "transfer") {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const defaultCategoryId = availableCategories[0]?.id;

  const { name, ref, onBlur, onChange } = register("categoryId");

  return (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Category"
      variant="filled"
      id="transaction-category"
      fullWidth
      defaultValue={defaultCategoryId}
      name={name}
      inputRef={ref}
      onBlur={onBlur}
      onChange={onChange}
    >
      {availableCategories.map((category) => (
        <option value={category.id} key={category.id}>
          {category.name}
        </option>
      ))}
    </TextField>
  );
};

CategoryField.propTypes = {
  transactionType: string.isRequired,
  register: func.isRequired,
};

export default CategoryField;
