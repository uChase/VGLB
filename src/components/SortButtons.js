"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function SortButtons({ slug, sort, rate }) {
  const [anchorElRating, setAnchorElRating] = React.useState(null);
  const [anchorElSortBy, setAnchorElSortBy] = React.useState(null);
  const [selectedRating, setSelectedRating] = React.useState(rate);
  const [selectedSortBy, setSelectedSortBy] = React.useState(sort);
  const router = useRouter();

  const handleRatingClick = (event) => {
    setAnchorElRating(event.currentTarget);
  };

  const handleSortByClick = (event) => {
    setAnchorElSortBy(event.currentTarget);
  };

  const handleRatingClose = () => {
    setAnchorElRating(null);
  };

  const handleSortByClose = () => {
    setAnchorElSortBy(null);
  };

  const handleRatingChange = (newValue) => {
    setSelectedRating(newValue);
    router.push(
      `/games/${slug}/review/all?rating=${newValue}&sort=${selectedSortBy}`
    );
    handleRatingClose();
  };

  const handleSortByChange = (option) => {
    setSelectedSortBy(option);
    router.push(
      `/games/${slug}/review/all?rating=${selectedRating}&sort=${option}`
    );
    handleSortByClose();
  };

  return (
    <div
      style={{ display: "flex", gap: "1em", justifyContent: "space-evenly" }}
      className=" border-b border-t border-slate-300 py-1"
    >
      <Typography
        variant="h6"
        component="div"
        style={{ display: "inline-block", marginRight: "10px", color: "white" }}
      >
        Sort By:
      </Typography>{" "}
      <div>
        <Button
          endIcon={<ExpandMoreIcon />}
          aria-haspopup="true"
          onClick={handleRatingClick}
          style={{ color: "white" }}
        >
          Rating
        </Button>
        <Menu
          anchorEl={anchorElRating}
          open={Boolean(anchorElRating)}
          onClose={handleRatingClose}
          PaperProps={{
            style: {
              backgroundColor: "rgba(112, 128, 144, 0.9)",
            },
          }}
        >
          <MenuItem onClick={handleRatingClose}>
            <Rating
              name="rating"
              defaultValue={selectedRating == "All" ? 0 : selectedRating}
              onChange={(event, newValue) => {
                handleRatingChange(newValue);
              }}
              sx={{ "& .MuiRating-icon": { color: "#F1FAEE" } }}
              precision={0.5}
            />
          </MenuItem>
          <MenuItem onClick={() => handleRatingChange("All")}>
            <Typography
              variant="inherit"
              noWrap
              style={{ textAlign: "center", width: "100%", color: "white" }}
            >
              All
            </Typography>
          </MenuItem>
        </Menu>
      </div>
      <div>
        <Button
          endIcon={<ExpandMoreIcon />}
          aria-haspopup="true"
          onClick={handleSortByClick}
          style={{ color: "white" }}
        >
          {selectedSortBy}
        </Button>
        <Menu
          anchorEl={anchorElSortBy}
          open={Boolean(anchorElSortBy)}
          onClose={handleSortByClose}
          PaperProps={{
            style: {
              backgroundColor: "rgba(112, 128, 144, 0.6)",
              color: "white",
            },
          }}
        >
          <MenuItem
            onClick={() => handleSortByChange("Popular")}
            style={{
              fontWeight: selectedSortBy === "Popular" ? "bold" : "normal",
            }}
          >
            Popular
          </MenuItem>
          <MenuItem
            onClick={() => handleSortByChange("Recent")}
            style={{
              fontWeight: selectedSortBy === "Recent" ? "bold" : "normal",
            }}
          >
            Recent
          </MenuItem>
          {/* <MenuItem
            onClick={() => handleSortByChange("Ratio")}
            style={{
              fontWeight: selectedSortBy === "Ratio" ? "bold" : "normal",
            }}
          >
            Ratios
          </MenuItem> */}
        </Menu>
      </div>
    </div>
  );
}
