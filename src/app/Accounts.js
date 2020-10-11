import React, { useState } from "react";
import { func, string } from "prop-types";
import { Delete, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const AccountField = ({ name, onDelete, onChange }) => {
  return (
    <div>
      {name}
      <IconButton aria-label="edit" onClick={onDelete}>
        <Edit color="primary" />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDelete}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
};

AccountField.propTypes = {
  name: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);
  return (
    <div>
      {accounts.map((account) => (
        <AccountField
          key={account.id}
          name={account.name}
          onDelete={() =>
            setAccounts(accounts.filter(({ id }) => id !== account.id))
          }
        />
      ))}
    </div>
  );
};

export default Accounts;
