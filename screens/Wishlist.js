import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { SearchBar } from 'react-native-elements';

const API_KEY = '38cd0b6035a6e858c4576e22989c2889';
const BASE_URL = 'https://api.themoviedb.org/3';

const Wishlist = ({ navigation }) => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [chosenMovies, setChosenMovies] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const moviesCollection = collection(FIRESTORE_DB, 'wishlists', user.uid, 'movies');
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map(doc => ({
                    id: Number(doc.id),  // Ensure ID is treated as a number
                    ...doc.data()
                }));
                setChosenMovies(movieList);
                console.log('Fetched wishlist:', movieList);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        } else {
            console.log('No user is signed in.');
        }
    };

    const searchMovies = async (text) => {
        setLoading(true);
        setSearchQuery(text);
        try {
            const response = await axios.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    query: text
                }
            });
            setLoading(false);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };

    const handleAddMovie = async (movie) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const moviesCollection = collection(FIRESTORE_DB, 'wishlists', user.uid, 'movies');
                const movieId = movie.id;  // Ensure ID is treated as a number
                const movieDocRef = doc(moviesCollection, movieId.toString());
                const movieDoc = await getDoc(movieDocRef);
                if (!movieDoc.exists()) {
                    await setDoc(movieDocRef, {
                        ...movie,
                        id: movieId
                    });
                    setChosenMovies([
                        ...chosenMovies,
                        {
                            id: movieId,
                            ...movie
                        }
                    ]);
                    console.log('Movie added:', movie);
                } else {
                    console.log('Movie already in wishlist:', movie.title);
                }
            } catch (error) {
                console.error('Error adding movie:', error);
            }
        } else {
            console.log('No user is signed in.');
        }
    };

    const handleRemoveMovie = async (movieId) => {
        console.log('Trying to remove movie with ID:', movieId);
        const user = auth.currentUser;
        if (user) {
            try {
                // Ensure movieId is a number
                movieId = Number(movieId);

                const movieDocRef = doc(FIRESTORE_DB, 'wishlists', user.uid, 'movies', movieId.toString());
                console.log('Document reference:', movieDocRef.path);

                // Check if the document exists
                const movieDoc = await getDoc(movieDocRef);
                if (movieDoc.exists()) {
                    await deleteDoc(movieDocRef);
                    console.log('Movie removed from Firestore successfully');
                    setChosenMovies(chosenMovies.filter(movie => movie.id !== movieId));
                    console.log('Movie removed from local state successfully');
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        } else {
            console.log('No user is signed in.');
        }
    };

    const navigateToDetails = (movie) => {
        navigation.navigate('MovieDetails', { movie });
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            style={styles.movieButton}
            onPress={() => handleAddMovie(item)}
        >
            <Image
                style={styles.movieImage}
                source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderChosenMovie = ({ item }) => (
        <TouchableOpacity
            style={styles.movieContainer}
            onLongPress={() => handleRemoveMovie(item.id)}
            delayLongPress={2500}
            onPress={() => navigateToDetails(item)}
        >
            <Image
                style={styles.movieImage}
                source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveMovie(item.id)}
            >
                <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search movies..."
                onChangeText={searchMovies}
                value={searchQuery}
                lightTheme
                round
                showLoading={loading}
            />
            <FlatList
                data={searchResults}
                renderItem={renderMovie}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No movies found.</Text>
                )}
            />
            <FlatList
                data={chosenMovies}
                renderItem={renderChosenMovie}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No movies in your wishlist.</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        padding: 20,
    },
    movieButton: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    movieImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    movieTitle: {
        color: '#fff',
        flex: 1,
    },
    deleteButton: {
        padding: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    emptyListText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    movieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A3A3C',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
});

export default Wishlist;
