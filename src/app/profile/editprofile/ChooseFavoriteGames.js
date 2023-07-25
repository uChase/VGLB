"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FavGameSearchBar from "@/components/FavGameSearchBar";
import { updateFavoriteGames } from "@/utils/updateFavoriteGames";
import { getGameById } from "@/utils/getGameById";
import Image from "next/image";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ordinalSuffix(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

const theme = createTheme({
  palette: {
    background: {
      default: "#111827", // this corresponds to bg-slate-900 in tailwind
    },
    text: {
      primary: "#D1D5DB", // this corresponds to text-slate-100 in tailwind
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#D1D5DB", // this corresponds to text-slate-100 in tailwind
        },
        selected: {
          color: "#ffffff", // you can adjust the selected tab's color here
        },
      },
    },
  },
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 500,
  bgcolor: "background.default",
  color: "text.primary",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto", // Add scrollbar if the content exceeds the modal size
};

export default function ChooseFavoriteGames({ userId, favGames }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [selectedGames, setSelectedGames] = React.useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  React.useEffect(() => {
    const loadGames = async (favGames) => {
      const arr = [];
      for (let i = 0; i < 5; i++) {
        if (favGames[i] != "empty") {
          arr[i] = (await getGameById(parseInt(favGames[i])))[0];
        } else {
          arr[i] = null;
        }
      }
      setSelectedGames(arr);
    };

    loadGames(favGames);
  }, []);

  const handleSubmit = async () => {
    handleClose();
    await updateFavoriteGames(selectedGames, userId);
  };

  const handleOpen = (tabIndex) => {
    setValue(tabIndex);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGameSelected = (index, game) => {
    const newSelectedGames = [...selectedGames];
    newSelectedGames[index] = game;
    setSelectedGames(newSelectedGames);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className=" mb-5">
        {[...Array(5)].map((_, index) => (
          <Button
            variant="outlined"
            className="mx-2"
            onClick={() => handleOpen(index)}
            key={index}
          >
            {`${ordinalSuffix(index + 1)}`}
          </Button>
        ))}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select Favorite Games
            </Typography>
            <Tabs value={value} onChange={handleChange}>
              {[...Array(5)].map((_, index) => (
                <Tab label={`${ordinalSuffix(index + 1)}`} key={index} />
              ))}
            </Tabs>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "66%",
              }}
            >
              {[...Array(5)].map((_, index) => (
                <TabPanel value={value} index={index}>
                  <FavGameSearchBar
                    onGameSelected={(game) => handleGameSelected(value, game)}
                  />
                  <div className="flex flex-col items-center  ">
                    <h1 className="my-4">
                      Current Favorite:{" "}
                      {selectedGames[value]
                        ? selectedGames[value].name
                        : "none"}
                    </h1>
                    <Image
                      src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${selectedGames[value]?.cover?.image_id}.jpg`}
                      width={120}
                      height={172}
                    />
                  </div>
                </TabPanel>
              ))}
            </Box>
            <Box
              sx={{
                alignSelf: "flex-end",
                display: "flex",
                gap: 2,
                justifyContent: "space-evenly",
              }}
            >
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: "red.500",
                  "&:hover": {
                    backgroundColor: "red.700",
                  },
                  color: "white",
                  fontWeight: "bold",
                  py: 2,
                  px: 4,
                  borderRadius: "rounded",
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "red.500",
                  "&:hover": {
                    backgroundColor: "red.700",
                  },
                  color: "white",
                  fontWeight: "bold",
                  py: 2,
                  px: 4,
                  borderRadius: "rounded",
                }}
              >
                Save and Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}
