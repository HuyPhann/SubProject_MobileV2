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
import ReviewsScreen from "./screens/ReviewsScreen";
import ConfirmAndPayScreen from "./screens/ConfirmAndPayScreen";
import PaymentSuccessScreen from "./screens/PaymentSuccessScreen";
import BookingHomeScreen from "./screens/BookingHomeScreen";
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
  const [paymentData, setPaymentData] = useState([
    { id: '24', amount: '1200', date: '2024-11-16', time: '12:00 PM' },
    { id: '11', amount: '300', date: '2024-11-13', time: '12:00 PM' },
    { id: '22', amount: '1200', date: '2024-11-14', time: '12:00 PM' },
    { id: '12', amount: '300', date: '2024-11-15', time: '12:00 PM' },
  ]);

  
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
        <Stack.Screen name="Reviews Screen" component={ReviewsScreen} />
        <Stack.Screen name="Confirm And Pay Screen">
          {(props) => (
            <ConfirmAndPayScreen {...props} paymentData={paymentData} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Payment Success Screen"
          component={PaymentSuccessScreen}
        />
         <Stack.Screen name="Booking Home Screen">
          {(props) => (
            <BookingHomeScreen
              {...props}
              data={accommodations}
              paymentData={paymentData}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
