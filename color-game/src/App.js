import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  // State variables
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");

  // Generate a random base color
  const getRandomBaseColor = () => {
    return [
      Math.floor(Math.random() * 256), // Red
      Math.floor(Math.random() * 256), // Green
      Math.floor(Math.random() * 256), // Blue
    ];
  };

  // Convert RGB array to hex
  const rgbToHex = ([r, g, b]) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)}`;
  };

  // Generate a shade of the base color
  const generateShade = (baseColor, variation) => {
    return baseColor.map((c) => Math.min(255, Math.max(0, c + variation)));
  };

  // Initialize the game
  const initGame = (resetScore = false) => {
    const baseColor = getRandomBaseColor();
    const newTargetColor = rgbToHex(baseColor);
    setTargetColor(newTargetColor);

    // Generate 6 shades of the base color
    const options = new Set();
    options.add(newTargetColor);

    while (options.size < 6) {
      const variation = Math.floor(Math.random() * 50) - 25; // Vary color slightly
      const shade = rgbToHex(generateShade(baseColor, variation));
      options.add(shade);
    }

    // Shuffle options
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
    setColorOptions(shuffledOptions);

    // Reset game status
    setGameStatus("");
    setStatusClass("");
    
    // Reset score only if new game is triggered
    if (resetScore) {
      setScore(0);
    }
  };

  // Handle user's guess
  const handleGuess = (selectedColor) => {
    if (selectedColor === targetColor) {
      setGameStatus("Correct! 🎉");
      setStatusClass("correct");
      setScore((prevScore) => prevScore + 1);
      setTimeout(() => {
        setStatusClass(""); // Remove animation class after effect
        initGame();
      }, 1000);
    } else {
      setGameStatus("Wrong! Try again.");
      setStatusClass("wrong");
      setTimeout(() => {
        setStatusClass(""); // Remove animation class after effect
      }, 500);
    }
  };

  // Start the game on component mount
  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="container">
      <h1 className="instructions" data-testid="gameInstructions">Guess the correct color!</h1>
      <div className="color-box" style={{ backgroundColor: targetColor }} data-testid="colorBox"></div>

      <p className="score">Score: <span data-testid="score">{score}</span></p>
      <div className="color-options">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            className="color-button large-button"
            style={{ backgroundColor: color }}
            onClick={() => handleGuess(color)}
            data-testid="colorOption"
          ></button>
        ))}
      </div>
      <p className={`game-status ${statusClass}`} data-testid="gameStatus">{gameStatus}</p>

      <button className="new-game-button large-button" onClick={() => initGame(true)} data-testid="newGameButton">New Game</button>
    </div>
  );
}

export default App;
