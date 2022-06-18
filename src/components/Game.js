import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import styled from 'styled-components';

const StyledGame = styled.div`
  font-family: 'Poppins', 'sans-serif';
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 40px;

  & p {
    text-align: center;
  }
`;

const StyledButton = styled.button`
  background-color: white;
  color: black;
  border-radius: 2rem;
  border: 2px solid #333;
  padding: 10px;
  font-size: 40px;
  text-decoration: none;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background-color: lightgrey;
  }
`;

const StyledPlayAgain = styled.div`
  margin-top: 100px;
`;

const StyledSongs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  font-size: 30px;
  gap: 30px;
  padding: 40px;
`;

const StyledGuess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  & #guess {
    margin-top: 100px;
    font-size: 20px;
    border-radius: 2rem;
    width: 300px;
    height: 50px;
    margin: 10px;
    text-align: center;
  }

  & #correct {
    color: #00ff00;
  }

  & #wrong {
    color: #ff0000;
  }
`;

const Game = ({ songPreview, chosenArtist, artistDropdownList }) => {
  const [guess, setGuess] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [dropdownGuess, setDropdownGuess] = useState('');

  const song = songPreview;

  console.log(chosenArtist);

  const handlePlayerGuess = () => {
    setHasGuessed(true);
    if (
      dropdownGuess === chosenArtist ||
      artistDropdownList[0] === chosenArtist
    ) {
      setGuess(true);
    } else {
      setGuess(false);
    }
  };

  console.log('SONGS: ', song);

  const saved = JSON.parse(localStorage.getItem('gameKey'));
  const numOfSongs = saved.songs;
  const genre = saved.genres;
  let songArray = [];

  for (let i = 0; i < numOfSongs; i += 1) {
    songArray.push(
      new Howl({
        src: song[i],
        html5: true,
        volume: 0.1,
      })
    );
  }

  return (
    <StyledGame>
      {songArray === [] ? (
        <h1>loading game... please wait.</h1>
      ) : (
        <div>
          <h1>🎧Listen Closely🎧</h1>
          <div>
            {songArray.map((song, index) => (
              <StyledSongs>
                <label> Song {index + 1}</label>
                <StyledButton onClick={() => song.play()}> Play</StyledButton>
                <StyledButton onClick={() => song.pause()}> Pause</StyledButton>
              </StyledSongs>
            ))}
          </div>
          <StyledGuess>
            <select
              id="guess"
              onChange={(e) => setDropdownGuess(e.target.value)}
            >
              {artistDropdownList.map((artists) => (
                <option key={artists} value={artists}>
                  {artists}
                </option>
              ))}
            </select>
            <StyledButton onClick={() => handlePlayerGuess()}>
              Guess
            </StyledButton>
            {hasGuessed && (
              <>
                {guess ? (
                  <p id="correct"> Correct! Great work!</p>
                ) : (
                  <p id="wrong">Wrong. Try again! </p>
                )}
              </>
            )}
          </StyledGuess>
        </div>
      )}
      <a href="/">
        <StyledButton id="playAgain">Play Again!</StyledButton>
      </a>
    </StyledGame>
  );
};

export default Game;
