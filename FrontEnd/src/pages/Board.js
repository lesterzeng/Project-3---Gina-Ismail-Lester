import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getThingsDoneActions } from "../store/getThingsDone";

import CardModal from "../components/Board/Board_Modals/CardModal";
import EditCardModal from "../components/Board/Board_Modals/EditCardModal";
import ListOfCards from "../components/Board/ListOfCards";

// import TodoList from "../components/toDelete/TodoList";
// import InProgress from "../components/toDelete/InProgress";
// import Completed from "../components/toDelete/Completed";
// import Modal from "../components/Modal";

const Board = (props) => {
  const dispatch = useDispatch();
  const storeAllBoardsInfo = useSelector(
    (state) => state.getThingsDone.allBoardsInfo
  );
  const storeButtonToggle = useSelector(
    (state) => state.getThingsDone.buttonToggle
  );
  const ListsOfCards = ["toDo", "inProgress", "complete"];

  const token = localStorage.getItem("token");

  const { id } = useParams();

  let boardsInfo = storeAllBoardsInfo.filter((obj) => obj._id === id);

  useEffect(() => {
    for (let i = 0; i < ListsOfCards.length; i++) {
      fetch(`http://localhost:5000/boards/display/cards/${ListsOfCards[i]}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({ boardId: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!data.status) {
            console.log("Board data obtained!");
            switch (ListsOfCards[i]) {
              case "toDo":
                dispatch(
                  getThingsDoneActions.storeToDoList({
                    toDoList: data,
                  })
                );
                break;
              case "inProgress":
                dispatch(
                  getThingsDoneActions.storeInProgressList({
                    inProgressList: data,
                  })
                );
                break;
              case "complete":
                dispatch(
                  getThingsDoneActions.storeCompletedList({
                    completedList: data,
                  })
                );
                break;
              default:
                console.log("list error");
            }
          }
          if (data.status === "error") {
            console.log("got error");
            dispatch(
              getThingsDoneActions.getError({
                errorMsg: data.message,
              })
            );
          }
        })
        .catch((error) => {
          console.log("Connection Error", error.message);
        });
    }
  }, [storeButtonToggle]);

  let list = [];
  for (let i = 0; i < ListsOfCards.length; i++) {
    list.push(
      <ListOfCards
        boardId={id}
        status={ListsOfCards[i]}
        nextStatus={ListsOfCards[i + 1]}
      />
    );
  }

  return (
    <div>
      <div className="text-sky-500 text-5xl">
        {boardsInfo[0] && boardsInfo[0].title}
      </div>
      <div>
        <div className="grid grid-cols-3 gap-6 mt-4 w-full">
          <EditCardModal boardId={id} />
          <CardModal boardId={id} />
          {list}
          {/* <TodoList
            boardId={id}
            status={ListsOfCards[0]}
            nextStatus={ListsOfCards[1]}
          />
          <InProgress
            boardId={id}
            status={ListsOfCards[1]}
            nextStatus={ListsOfCards[2]}
          />
          <Completed
            boardId={id}
            status={ListsOfCards[2]}
            nextStatus={ListsOfCards[3]}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Board;
