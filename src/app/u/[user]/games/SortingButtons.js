"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function SortingButtons({ slug, sort, rate }) {
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
    router.push(`/u/${slug}/games?rating=${newValue}&sort=${selectedSortBy}`);
    handleRatingClose();
  };

  const handleSortByChange = (option) => {
    setSelectedSortBy(option);
    router.push(`/u/${slug}/games?rating=${selectedRating}&sort=${option}`);
    handleSortByClose();
  };

  return (
    <div
      style={{ display: "flex", gap: "1em", justifyContent: "space-evenly" }}
      className="  border-slate-300 "
    >
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
              backgroundColor: "rgba(112, 128, 144, 0.9)",
              color: "white",
            },
          }}
        >
          <MenuItem
            onClick={() => handleSortByChange("Highest")}
            style={{
              fontWeight: selectedSortBy === "Highest" ? "bold" : "normal",
            }}
          >
            Highest First
          </MenuItem>
          <MenuItem
            onClick={() => handleSortByChange("Lowest")}
            style={{
              fontWeight: selectedSortBy === "Lowest" ? "bold" : "normal",
            }}
          >
            Lowest First
          </MenuItem>
          <MenuItem
            onClick={() => handleSortByChange("Recent")}
            style={{
              fontWeight: selectedSortBy === "Recent" ? "bold" : "normal",
            }}
          >
            Recent
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
