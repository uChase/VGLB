"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/navigation";
import { addGameToList, getLists } from "@/utils/listUtils";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "#1f2937",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  maxHeight: "90vh",
};

const commonStyle = {
  color: "#F1FAEE",
};

const buttonStyle = {
  borderColor: "#718096",
  color: "#F1FAEE",
};

export default function AddToListModal({
  open,
  setOpen,
  userId,
  slug,
  setOpenMake,
}) {
  const [selectedLists, setSelectedLists] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const router = useRouter();

  React.useEffect(() => {
    async function retrieveLists() {
      return await getLists(userId);
    }

    retrieveLists().then((result) => {
      setLists(result);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleNew = () => {
    setOpen(false);
    setOpenMake(true);
  };

  const handleListClick = (index) => {
    if (selectedLists.includes(index)) {
      setSelectedLists(selectedLists.filter((i) => i !== index));
    } else {
      setSelectedLists([...selectedLists, index]);
    }
  };

  const handleConfirm = async () => {
    // Add your logic here to handle the selected list
    for (let list of selectedLists) {
      console.log(list);
      await addGameToList(slug, lists[list].id);
    }
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
            Choose List to Add To
          </Typography>
          <List sx={{ maxHeight: 200, overflow: "auto" }}>
            {lists.map((list, index) => (
              <ListItem
                key={index}
                button
                // selected={selectedList === index}
                onClick={() => handleListClick(index)}
              >
                <ListItemText primary={list.name} />

                <Checkbox
                  edge="end"
                  checked={selectedLists.includes(index)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItem>
            ))}
          </List>
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
            <Button variant="outlined" onClick={handleNew} sx={buttonStyle}>
              Make New List
            </Button>
            <Button variant="outlined" onClick={handleConfirm} sx={buttonStyle}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
