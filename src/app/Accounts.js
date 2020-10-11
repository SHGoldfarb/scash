import React, { useState } from "react";
import { Delete } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);
  return (
    <div>
      {accounts.map((account) => (
        <div key={account.id}>
          {account.name}
          <IconButton
            aria-label="delete"
            onClick={() =>
              setAccounts(accounts.filter(({ id }) => id !== account.id))
            }
          >
            <Delete />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default Accounts;
