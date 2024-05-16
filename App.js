import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/Home'; // Ensure this path is correct
import WishlistScreen from './screens/Wishlist';
import RatingsScreen from './screens/Ratings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { Button } from 'react-native-elements';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import MovieDetails from './screens/MovieDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const handleLogout = async () => {
  try {
    await FIREBASE_AUTH.signOut();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error', error);
  }
};

// Define a MainTabs component that contains all the tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: () => (
          <Button
            onPress={handleLogout}
            title="Logout"
            color="#fff"
            icon={() => <MaterialCommunityIcons name="logout" size={24} color="white" />}
          />
        ),
        headerRightContainerStyle: {
          paddingRight: 10, // Padding right to ensure it's not too close to the edge
        },
        headerStyle: {
          backgroundColor: '#1C1C1E', // Matching the header color with your app's theme
        },
        headerTintColor: '#fff', // Setting the color of header items (like back button) to white
        tabBarShowLabel: false, // Hides the label under icons
        tabBarStyle: {
          backgroundColor: '#1C1C1E', // Matches tab bar color with your app's theme
        },
      })}
    >
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ratings"
        component={RatingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="MovieDetails" component={MovieDetails} options={{ title: 'Movie Details' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
