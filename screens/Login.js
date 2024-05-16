import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Button } from 'react-native-elements';
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Check your emails!');
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                    value={email}>

                </TextInput>
                <TextInput style={styles.input}
                    placeholder='password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}>

                </TextInput>

                {loading ? (<ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button title="Login" onPress={signIn} />
                        <Button title="Create account" onPress={signUp} />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
});

