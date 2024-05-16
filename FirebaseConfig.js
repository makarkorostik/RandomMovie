import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAwUcFeX341SZDJE1OPisY-lvwwjBODNDc",
    authDomain: "moviepicker-de0cc.firebaseapp.com",
    projectId: "moviepicker-de0cc",
    storageBucket: "moviepicker-de0cc.appspot.com",
    messagingSenderId: "979933030034",
    appId: "1:979933030034:web:0238046933d68f41a4684b",
    measurementId: "G-HLY8STSJ3T"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
