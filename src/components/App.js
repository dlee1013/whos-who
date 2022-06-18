import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import fetchFromSpotify, { request } from '../services/api';
import { useHistory } from 'react-router-dom';

import Home from './Home';
import Game from './Game';

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token';
const TOKEN_KEY = 'whos-who-access-token';

const App = () => {
  let history = useHistory();

  const [genres, setGenres] = useState([]);
  const [songPreview, setSongPreview] = useState([]);
  const [namesOfArtists, setNamesOfArtists] = useState([]);
  const [artistDropdownList, setArtistDropdownList] = useState([]);
  const [chosenArtist, setChosenArtist] = useState('');
  const [artistsSongs, setArtistsSongs] = useState([]);
  const [numOfSongs, setNumOfSongs] = useState([1, 2, 3]);
  const [numOfArtists, setNumOfArtists] = useState([2, 3, 4]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedNumOfSongs, setSelectedNumOfSongs] = useState(2);
  const [selectedNumOfArtists, setSelectedNumOfArtists] = useState(3);
  const [updateGame, setUpdateGame] = useState({
    genres: 'chill',
    songs: 2,
    artists: 3,
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState('');

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'recommendations/available-genre-seeds',
    });
    setGenres(response.genres);
    setConfigLoading(false);
  };

  const loadSongs = async (t, id) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: `artists/${id}/top-tracks`,
      params: { id: id, market: 'us' },
    });
    //iterate through array and if preview url doesn't exist call loadArtists again
    const songsWithPreview = [];

    for (let i = 0; i < response.tracks.length; i += 1) {
      if (response.tracks[i].preview_url) {
        songsWithPreview.push(response.tracks[i]);
      }
    }

    setArtistsSongs(response.tracks);
    setSongPreview([
      songsWithPreview[0].preview_url,
      songsWithPreview[1].preview_url,
      songsWithPreview[2].preview_url,
      songsWithPreview[3].preview_url,
    ]);
    setConfigLoading(false);

    console.log(response.tracks);
    console.log(songsWithPreview);
  };

  const loadArtists = async (t) => {
    setConfigLoading(true);
    const artistsArray = [];
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'search',
      params: { q: `genre: ${selectedGenre}`, type: 'artist' },
    });
    for (let i = 0; i < response.artists.items.length; i += 1) {
      artistsArray.push(response.artists.items[i].name);
    }
    //setChosenArtist
    const selectedArtist = getRandomInt(artistsArray.length);
    const theChosenArtist = artistsArray[selectedArtist];
    const artistId = response.artists.items[selectedArtist].id;
    //loadSongs

    const saved = JSON.parse(localStorage.getItem('gameKey'));
    const artists = saved.artists;
    const removeChosenArtist = artistsArray.filter(
      (item) => item !== theChosenArtist
    );
    const artistDropdown = removeChosenArtist
      .map((x) => ({ x, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((a) => a.x)
      .slice(0, artists - 1);
    artistDropdown.splice(getRandomInt(artists - 1), 0, theChosenArtist);
    //
    setArtistDropdownList(artistDropdown);
    loadSongs(token, artistId);
    setChosenArtist(theChosenArtist);
    setConfigLoading(false);
  };

  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log('Token found in localstorage');
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }

    console.log('Sending request to AWS endpoint');
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  const saveGame = () => {
    localStorage.setItem('gameKey', JSON.stringify(updateGame));
    history.push('/game');
    loadArtists(token);
  };

  const updateGenre = (event) => {
    setUpdateGame({ ...updateGame, genres: event.target.value });
    setSelectedGenre(event.target.value);
  };

  const updateSong = (event) => {
    setUpdateGame({ ...updateGame, songs: event.target.value });
    setSelectedNumOfSongs(event.target.value);
  };

  const updateArtist = (event) => {
    setUpdateGame({ ...updateGame, artists: event.target.value });
    setSelectedNumOfArtists(event.target.value);
  };

  const homeProps = {
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
  };

  const gameProps = {
    songPreview,
    artistDropdownList,
    artistsSongs,
    numOfArtists,
    chosenArtist,
    namesOfArtists,
    selectedGenre,
    selectedNumOfArtists,
    selectedNumOfSongs,
    loadSongs,
    loadArtists,
  };

  return (
    <div>
      <Route exact path="/" render={(props) => <Home {...homeProps} />} />
      <Route path="/game" render={(props) => <Game {...gameProps} />} />
    </div>
  );
};

export default App;
