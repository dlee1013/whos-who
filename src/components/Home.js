import React from 'react';
import styled from 'styled-components';

const StyledHome = styled.div`
  font-family: 'Poppins', 'sans-serif';
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  font-size: 40px;

  & select {
    padding: 10px;
    font-size: 20px;
  }

  & #number {
    padding: 15px 40px 15px 40px;
  }

  & select {
    border-radius: 2rem;
  }

  & #dropdown {
    text-align: center;
  }
`;

const StyledButtons = styled.button`
  background-color: white;
  color: black;
  border: 2px solid #333;
  border-radius: 2rem;
  padding: 10px;
  margin: 100px;
  font-size: 30px;
  text-decoration: none;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: lightgrey;
  }
`;

const Home = (props) => {
  const {
    selectedGenre,
    selectedNumOfArtists,
    selectedNumOfSongs,
    updateGenre,
    updateSong,
    updateArtist,
    genres,
    numOfArtists,
    numOfSongs,
    authLoading,
    configLoading,
    saveGame,
  } = props;

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledHome>
      <h1>🎤 Name That Artist! 🎤</h1>
      Genre:
      <select value={selectedGenre} onChange={updateGenre}>
        <option value="" />
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      Number of songs:
      <select id="number" value={selectedNumOfSongs} onChange={updateSong}>
        <option value="" />
        {numOfSongs.map((songs) => (
          <option key={songs} value={songs}>
            {songs}
          </option>
        ))}
      </select>
      Number of Artists:
      <select id="number" value={selectedNumOfArtists} onChange={updateArtist}>
        <option value="" />
        {numOfArtists.map((artists) => (
          <option key={artists} value={artists}>
            {artists}
          </option>
        ))}
      </select>
      <StyledButtons onClick={saveGame}>Play the Game! </StyledButtons>
    </StyledHome>
  );
};

export default Home;
