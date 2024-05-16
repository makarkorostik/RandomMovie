import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const MovieDetails = ({ route }) => {
    const { movie } = route.params;

    return (
        <View style={styles.container}>
            <Image 
                style={styles.movieImage} 
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} 
            />
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieReleaseDate}>Release Date: {movie.release_date}</Text>
            <Text style={styles.movieOverview}>{movie.overview}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        padding: 20,
        alignItems: 'center',
    },
    movieImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    movieReleaseDate: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 20,
    },
    movieOverview: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});

export default MovieDetails;
