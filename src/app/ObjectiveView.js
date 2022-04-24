import React from "react";
import {
  CurrentObjectiveTransactionsList,
  ObjectiveAppBar,
} from "./objective-view";

const ObjectiveView = () => {
  return (
    <>
      <ObjectiveAppBar />
      <CurrentObjectiveTransactionsList />
    </>
  );
};

export default ObjectiveView;
