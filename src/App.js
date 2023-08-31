import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let gameStatus;
  if (winner) {
    gameStatus = "Winner: " + winner;
  } else {
    gameStatus = "Next player: " + (xIsNext ? "X" : "O");
  }

  const squaresList = [
    {
      id: 1,
      rowSquares: [
        { id: 0, square: 0 },
        { id: 1, square: 1 },
        { id: 2, square: 2 },
      ],
    },
    {
      id: 2,
      rowSquares: [
        { id: 3, square: 3 },
        { id: 4, square: 4 },
        { id: 5, square: 5 },
      ],
    },
    {
      id: 3,
      rowSquares: [
        { id: 6, square: 6 },
        { id: 7, square: 7 },
        { id: 8, square: 8 },
      ],
    },
  ];

  const getRowsContent = (squaresList) => {
    let content = [];
    for (let item of squaresList) {
      content.push(
        <div className="board-row" key={item.id}>
          {getSquaresContent(item.rowSquares)}
        </div>
      );
    }
    return content;
  };

  const getSquaresContent = (squaresList) => {
    let content = [];
    for (let item of squaresList) {
      content.push(
        <Square
          key={item.id}
          value={squares[item.square]}
          onSquareClick={() => handleClick(item.square)}
        />
      );
    }
    return content;
  };

  return (
    <>
      <div className="gameStatus">{gameStatus}</div>
      {getRowsContent(squaresList)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    let showTextOrButton;
    if (currentMove === move) {
      showTextOrButton = <p>{"You are at move #" + move}</p>;
    } else {
      showTextOrButton = (
        <button onClick={() => jumpTo(move)}>{description}</button>
      );
    }

    return <li key={move}>{showTextOrButton}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        ></Board>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
