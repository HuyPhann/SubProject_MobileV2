import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import BeginScreen from "./screens/BeginScreen";
import CreateAnAccountScreen from "./screens/CreateAnAccountScreen";
import SearchHomeScreen from "./screens/SearchHomeScreen";
import SearchScreen from "./screens/SearchScreen";
import LocationDetailScreen from "./screens/LocationDetailScreen";
import FavoriteHomeScreen from "./screens/FavoriteHomeScreen";
import FacilitiesAndServicesScreen from "./screens/FacilitiesAndServicesScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [accommodations, setAccommodations] = useState([]); // state to hold API data
  const updateData = (updatedItems) => {
    setAccommodations(updatedItems);
  };
  useEffect(() => {
    fetch("https://672af17b976a834dd024f697.mockapi.io/accomodation") // Replace 'localhost' with your IP address if needed
      .then((response) => response.json())
      .then((data) => setAccommodations(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search Home Screen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Begin Screen" component={BeginScreen} />
        <Stack.Screen
          name="Create An Account Screen"
          component={CreateAnAccountScreen}
        />
        <Stack.Screen name="Search Home Screen">
          {(props) => (
            <SearchHomeScreen
              {...props}
              data={accommodations}
              updateData={updateData}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Favorite Home Screen">
          {(props) => (
            <FavoriteHomeScreen
              {...props}
              data={accommodations}
              updateData={updateData}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Search Screen" component={SearchScreen} />
        <Stack.Screen
          name="Location Detail Screen"
          component={LocationDetailScreen}
        />
        <Stack.Screen
          name="Facilities And Services Screen"
          component={FacilitiesAndServicesScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
