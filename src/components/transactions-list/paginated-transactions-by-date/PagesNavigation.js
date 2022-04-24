import React from "react";
import { Card, IconButton } from "@mui/material";
import { func, node } from "prop-types";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { PAGE_INFO_HEIGHT_PX } from "../utils";

const PAGE_INFO_MARGIN_SPACING = 1;

const PageCardContainer = styled("div")(({ theme }) => ({
  position: "fixed",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  zIndex: 1000,
}));

const PagesNavigation = ({
  handleNavigateBefore,
  handleNavigateNext,
  middleContent,
}) => {
  return (
    <PageCardContainer>
      <Card
        sx={{
          margin: PAGE_INFO_MARGIN_SPACING,
          marginBottom: 0,
          height: `${PAGE_INFO_HEIGHT_PX}px`,
          display: "flex",
          width: (theme) =>
            `calc(100% - ${theme.spacing(PAGE_INFO_MARGIN_SPACING * 2)})`,
        }}
      >
        <IconButton onClick={handleNavigateBefore} sx={{ margin: "auto" }}>
          <NavigateBefore />
        </IconButton>
        {middleContent}
        <IconButton onClick={handleNavigateNext} sx={{ margin: "auto" }}>
          <NavigateNext />
        </IconButton>
      </Card>
    </PageCardContainer>
  );
};

PagesNavigation.propTypes = {
  handleNavigateBefore: func.isRequired,
  handleNavigateNext: func.isRequired,
  middleContent: node.isRequired,
};

export default PagesNavigation;
