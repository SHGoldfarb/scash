import React, { useState } from "react";
import { Button } from "@mui/material";
import { NewObjectiveModal } from "./new-objective-button";

const NewObjectiveButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen ? (
        <NewObjectiveModal onClose={() => setModalOpen(false)} />
      ) : null}
      <Button onClick={() => setModalOpen(true)}>New Objective</Button>
    </>
  );
};

export default NewObjectiveButton;
