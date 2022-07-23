import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, IconButton, Typography } from "@mui/material";
import { AppBar, DelayedCircularProgress } from "src/components";
import { Edit } from "@mui/icons-material";
import { useCurrentObjective } from "./hooks";
import { EditDialog } from "./objective-app-bar";

const ObjectiveAppBar = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const history = useHistory();
  const { loading, objective } = useCurrentObjective();

  if (loading) return <DelayedCircularProgress />;

  if (!objective) return <Typography>Error</Typography>;

  return (
    <AppBar>
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />
      <Button
        onClick={() => {
          history.goBack();
        }}
      >
        Back
      </Button>
      <Typography variant="h6" sx={{ margin: "auto" }}>
        {objective.name}
      </Typography>
      <IconButton
        onClick={() => {
          setEditDialogOpen(true);
        }}
      >
        <Edit />
      </IconButton>
    </AppBar>
  );
};

export default ObjectiveAppBar;
