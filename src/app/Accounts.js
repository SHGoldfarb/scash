import React, { useState } from "react";

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);
  return <div>{JSON.stringify(accounts)}</div>;
};

export default Accounts;
