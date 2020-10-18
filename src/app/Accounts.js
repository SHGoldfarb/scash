import React, { useState } from "react";
import { func, string } from "prop-types";
import { Delete, Done, Edit } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";

const EditAccount = ({ name, onConfirm }) => {
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
          onConfirm(shownValue);
          setInputValue(null);
        }}
      >
        <Done color="primary" />
      </IconButton>
    </div>
  );
};

EditAccount.propTypes = {
  name: string.isRequired,
  onConfirm: func.isRequired,
};

const AccountField = ({ name, onDelete, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditAccount
      name={name}
      onConfirm={(newName) => {
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

const useAccounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);

  const deleteAccount = (idToDelete) =>
    setAccounts(accounts.filter(({ id }) => id !== idToDelete));

  const upsertAccount = (newAccount) => {
    if (!accounts.map(({ id }) => id).includes(newAccount.id)) {
      // Is new account
      setAccounts([...accounts, newAccount]);
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
      {accounts.map((account) => (
        <AccountField
          key={account.id}
          name={account.name}
          onDelete={() => deleteAccount(account.id)}
          onNameChange={(name) => upsertAccount({ ...account, name })}
        />
      ))}
    </div>
  );
};

export default Accounts;
