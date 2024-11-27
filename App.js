// import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React, { useState, useEffect } from "react";
// import BeginScreen from "./screens/BeginScreen";
// import CreateAnAccountScreen from "./screens/CreateAnAccountScreen";
// import SearchHomeScreen from "./screens/SearchHomeScreen";
// import SearchScreen from "./screens/SearchScreen";
// import LocationDetailScreen from "./screens/LocationDetailScreen";
// import FavoriteHomeScreen from "./screens/FavoriteHomeScreen";
// import FacilitiesAndServicesScreen from "./screens/FacilitiesAndServicesScreen";
// import ReviewsScreen from "./screens/ReviewsScreen";
// import ConfirmAndPayScreen from "./screens/ConfirmAndPayScreen";
// import PaymentSuccessScreen from "./screens/PaymentSuccessScreen";
// import BookingHomeScreen from "./screens/BookingHomeScreen";
// import BookingLocationDetailScreen from "./screens/BookingLocationDetailScreeen";
// import Login from "./screens/Login";
// import Register from "./screens/Register";
// import Profile from "./screens/ProfileScreen";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { db } from "./firebaseConfig";
// import {auth} from "./firebaseConfig"
// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [accommodations, setAccommodations] = useState([]); // state để lưu trữ dữ liệu chỗ ở
//   const [bookings, setBookings] = useState([]); // state để lưu trữ dữ liệu bookings

//   // Cập nhật dữ liệu chỗ ở
//   const updateData = (updatedItems) => {
//     setAccommodations(updatedItems);
//   };
//   const currentUser = auth.currentUser;

//   // Lấy dữ liệu chỗ ở từ Firestore
//   useEffect(() => {
//     const fetchAccommodations = async () => {
//       try {
//         const accommodationsCollection = collection(db, "accommodations");
//         const querySnapshot = await getDocs(accommodationsCollection);

//         if (querySnapshot.empty) {
//           console.warn("Không tìm thấy tài liệu trong 'accommodations'");
//         }

//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setAccommodations(data);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
//       }
//     };

//     fetchAccommodations();
//   }, []); // Chỉ lấy dữ liệu khi ứng dụng khởi động

//   // Lấy dữ liệu booking từ Firestore
//   useEffect(() => {
//     // const fetchBookings = async () => {
//     //   try {
//     //     const bookingsCollection = collection(db, "bookings");
//     //     const querySnapshot = await getDocs(bookingsCollection);

//     //     if (querySnapshot.empty) {
//     //       console.warn("Không tìm thấy tài liệu trong 'bookings'");
//     //     }

//     //     const data = querySnapshot.docs.map((doc) => ({
//     //       id: doc.id,
//     //       ...doc.data(),
//     //     }));
//     //     setBookings(data); // Cập nhật state bookings
//     //   } catch (error) {
//     //     console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
//     //   }
//     // };
//     const fetchBookings = async () => {
//       console.log("hehehe");

//       console.log(currentUser.uid);

//       try {
//         if (currentUser?.uid) {
//           const db = getFirestore();
//           const bookingsRef = collection(db, "bookings");
//           const q = query(bookingsRef, where("userId", "==", currentUser.uid));
//           const querySnapshot = await getDocs(q);

//           if (!querySnapshot.empty) {
//             const bookings = querySnapshot.docs.map((doc) => ({
//               id: doc.id, // Bao gồm ID của document
//               ...doc.data(), // Dữ liệu khác trong document
//             }));
//             console.log("Fetched Bookings:", bookings);
//             setUserBookings(bookings);
//           } else {
//             console.log("No bookings found for this user.");
//             setUserBookings([]); // Nếu không có kết quả, đặt mảng trống
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings();
//   }, []); // Lấy dữ liệu booking khi ứng dụng khởi động

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Create An Account Screen"
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Begin Screen" component={BeginScreen} />
//         <Stack.Screen name="Create An Account Screen" component={CreateAnAccountScreen} />
//         <Stack.Screen name="Register" component={Register} />
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Profile Home Screen" component={Profile} />
//         <Stack.Screen name="Search Home Screen">
//           {(props) => (
//             <SearchHomeScreen
//               {...props}
//               data={accommodations}
//               updateData={updateData}
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen name="Favorite Home Screen">
//           {(props) => (
//             <FavoriteHomeScreen
//               {...props}
//               data={accommodations}
//               updateData={updateData}
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen name="Search Screen" component={SearchScreen} />
//         <Stack.Screen name="Location Detail Screen" component={LocationDetailScreen} />
//         <Stack.Screen name="Facilities And Services Screen" component={FacilitiesAndServicesScreen} />
//         <Stack.Screen name="Reviews Screen" component={ReviewsScreen} />
//         <Stack.Screen name="Confirm And Pay Screen">
//           {(props) => (
//             <ConfirmAndPayScreen {...props} paymentData={bookings} />
//           )}
//         </Stack.Screen>
//         <Stack.Screen name="Payment Success Screen" component={PaymentSuccessScreen} />
//         <Stack.Screen name="Booking Home Screen">
//           {(props) => (
//             <BookingHomeScreen
//               {...props}
//               data={accommodations}
//               paymentData={bookings} // Truyền dữ liệu bookings thay vì paymentData
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen name="Booking Location Detail Screen">
//           {(props) => (
//             <BookingLocationDetailScreen
//               {...props}
//               paymentData={bookings} // Truyền dữ liệu bookings thay vì paymentData
//             />
//           )}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
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
import BookingLocationDetailScreen from "./screens/BookingLocationDetailScreeen";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/ProfileScreen";
import InboxHomeScreen from "./screens/InboxHomeScreen";
import InboxBasic from "./screens/InboxBasic";
import Chatbot from "./screens/Chatbot";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Stack = createNativeStackNavigator();

