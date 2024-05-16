import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
    Button,
    Alert,
} from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { SearchBar } from 'react-native-elements';

const API_KEY = '38cd0b6035a6e858c4576e22989c2889';
const BASE_URL = 'https://api.themoviedb.org/3';

const Ratings = ({ navigation }) => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [ratedMovies, setRatedMovies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [rating, setRating] = useState('');
    const auth = getAuth();

    useEffect(() => {
        fetchRatedMovies();
    }, []);

    const fetchRatedMovies = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const moviesCollection = collection(FIRESTORE_DB, 'ratings', user.uid, 'movies');
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map(doc => ({
                    id: Number(doc.id),  // Ensure ID is treated as a number
                    ...doc.data()
                }));
                setRatedMovies(movieList);
                console.log('Fetched rated movies:', movieList);
            } catch (error) {
                console.error('Error fetching rated movies:', error);
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

    const handleAddRating = async () => {
        const user = auth.currentUser;
        if (user && selectedMovie && rating) {
            try {
                const moviesCollection = collection(FIRESTORE_DB, 'ratings', user.uid, 'movies');
                const movieId = selectedMovie.id;  // Ensure ID is treated as a number
                const movieDocRef = doc(moviesCollection, movieId.toString());
                const movieDoc = await getDoc(movieDocRef);
                if (!movieDoc.exists()) {
                    await setDoc(movieDocRef, {
                        ...selectedMovie,
                        id: movieId,
                        userRating: rating
                    });
                    setRatedMovies([
                        ...ratedMovies,
                        {
                            id: movieId,
                            ...selectedMovie,
                            userRating: rating
                        }
                    ]);
                    console.log('Movie rated:', selectedMovie);
                } else {
                    await setDoc(movieDocRef, {
                        ...movieDoc.data(),
                        userRating: rating
                    });
                    setRatedMovies(ratedMovies.map(movie => 
                        movie.id === movieId ? { ...movie, userRating: rating } : movie
                    ));
                    console.log('Movie rating updated:', selectedMovie);
                }
                setModalVisible(false);
                setSelectedMovie(null);
                setRating('');
            } catch (error) {
                console.error('Error adding/updating rating:', error);
            }
        } else {
            console.log('No user is signed in or no movie selected.');
        }
    };

    const handleDeleteMovie = async () => {
        const user = auth.currentUser;
        if (user && movieToDelete) {
            try {
                const movieId = movieToDelete.id;
                const movieDocRef = doc(FIRESTORE_DB, 'ratings', user.uid, 'movies', movieId.toString());
                await deleteDoc(movieDocRef);
                setRatedMovies(ratedMovies.filter(movie => movie.id !== movieId));
                console.log('Movie deleted:', movieToDelete);
                setDeleteModalVisible(false);
                setMovieToDelete(null);
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        } else {
            console.log('No user is signed in or no movie selected for deletion.');
        }
    };

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setModalVisible(true);
    };

    const handleUpdateRating = (movieId) => {
        const movie = ratedMovies.find(movie => movie.id === movieId);
        setSelectedMovie(movie);
        setRating(movie.userRating);
        setModalVisible(true);
    };

    const handleLongPressMovie = (movie) => {
        setMovieToDelete(movie);
        setDeleteModalVisible(true);
    };

    const navigateToDetails = (movie) => {
        navigation.navigate('MovieDetails', { movie });
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            style={styles.movieButton}
            onPress={() => handleSelectMovie(item)}
        >
            <Image
                style={styles.movieImage}
                source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderRatedMovie = ({ item }) => (
        <TouchableOpacity
            style={styles.movieContainer}
            onLongPress={() => handleLongPressMovie(item)}
            delayLongPress={2500}
            onPress={() => navigateToDetails(item)}
        >
            <Image
                style={styles.movieImage}
                source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <TouchableOpacity
                style={styles.ratingCircle}
                onPress={() => handleUpdateRating(item.id)}
            >
                <Text style={styles.circleText}>{item.userRating}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderRatingCircles = () => {
        const circles = [];
        for (let i = 1; i <= 10; i++) {
            circles.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.circle, rating == i && styles.selectedCircle]}
                    onPress={() => setRating(i.toString())}
                >
                    <Text style={styles.circleText}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return circles;
    };

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
                data={ratedMovies}
                renderItem={renderRatedMovie}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No rated movies.</Text>
                )}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedMovie(null);
                    setRating('');
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Rate {selectedMovie?.title}</Text>
                        <View style={styles.ratingContainer}>
                            {renderRatingCircles()}
                        </View>
                        <Button title="Submit Rating" onPress={handleAddRating} />
                        <Button title="Cancel" onPress={() => {
                            setModalVisible(false);
                            setSelectedMovie(null);
                            setRating('');
                        }} />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={deleteModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setDeleteModalVisible(false);
                    setMovieToDelete(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Do you want to delete {movieToDelete?.title} from the list?</Text>
                        <Button title="Yes" onPress={handleDeleteMovie} />
                        <Button title="No" onPress={() => {
                            setDeleteModalVisible(false);
                            setMovieToDelete(null);
                        }} />
                    </View>
                </View>
            </Modal>
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
    ratingCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    circleText: {
        color: '#000',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    selectedCircle: {
        backgroundColor: '#ff6347', // Tomato color for selected rating
    },
});

export default Ratings;
