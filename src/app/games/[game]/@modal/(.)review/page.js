"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/navigation";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import getGameBySlug from "@/utils/getGameBySlug";
import submitReview from "@/utils/submitReview";
import { useSession } from "next-auth/react";
import { getReviewByUserId } from "@/utils/getReview";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

function capitalizeSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const categories = [
  {
    label: "Gameplay",
    options: ["Masterpiece", "Good", "Nothing special", "Bad", "Unplayable"],
  },
  {
    label: "Graphics",
    options: ["Beautiful", "Good", "Will do", "Bad", "Awful"],
  },
  {
    label: "Story",
    options: ["Lovely", "Good", "Average", "Not great", "Snooze", "None"],
  },

  {
    label: "Price",
    options: [
      "Just buy it",
      "Worth the price",
      "Wait for sale",
      "Maybe 1¢",
      "Free",
    ],
  },
];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "#1f2937", // closest to bg-slate-950 in tailwind
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  maxHeight: "90vh", // 90% of the viewport height
};

const commonStyle = {
  color: "#F1FAEE", // closest to bg-slate-100 in tailwind
};

const buttonStyle = {
  borderColor: "#718096", // closest to bg-slate-300 in tailwind
  color: "#F1FAEE",
};
const dropdownMenuStyle = {
  backgroundColor: "#4A5568", // closest to bg-slate-700 in tailwind
};

export default function ReviewModal({ params }) {
  const [open, setOpen] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [platforms, setPlatforms] = React.useState([]);
  const [expanded, setExpanded] = React.useState(
    categories.reduce((acc, curr) => ({ ...acc, [curr.label]: true }), {})
  );
  const [values, setValues] = React.useState({
    Gameplay: "",
    Graphics: "",
    Story: "",
    Price: "",
  });
  const [stars, setStars] = React.useState(-1);
  const [reviewBody, setReviewBody] = React.useState("");
  const [consoleSelection, setConsoleSelection] = React.useState("");
  const [playStatus, setPlayStatus] = React.useState("");
  const [reviewTitle, setReviewTitle] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    async function getData() {
      const game = await getGameBySlug(params.game);

      if (new Date(game[0].release_dates?.[0].date * 1000) > new Date()) {
        router.back();
      }
      const review = await getReviewByUserId(session.user.id, game[0].id);
      if (review) {
        setStars(review.Stars);
        setReviewTitle(review.title);
        setReviewBody(review.content);
        setPlayStatus(review.gameStatus);
        setValues({
          Gameplay: review.tldr[0],
          Graphics: review.tldr[1],
          Story: review.tldr[2],
          Price: review.tldr[3],
        });
        setConsoleSelection(review.platform);
      }
    }

    getData();
  }, []);

  React.useEffect(() => {
    async function getPlatforms() {
      const platforms = (await getGameBySlug(params.game))[0]?.platforms;

      let newArray = platforms.map((obj) => {
        if (obj.name == "PC (Microsoft Windows)") {
          return "Windows PC";
        } else {
          return obj.name;
        }
      });
      setPlatforms(newArray);
    }

    getPlatforms();
  }, []);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const handleExpandClick = (category) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [category]: !prevExpanded[category],
    }));
  };

  const handleClose = () => {
    router.refresh();
    router.back();
    router.refresh();
  };
  const handleChange = (event) => setChecked(event.target.checked);

  const handleChangeRadioBoxes = (category) => (event) => {
    setValues({
      ...values,
      [category]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const game = await getGameBySlug(params.game);
    await submitReview(
      game[0].id,
      reviewBody,
      stars,
      consoleSelection,
      playStatus,
      values,
      session.user.id,
      reviewTitle
    );
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={commonStyle}
          >
            Review {capitalizeSlug(params.game)}
          </Typography>
          <Rating
            name="half-rating"
            defaultValue={0}
            precision={0.5}
            sx={{ ...commonStyle, "& .MuiRating-icon": { color: "#F1FAEE" } }}
            value={stars}
            onChange={(e, val) => {
              setStars(val);
            }}
          />

          <TextField
            fullWidth
            id="review"
            label="Your Review"
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: { color: "#F1FAEE" }, // Change input text color
            }}
            InputLabelProps={{
              // Change label color
              style: { color: "#3a86ff" },
            }}
            sx={{ my: 2, ...commonStyle }}
            value={reviewBody}
            onChange={(e) => {
              setReviewBody(e.target.value);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormControl variant="outlined" sx={{ mr: 1, minWidth: 120 }}>
              <InputLabel
                id="console-select-label"
                style={{ color: "#3a86ff" }}
              >
                Console
              </InputLabel>
              <Select
                labelId="console-select-label"
                id="console-select"
                label="Console"
                sx={{ color: "#D1D5DB" }}
                MenuProps={{ PaperProps: { style: dropdownMenuStyle } }} // Change dropdown background
                value={consoleSelection}
                onChange={(e) => setConsoleSelection(e.target.value)} // Update the state variable when the selection changes
              >
                {platforms.map((platform, index) => (
                  <MenuItem
                    key={index}
                    value={platform}
                    style={{ color: "#D1D5DB" }}
                  >
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="status-select-label" style={{ color: "#3a86ff" }}>
                Status
              </InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                label="Status"
                sx={{ color: "#D1D5DB" }}
                MenuProps={{ PaperProps: { style: dropdownMenuStyle } }} // Change dropdown background
                value={playStatus}
                onChange={(e) => setPlayStatus(e.target.value)} // Update the state variable when the selection changes
              >
                <MenuItem value={"Playing"} style={{ color: "#D1D5DB" }}>
                  Playing
                </MenuItem>
                <MenuItem value={"Finished"} style={{ color: "#D1D5DB" }}>
                  Finished
                </MenuItem>
                <MenuItem value={"Dropped"} style={{ color: "#D1D5DB" }}>
                  Dropped
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label={
                <React.Fragment>
                  <span>TLDR</span>
                  <Tooltip
                    title={`Wanna make a "Too Long Didn't Read" to summarize your opinion? Just fill this out!`}
                  >
                    <InfoIcon
                      fontSize="small"
                      style={{ marginLeft: 7, verticalAlign: "-4px" }}
                    />
                  </Tooltip>
                </React.Fragment>
              }
              sx={commonStyle}
            />
            {checked &&
              categories.map(({ label, options }) => (
                <Box
                  key={label}
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() => handleExpandClick(label)}
                  >
                    <Typography variant="h6" sx={{ fontSize: 16, mr: 1 }}>
                      {label}
                    </Typography>
                    <IconButton size="small" sx={{ padding: 0 }}>
                      <ExpandMoreIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                  <Collapse in={expanded[label]}>
                    <RadioGroup
                      row
                      name={label}
                      value={values[label]}
                      onChange={handleChangeRadioBoxes(label)}
                    >
                      {options.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio size="small" />}
                          label={
                            <Typography variant="body2">{option}</Typography>
                          }
                          sx={{ fontSize: 12 }}
                        />
                      ))}
                    </RadioGroup>
                  </Collapse>
                </Box>
              ))}
          </FormGroup>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={handleClose} sx={buttonStyle}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleSubmit} sx={buttonStyle}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