export default function App() {
  const [accommodations, setAccommodations] = useState([]); // state để lưu trữ dữ liệu chỗ ở
  const [bookings, setBookings] = useState([]); // state để lưu trữ dữ liệu bookings

  // Cập nhật dữ liệu chỗ ở
  const updateData = (updatedItems) => {
    setAccommodations(updatedItems);
  };

  // Lấy dữ liệu chỗ ở từ Firestore
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const accommodationsCollection = collection(db, "accommodations");
        const querySnapshot = await getDocs(accommodationsCollection);

        if (querySnapshot.empty) {
          console.warn("Không tìm thấy tài liệu trong 'accommodations'");
        }

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccommodations(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
      }
    };

    fetchAccommodations();
  }, []); // Chỉ lấy dữ liệu khi ứng dụng khởi động

  // Lấy dữ liệu booking từ Firestore
  useEffect(() => {
    // const fetchBookings = async () => {
    //   try {
    //     const bookingsCollection = collection(db, "bookings");
    //     const querySnapshot = await getDocs(bookingsCollection);

    //     if (querySnapshot.empty) {
    //       console.warn("Không tìm thấy tài liệu trong 'bookings'");
    //     }

    //     const data = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setBookings(data); // Cập nhật state bookings
    //   } catch (error) {
    //     console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
    //   }
    // };
    const fetchBookings = async () => {
      try {
        if (currentUser?.uid) {
          const db = getFirestore();
          const bookingsRef = collection(db, "bookings");
          const q = query(bookingsRef, where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const bookings = querySnapshot.docs.map((doc) => ({
              id: doc.id, // Bao gồm ID của document
              ...doc.data(), // Dữ liệu khác trong document
            }));
            console.log("Fetched Bookings:", bookings);
            setUserBookings(bookings);
          } else {
            console.log("No bookings found for this user.");
            setUserBookings([]); // Nếu không có kết quả, đặt mảng trống
          }
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []); // Lấy dữ liệu booking khi ứng dụng khởi động

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Create An Account Screen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Begin Screen" component={BeginScreen} />
        <Stack.Screen
          name="Create An Account Screen"
          component={CreateAnAccountScreen}
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile Home Screen" component={Profile} />
        <Stack.Screen name="Search Home Screen">
          {(props) => (
            <SearchHomeScreen
              {...props}
              data={accommodations}
              updateData={updateData}
            />
          )}
        </Stack.Screen>
        {/* <Stack.Screen name="Favorite Home Screen">
          {(props) => (
            <FavoriteHomeScreen
              {...props}
              data={accommodations}
              updateData={updateData}
            />
          )}
        </Stack.Screen> */}
        <Stack.Screen
          name="Favorite Home Screen"
          component={FavoriteHomeScreen}
        />

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
          {(props) => <ConfirmAndPayScreen {...props} paymentData={bookings} />}
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
              paymentData={bookings} // Truyền dữ liệu bookings thay vì paymentData
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Booking Location Detail Screen">
          {(props) => (
            <BookingLocationDetailScreen
              {...props}
              paymentData={bookings} // Truyền dữ liệu bookings thay vì paymentData
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Inbox Home Screen" component={InboxHomeScreen} />
        <Stack.Screen name="Inbox Basic" component={InboxBasic} />
        <Stack.Screen name="Chatbot" component={Chatbot} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
