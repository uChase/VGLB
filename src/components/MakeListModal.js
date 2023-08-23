import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import FavGameSearchBar from "./FavGameSearchBar";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  sortableHandle,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createList, updateList } from "@/utils/listUtils";
import { getGameBySlugListVersion } from "@/utils/getGameBySlug";
const SortableItem = ({ children, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1, // Reduce opacity when dragging
    // scale: isSorting ? 1.1 : 1, // Increase scale when sorting
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
function gridSortingStrategy(rows, columns) {
  return (rects) => {
    return (activeRect) => {
      const activeIndex = rects.indexOf(activeRect);
      const activeRow = Math.floor(activeIndex / columns);
      const activeColumn = activeIndex % columns;

      return rects
        .map((rect, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;

          const dx = Math.abs(activeColumn - column);
          const dy = Math.abs(activeRow - row);

          const distance = dx + dy * columns;

          return { distance, index };
        })
        .sort((a, b) => a.distance - b.distance)[0].index;
    };
  };
}

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

export default function MakeListModal({
  open,
  setOpen,
  userId,
  isEdit = false,
  list,
  defaultSlug = false,
}) {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);

  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));

  const [addedGames, setAddedGames] = useState([
    // Example games for demonstration, replace with actual data
    // ... potentially more games
  ]);

  useEffect(() => {
    async function getFirstGame() {
      return await getGameBySlugListVersion(defaultSlug);
    }

    if (isEdit) {
      setListName(list.name);
      setListDescription(list.description);
      setIsOrdered(list.isOrdered);
      const games = list.gamesList.map((list) => {
        return JSON.parse(list);
      });
      setAddedGames(games);
    }
    if (defaultSlug) {
      getFirstGame().then((result) => {
        setAddedGames([result[0]]);
      });
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleRemoveGame = (event, gameId) => {
    event.stopPropagation();
    event.preventDefault();
    const newAddedGames = addedGames.filter((game) => game.id !== gameId);
    setAddedGames(newAddedGames);
  };

  const handleSubmit = async () => {
    // Here you would handle the form submission, e.g., sending the data to a server
    if (!isEdit) {
      await createList(
        listName,
        userId,
        listDescription,
        isOrdered,
        addedGames
      );
    } else {
      await updateList(
        listName,
        listDescription,
        isOrdered,
        addedGames,
        list.id
      );
    }
    handleClose();
    router.refresh();
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const oldIndex = active.data.current.sortable?.index;
      const newIndex = over.data.current.sortable?.index;

      if (typeof oldIndex === "undefined") {
        return;
      }
      if (oldIndex !== newIndex) {
        setAddedGames(arrayMove(addedGames, oldIndex, newIndex));
      }
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (active && over) {
      const oldIndex = active.data.current.sortable?.index;
      console.log(oldIndex);
      const newIndex = over.data.current.sortable?.index;
      console.log(newIndex);

      if (typeof oldIndex === "undefined") {
        return;
      }
      if (oldIndex !== newIndex) {
        setAddedGames(arrayMove(addedGames, oldIndex, newIndex));
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="list-modal-title"
        aria-describedby="list-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="list-modal-title"
            variant="h6"
            component="h2"
            sx={commonStyle}
          >
            {isEdit ? "Edit List" : "Create a New List"}
          </Typography>

          <TextField
            fullWidth
            id="list-name"
            label="List Name"
            variant="outlined"
            InputProps={{ style: { color: "#F1FAEE" } }}
            InputLabelProps={{ style: { color: "#3a86ff" } }}
            sx={{ my: 2, ...commonStyle }}
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />

          <TextField
            fullWidth
            id="list-description"
            label="List Description"
            multiline
            rows={4}
            variant="outlined"
            InputProps={{ style: { color: "#F1FAEE" } }}
            InputLabelProps={{ style: { color: "#3a86ff" } }}
            sx={{ my: 2, ...commonStyle }}
            value={listDescription}
            onChange={(e) => setListDescription(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isOrdered}
                onChange={(e) => setIsOrdered(e.target.checked)}
              />
            }
            label="Ordered List"
            sx={commonStyle}
          />
          <Typography variant="subtitle1" sx={{ mt: 2, ...commonStyle }}>
            Add Games
          </Typography>
          <FavGameSearchBar
            making={true}
            onGameSelected={(game) => {
              setAddedGames((current) => {
                // Check if the game is already in the addedGames array
                if (
                  current.some((existingGame) => existingGame.id === game.id)
                ) {
                  // If it is, return the current array without adding the new game
                  return current;
                } else {
                  // If it's not, add the new game to the array
                  return [...current, game];
                }
              });
            }}
          />
          {/* this list */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <SortableContext
              items={addedGames.map((game) => game.id.toString())}
              strategy={gridSortingStrategy(5, 5)} // Assuming a 5x5 grid
            >
              <List
                sx={{
                  maxHeight: 200,
                  height: 200,
                  overflow: "auto",
                  bgcolor: "#2c3e50",
                  borderRadius: "5px",
                  my: 1,
                }}
              >
                <div className="grid grid-cols-5 gap-3 ">
                  {addedGames.map((game, index) => (
                    <SortableItem key={game.id} id={game.id.toString()}>
                      <ListItem key={index} sx={{ py: 0 }}>
                        <div
                          key={game.id}
                          className="relative group border-2 border-slate-500 rounded-md overflow-hidden hover:border-slate-400 cursor-pointer"
                        >
                          <Image
                            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game?.cover?.image_id}.jpg`}
                            width={94}
                            height={182}
                            className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 h-full"
                          />

                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-all duration-200">
                            <p className="text-slate-100 text-center text-xs">
                              {game?.name}
                            </p>
                            <button
                              className=" z-50 pointer-events-auto absolute top-0  right-0 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
                              onMouseDown={(e) => {
                                handleRemoveGame(e, game.id);
                              }}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      </ListItem>
                    </SortableItem>
                  ))}
                </div>
              </List>
            </SortableContext>
          </DndContext>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
