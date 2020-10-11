import React, { useState } from "react";
import { func, string } from "prop-types";
import { Delete, Done, Edit } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";

const EditAccount = ({ name, onChange }) => {
  const [inputValue, setInputValue] = useState(null);

  const shownValue = inputValue === null ? name : inputValue;

  return (
    <div>
      <TextField
        id="name-textfield"
        value={shownValue}
        onChange={(ev) => setInputValue(ev.target.value)}
      />
      <IconButton
        aria-label="save"
        onClick={() => {
          onChange(shownValue);
          setInputValue(null);
        }}
      >
        <Done color="primary" />
      </IconButton>
    </div>
  );
};

const AccountField = ({ name, onDelete, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditAccount
      name={name}
      onChange={(newName) => {
        onNameChange(newName);
        setIsEditing(false);
      }}
    />
  ) : (
    <div>
      {name}
      <IconButton aria-label="edit" onClick={() => setIsEditing(true)}>
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
  onNameChange: func.isRequired,
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
          onNameChange={(name) =>
            setAccounts(
              accounts.map((oldAccount) =>
                oldAccount.id === account.id
                  ? { ...oldAccount, name }
                  : oldAccount
              )
            )
          }
        />
      ))}
    </div>
  );
};

export default Accounts;
