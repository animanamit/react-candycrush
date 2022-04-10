import { useEffect, useState } from "react";

import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";

import "./App.css";

const width = 8;

const colors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);

  const [squareBeingDragged, setSquareBeingDragged] = useState(null);

  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      let col = [i, i + width, i + width * 2];
      let colorToCheck = currentColorArrangement[i];

      if (
        col.every((square) => currentColorArrangement[square] === colorToCheck)
      ) {
        col.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  const checkColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      let col = [i, i + width, i + width * 2, i + width * 3];
      let colorToCheck = currentColorArrangement[i];

      if (
        col.every((square) => currentColorArrangement[square] === colorToCheck)
      ) {
        col.forEach((square) => (currentColorArrangement[square] = blank));

        return true;
      }
    }
  };

  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      let row = [i, i + 1, i + 2];
      let colorToCheck = currentColorArrangement[i];

      let notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        row.every((square) => currentColorArrangement[square] === colorToCheck)
      ) {
        console.log("got a row!");
        row.forEach((square) => (currentColorArrangement[square] = blank));

        return true;
      }
    }
  };

  const checkRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      let row = [i, i + 1, i + 2, i + 3];
      let colorToCheck = currentColorArrangement[i];

      let notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];

      if (notValid.includes(i)) continue;

      if (
        row.every((square) => currentColorArrangement[square] === colorToCheck)
      ) {
        console.log("got a row!");
        row.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    // check if the square below is removed so that you can move there
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];

      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(colors.length * Math.random());
        currentColorArrangement[i] = colors[randomNumber];
      }

      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      randomColorArrangement.push(randomColor);
    }
    console.log(randomColorArrangement);

    setCurrentColorArrangement(randomColorArrangement);
  };

  const dragStart = (e) => {
    console.log("drag start");

    console.log(e.target);
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    console.log("drag drop");
    setSquareBeingReplaced(e.target);
    console.log(e.target);
  };

  const dragEnd = () => {
    console.log("drag end");

    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );

    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width,
      squareBeingDraggedId - 1,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isCol4 = checkColumnOfFour();
    const isRow4 = checkRowOfFour();
    const isCol3 = checkColumnOfThree();
    const isRow3 = checkRowOfThree();

    if (
      squareBeingDraggedId &&
      validMove &&
      (isCol4 || isRow4 || isCol3 || isRow3)
    ) {
      setSquareBeingDragged("");
      setSquareBeingReplaced("");
    } else {
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
    }
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkRowOfFour();
      checkColumnOfFour();
      checkRowOfThree();
      checkColumnOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    checkRowOfFour,
    checkRowOfThree,
    checkColumnOfFour,
    checkColumnOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => {
          return (
            <img
              key={index}
              //   style={{
              //     backgroundColor: candyColor,
              //   }}
              src={candyColor}
              data-id={index}
              draggable={true}
              alt="candy crush square"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDragStart={dragStart}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
