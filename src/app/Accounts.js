import React, { useState } from "react";
import { func, string } from "prop-types";
import { Add, Delete, Done, Edit } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";

const EditingField = ({ value, onConfirm }) => {
  const [inputValue, setInputValue] = useState(null);

  const shownValue = inputValue === null ? value : inputValue;

  return (
    <div>
      <TextField
        id="value-textfield"
        value={shownValue}
        onChange={(ev) => setInputValue(ev.target.value)}
      />
      <IconButton
        aria-label="save"
        onClick={() => {
          onConfirm(shownValue);
          setInputValue(null);
        }}
      >
        <Done color="primary" />
      </IconButton>
    </div>
  );
};

EditingField.propTypes = {
  value: string.isRequired,
  onConfirm: func.isRequired,
};

const EditableField = ({ value, onDelete, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditingField
      value={value}
      onConfirm={(newName) => {
        onChange(newName);
        setIsEditing(false);
      }}
    />
  ) : (
    <div>
      {value}
      <IconButton aria-label="edit" onClick={() => setIsEditing(true)}>
        <Edit color="primary" />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDelete}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
};

const useAccounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);

  const newId = () => accounts.reduce((a, b) => Math.max(a, b.id), 1) + 1;

  const deleteAccount = (idToDelete) =>
    setAccounts(accounts.filter(({ id }) => id !== idToDelete));

  const upsertAccount = (newAccount) => {
    if (!accounts.map(({ id }) => id).includes(newAccount.id)) {
      // Is new account
      setAccounts([
        ...accounts,
        { ...newAccount, id: newAccount.id || newId() },
      ]);
    } else {
      setAccounts(
        accounts.map((oldAccount) =>
          oldAccount.id === newAccount.id
            ? { ...oldAccount, ...newAccount }
            : oldAccount
        )
      );
    }
  };

  return [accounts, deleteAccount, upsertAccount];
};

const Accounts = () => {
  const [accounts, deleteAccount, upsertAccount] = useAccounts();
  return (
    <div>
      <pre>{JSON.stringify(accounts)}</pre>
      {accounts.map((account) => (
        <EditableField
          key={account.id}
          value={account.name}
          onDelete={() => deleteAccount(account.id)}
          onChange={(name) => upsertAccount({ ...account, name })}
        />
      ))}
      <IconButton
        aria-label="Create"
        onClick={() => upsertAccount({ name: "New Account" })}
      >
        <Add color="primary" />
      </IconButton>
    </div>
  );
};

export default Accounts;
