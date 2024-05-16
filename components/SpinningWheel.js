import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';

const API_KEY = '38cd0b6035a6e858c4576e22989c2889';
const BASE_URL = 'https://api.themoviedb.org/3';

const { width } = Dimensions.get('window');
const itemWidth = 200;
const repeatFactor = 20; // Adjust this factor to create a sufficiently large list

const SpinningWheel = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [chosenMovies, setChosenMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [randomDuration, setRandomDuration] = useState(0);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    axios
      .get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: text,
        },
      })
      .then((response) => {
        setSearchResults(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChooseMovie = (movie) => {
    if (!chosenMovies.some((chosenMovie) => chosenMovie.id === movie.id)) {
      setChosenMovies([...chosenMovies, movie]);
    }
  };

  const handleRemoveMovie = (movie) => {
    Alert.alert(
      'Delete Movie',
      `Do you want to delete ${movie.title} from the carousel?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newChosenMovies = chosenMovies.filter((chosenMovie) => chosenMovie.id !== movie.id);
            setChosenMovies(newChosenMovies);
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (isSpinning) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, randomDuration);
      return () => clearTimeout(timer);
    }
  }, [isSpinning, randomDuration]);

  const handleSpin = () => {
    if (chosenMovies.length > 0) {
      setRandomDuration(Math.floor(Math.random() * 5000) + 5000); // Random duration between 5000 and 10000 ms
      setIsSpinning(true);
    } else {
      console.log('No movies in the chosen list to spin.');
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMoviePress(item)}
      onLongPress={() => handleRemoveMovie(item)}
      style={styles.itemContainer}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.itemImage}
      />
    </TouchableOpacity>
  );

  // Create a repeated array of chosenMovies to simulate infinite looping
  const infiniteMovies = Array.from({ length: repeatFactor }).flatMap(() => chosenMovies);

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search movies..."
        onChangeText={handleSearch}
        value={searchText}
        lightTheme
        round
        showLoading={false}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieButton}
            onPress={() => handleChooseMovie(item)}
          >
            <Image
              style={styles.movieImage}
              source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No movies found.</Text>
        )}
        style={styles.searchResultsList}
      />
      <View style={styles.carouselContainer}>
        <Carousel
          width={width}
          height={width / 2}
          data={infiniteMovies}
          renderItem={renderItem}
          autoPlay={isSpinning}
          loop={isSpinning}
          autoPlayInterval={50} // Adjust the interval for spinning speed
        />
        <View style={styles.overlay} />
      </View>
      <TouchableOpacity style={styles.spinButton} onPress={handleSpin}>
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'Spinning...' : 'START SPIN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  searchBarContainer: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
  },
  movieButton: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  movieImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginRight: 10,
  },
  movieTitle: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyListText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  searchResultsList: {
    maxHeight: '40%',
  },
  carouselContainer: {
    height: 300,
    backgroundColor: '#1C1C1E', // Same color as screen background
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: width / 3,
    height: width / 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  spinButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
});

export default SpinningWheel;
