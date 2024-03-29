import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { waitms } from "src/utils";

const DelayedCircularProgress = (props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await waitms(500);

      if (!unmounted) {
        setShow(true);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  return show ? <CircularProgress sx={{ margin: "auto" }} {...props} /> : null;
};

export default DelayedCircularProgress;
