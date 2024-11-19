// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import mainStyle from "../assets/stylesheet/StyleSheet.js";
// import FilterModal from "./FilterModal"; // Adjust the path accordingly
// import { useIsFocused } from "@react-navigation/native"; // Import hook để kiểm tra trạng thái focus
// import { getFirestore, collection, doc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebaseConfig'; // Đảm bảo bạn đã có kết nối với Firestore

// export default function SearchHomeScreen({
//   navigation,
//   route,
//   data,
//   updateData,
// }) {
//   const isFocused = useIsFocused();
//   const {
//     location: initialLocation = "Anywhere",
//     guests: initialGuests = "Add guests",
//     when: initialWhen = "Anytime",
//   } = route.params || {};
//   const [location, setLocation] = useState(initialLocation);
//   const [guests, setGuests] = useState(initialGuests);
//   const [when, setWhen] = useState(initialWhen);
//   const [filterByTaxInclusive, setFilterByTaxInclusive] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
//   const [hoveredId, setHoveredId] = useState(null);
//   const [filterCriteria, setFilterCriteria] = useState({
//     bedrooms: -1, // 'x' là giá trị mặc định
//     beds: -1, // 'x' là giá trị mặc định
//     bathrooms: -1, // 'x' là giá trị mặc định
//     facilities: {},
//     priceRange: [0, 4000], // Giá trị mặc định cho khoảng giá
//     selectedType: "", // 'x' là giá trị mặc định để không lọc theo loại
//   });
//   useEffect(() => {
//     if (isFocused) {
//       // Thực hiện hành động để tải lại dữ liệu (ví dụ: gọi API hoặc lấy dữ liệu từ props)
//       setItems(data); // Hoặc gọi hàm để tải lại data từ server
//     }
//   }, [isFocused, data]);
//   useEffect(() => {
//     if (route.params) {
//       const { location, guests, when } = route.params;
//       setLocation(location || "Anywhere");
//       setGuests(guests || "Add guests");
//       setWhen(when || "Anytime");
//     }
//   }, [route.params]);
//   const openModal = () => {
//     setIsModalVisible(true);
//   };
//   const applyFilters = (filters) => {
//     setFilterCriteria({
//       bedrooms: filters.bedrooms || "x",
//       beds: filters.beds || "x",
//       bathrooms: filters.bathrooms || "x",
//       facilities: filters.facilities || {},
//       priceRange: filters.priceRange || [0, 4000],
//       selectedType: filters.selectedType || "x",
//     });
//   };
//   const closeModal = () => {
//     setIsModalVisible(false);
//   };
//   const [items, setItems] = useState(data); // Sử dụng data đã định nghĩa ở trên
//   const [selectedLocations, setSelectedLocations] = useState([]);
//   // Toggle favourite status function
//   // const toggleFavourite = (id) => {
//   //   const updatedItems = items.map((item) => {
//   //     if (item.id === id) {
//   //       return { ...item, favourite: !item.favourite }; // Toggle favourite status
//   //     }
//   //     return item;
//   //   });
//   //   setItems(updatedItems); // Update state with modified items
//   //   updateData(updatedItems); // Cập nhật data gốc thông qua updateData
//   // };
//   const toggleFavourite = async (id, userId) => {
//     console.log(userId);
    
//     const updatedItems = items.map((item) => {
//       if (item.id === id) {
//         return { ...item, favourite: !item.favourite }; // Toggle favourite status
//       }
//       return item;
//     });
  
//     setItems(updatedItems);
//     updateData(updatedItems); // Cập nhật data gốc thông qua updateData
  
//     const itemToUpdate = updatedItems.find((item) => item.id === id);
  
//     // Lưu trạng thái yêu thích vào Firestore dưới subcollection favorites của người dùng
//     const favoriteRef = doc(db, 'users', userId, 'favorites', id.toString()); // Lưu trong subcollection 'favorites'
  
//     try {
//       // Kiểm tra nếu document đã tồn tại thì cập nhật, nếu chưa thì tạo mới
//       const docSnap = await getDoc(favoriteRef);
//       if (docSnap.exists()) {
//         // Nếu mục đã tồn tại, chỉ cần cập nhật
//         await updateDoc(favoriteRef, { favourite: itemToUpdate.favourite });
//       } else {
//         // Nếu mục chưa tồn tại, tạo mới
//         await setDoc(favoriteRef, { favourite: itemToUpdate.favourite });
//       }
//       console.log('Updated favourite status in Firestore');
//     } catch (error) {
//       console.error('Error updating favourite status:', error);
//     }
//   };
//   useEffect(() => {
//     if (route.params?.data) {
//       setItems(route.params.data);
//     }
//   }, [route.params?.data]);
//   // Function to filter based on location type and search query
//   const filteredData = items.filter(
//     (item) =>
//       (selectedLocations.length === 0 ||
//         selectedLocations.includes(item.type)) &&
//       (!filterByTaxInclusive || item.taxInclusive === false) // Lọc theo trường Tax-inclusive
//   );
//   const filteredDataWithSearch = (() => {
//     return filteredData.filter((item) =>
//       // Check condition for location
//       (location === "Anywhere" ||
//         item.location.toLowerCase().includes(location.toLowerCase())) &&
//       // Check condition for number of guests
//       (guests === "Add guests" ||
//         item.totalGuests >= (guests === "Add guests" ? 0 : guests)) &&
//       // Check condition for dates
//       (when === "Anytime" ||
//         when === "No dates selected" || // If no date selected
//         (Array.isArray(when) ? 
//           // When 'when' is an array, check if item dates match any date in the array
//           when.some((date) => item.startDate === date) :
//           // When 'when' is a string, check if it's a range and matches the item dates
//           (typeof when === "string" &&
//             when !== "No dates selected" &&
//             (() => {
//               const [startDate, endDate] = when.split(" to ");
//               return (
//                 new Date(item.startDate) >= new Date(startDate) && // Item starts on or after the start date
//                 new Date(item.startDate) <= new Date(endDate) // Item starts on or before the end date
//               );
//             })())))
//     );
//   })();
  
//   const filteredDataWithFilter = (() => {
//     // Check if any filter criteria are provided
//     const hasFilterCriteria =
//       filterCriteria.bedrooms !== -1 ||
//       filterCriteria.beds !== "x" ||
//       filterCriteria.bathrooms !== "x" ||
//       Object.values(filterCriteria.facilities).some(Boolean) ||
//       filterCriteria.priceRange[0] !== 0 ||
//       filterCriteria.priceRange[1] !== Infinity ||
//       (filterCriteria.selectedType !== "x" &&
//         filterCriteria.selectedType !== "");

//     // If no filter criteria, return original filtered data
//     if (!hasFilterCriteria) {
//       return filteredDataWithSearch; // Return the original data if no filter criteria are provided
//     }

//     const result = [];

//     filteredDataWithSearch.forEach((item) => {
//       // Extract room and bed data from item.roomsAndBeds
//       const { bedroom, beds, bathroom } = item.roomsAndBeds;

//       // Initialize a flag to check if all conditions are met
//       let allConditionsMet = true;

//       // Apply room and bed filters (skip if -1)
//       if (
//         !(filterCriteria.bedrooms === -1 || bedroom >= filterCriteria.bedrooms)
//       ) {
//         allConditionsMet = false;
//       }
//       if (!(filterCriteria.beds === "x" || beds >= filterCriteria.beds)) {
//         allConditionsMet = false;
//       }
//       if (
//         !(
//           filterCriteria.bathrooms === "x" ||
//           bathroom >= filterCriteria.bathrooms
//         )
//       ) {
//         allConditionsMet = false;
//       }

//       // Apply facility filters, compare lowercase and remove spaces
//       Object.keys(filterCriteria.facilities).forEach((facility) => {
//         const normalizedFacility = facility.toLowerCase().trim();
//         const itemFacilities = item.facilities.map((f) =>
//           f.toLowerCase().trim()
//         );

//         if (
//           filterCriteria.facilities[normalizedFacility] &&
//           !itemFacilities.includes(normalizedFacility)
//         ) {
//           allConditionsMet = false;
//         }
//       });

//       // Extract price and format it for comparison (remove '$' and '/night')
//       const price = parseFloat(
//         item.price.replace("$", "").split("/")[0].trim()
//       );

//       // Apply price range filters
//       if (
//         !(
//           price >= filterCriteria.priceRange[0] &&
//           price <= filterCriteria.priceRange[1]
//         )
//       ) {
//         allConditionsMet = false;
//       }

//       // Apply type filter (skip if empty or 'x'), compare lowercase without spaces
//       const selectedType = filterCriteria.selectedType.toLowerCase().trim();
//       const itemType = item.typeOfPlace.toLowerCase().trim();
//       if (
//         !(
//           selectedType === "x" ||
//           selectedType === "" ||
//           itemType === selectedType
//         )
//       ) {
//         allConditionsMet = false;
//       }

//       // If all conditions are met, add the item to the result
//       if (allConditionsMet) {
//         result.push(item);
//       }
//     });

//     return result;
//   })();
//   const valueChoiceText = () => {
//     const dateText = when === "Anytime" ? "Anytime" : when; // Kiểm tra nếu là "Anytime" để gán giá trị 'Anytime', nếu không lấy giá trị khi chọn
//     const guestsText =
//       guests === "Add guests" ? "No limit quests" : `${guests} Guests`;
//     return `🔍 ${location || "Anywhere"} - ${dateText} - ${guestsText}`;
//   };

//   const toggleLocation = (locationType) => {
//     if (selectedLocations === locationType) {
//       setSelectedLocations(""); // Deselect if clicked again
//     } else {
//       setSelectedLocations(locationType); // Set only one location type
//     }
//   };
  
//   const renderItem = ({ item }) => (
//     <Pressable
//       onMouseEnter={() => setHoveredId(item.id)}
//       onMouseLeave={() => setHoveredId(null)}
//       style={[styles.card, hoveredId === item.id && styles.cardHovered]}
//       onPress={() => navigation.navigate("Location Detail Screen", { item })} // Navigate to LocationDetailScreen
//     >
//       <Image source={item.image} style={styles.image} />
//       <View style={styles.infoContainer}>
//         <View style={styles.titleRow}>
//           <Text style={styles.title}>
//             {item.title} of {item.country}
//           </Text>
//           <Text style={styles.rating}>⭐ {item.rating}</Text>
//         </View>
//         <View style={styles.titleRow}>
//           <Text style={styles.location}>{item.type}</Text>
//           <Text style={styles.price}>{item.price}</Text>
//         </View>
//       </View>
//       <TouchableOpacity
//         style={styles.favoriteIcon}
//         onPress={() => toggleFavourite(item.id)} // Toggle favorite status
//       >
//         <Image
//           source={
//             item.favourite
//               ? require("../assets/images/icons/red_heart.png") // Pink heart for favourites
//               : require("../assets/images/icons/white_heart.png") // White heart for non-favourites
//           }
//           style={styles.heartIcon}
//         />
//       </TouchableOpacity>
//     </Pressable>
//   );
//   return (
//     <View style={mainStyle.container}>
//       <TouchableOpacity
//         style={styles.searchBar}
//         activeOpacity={0.7}
//         onPress={() => {
//           navigation.navigate("Search Screen");
//         }}
//       >
//         <Text>
//           {location === "Anywhere" &&
//           guests === "Add guests" &&
//           when === "Anytime"
//             ? "🔍 Where do you want to stay?"
//             : valueChoiceText()}
//         </Text>

//         {/* Thay nút x bằng nút filter khi có criteria */}
//         {location !== "Anywhere" ||
//         guests !== "Add guests" ||
//         when !== "Anytime" ? (
//           <TouchableOpacity
//             onPress={openModal}
//             style={[
//               styles.icon,
//               {
//                 borderWidth: 1,
//                 borderRadius: 90,
//                 padding: 20,
//                 flexDirection: "row",
//                 justifyContent: "center",
//                 alignItems: "center",
//               },
//             ]}
//           >
//             <Image
//               source={require("../assets/images/icons/filter.png")} // Thay thế hình ảnh nút filter
//               style={styles.icon}
//             />
//           </TouchableOpacity>
//         ) : null}
//       </TouchableOpacity>
//       <FilterModal
//         isVisible={isModalVisible}
//         onClose={closeModal}
//         onApplyFilters={applyFilters} // Pass the applyFilters function to the modal
//       />

//       {location === "Anywhere" &&
//       guests === "Add guests" &&
//       when === "Anytime" ? (
//         <View style={styles.tabs}>
//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             selectedLocations === "Beach" && styles.tabItemActive,
//           ]}
//           onPress={() => toggleLocation("Beach")}
//         >
//           <Image
//             source={require("../assets/images/icons/beach.png")}
//             style={styles.icon}
//           />
//           <Text
//             style={selectedLocations === "Beach" ? styles.tabTextActive : styles.tabText}
//           >
//             Beach
//           </Text>
//         </TouchableOpacity>
      
//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             selectedLocations === "Mountain" && styles.tabItemActive,
//           ]}
//           onPress={() => toggleLocation("Mountain")}
//         >
//           <Image
//             source={require("../assets/images/icons/mountain.png")}
//             style={styles.icon}
//           />
//           <Text
//             style={selectedLocations === "Mountain" ? styles.tabTextActive : styles.tabText}
//           >
//             Mountain
//           </Text>
//         </TouchableOpacity>
      
//         <TouchableOpacity
//           style={[
//             styles.tabItem,
//             selectedLocations === "Camping" && styles.tabItemActive,
//           ]}
//           onPress={() => toggleLocation("Camping")}
//         >
//           <Image
//             source={require("../assets/images/icons/camping.png")}
//             style={styles.icon}
//           />
//           <Text
//             style={selectedLocations === "Camping" ? styles.tabTextActive : styles.tabText}
//           >
//             Camping
//           </Text>
//         </TouchableOpacity>
//       </View>
      
//       ) : (
//         <View style={styles.checkboxContainer}>
//           <View style={mainStyle.col_flex}>
//             <Text style={styles.checkboxLabel}>Present total price</Text>
//             <Text style={styles.checkboxDescription}>
//               All-inclusive, pre-tax
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.checkbox}
//             onPress={() => setFilterByTaxInclusive(!filterByTaxInclusive)}
//           >
//             <Image
//               source={
//                 filterByTaxInclusive
//                   ? require("../assets/images/icons/checked.png") // Hiển thị hình ảnh checked khi được chọn
//                   : require("../assets/images/icons/unchecked.png") // Hiển thị hình ảnh unchecked khi không được chọn
//               }
//               style={{ height: 30, width: 30 }}
//             />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* List of Apartments */}
//       <FlatList
//         data={filteredDataWithFilter}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//       />
//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate("Search Home Screen")}
//         >
//           <Image
//             source={require("../assets/images/icons/search.png")}
//             style={styles.navIcon}
//           />
//           <Text style={styles.navTextActive}>Search</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("Favorite Home Screen")}
//           style={styles.navItem}
//         >
//           <Image
//             source={require("../assets/images/icons/white_heart.png")}
//             style={styles.navIcon}
//           />
//           <Text style={styles.navText}>Favorites</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate("Booking Home Screen")}
//         >
//           <Image
//             source={require("../assets/images/icons/booking.png")}
//             style={styles.navIcon}
//           />
//           <Text style={styles.navText}>Bookings</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate("Inbox Home Screen")}
//         >
//           <Image
//             source={require("../assets/images/icons/inbox.png")}
//             style={styles.navIcon}
//           />
//           <Text style={styles.navText}>Inbox</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate("Profile Home Screen")}
//         >
//           <Image
//             source={require("../assets/images/icons/profile.png")}
//             style={styles.navIcon}
//           />
//           <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   searchBar: {
//     backgroundColor: "#f2f2f2",
//     padding: 10,
//     borderRadius: 25,
//     margin: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   icon: {
//     width: 24,
//     height: 24,
//   },
//   searchText: {
//     fontSize: 18,
//     color: "#666",
//   },
//   tabs: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 10,
//   },
//   tabItem: {
//     width:'20%',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     flexDirection: "column",
//     alignItems: "center",
//     backgroundColor: "#fff", // Initial white color
//     borderRadius: 10,
//   },
//   tabText: {
//     fontSize: 18,
//     color: "#888",
//     marginRight: 10,
//   },
//   list: {
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     gap: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginBottom: 15,
//     position: "relative",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   image: {
//     width: "100%",
//     height: 150,
//   },
//   infoContainer: {
//     padding: 10,
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   location: {
//     color: "#888",
//     marginVertical: 5,
//   },
//   rating: {
//     color: "#FFD700",
//   },
//   price: {
//     color: "#00BCD4",
//     fontWeight: "bold",
//   },
//   favoriteIcon: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 5,
//   },
//   heartIcon: {
//     width: 20,
//     height: 20,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//   },
//   navItem: {
//     alignItems: "center",
//   },
//   navIcon: {
//     width: 24,
//     height: 24,
//     marginBottom: 5,
//   },
//   navText: {
//     color: "#888",
//   },
//   navTextActive: {
//     color: "#00BCD4",
//     fontWeight: "bold",
//   },
//   cardHovered: {
//     borderColor: "#00AEEF",
//     shadowColor: "#00AEEF",
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 0 },
//   },
//   tabItemActive: {
//     backgroundColor: "#00BCD4", // Active color when selected
//   },
//   tabTextActive: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// //🔍

// {
//   /* <TouchableOpacity
//   style={styles.favoriteIcon}
//   onPress={() => toggleFavorite(item.id)} // Toggle favorite status
// >
//   <Image
//     style={styles.heartIcon}
//     source={
//       favoriteItems[item.id]
//         ? require("../assets/images/icons/red_heart.png") // Show red heart if favorited
//         : require("../assets/images/icons/white_heart.png") // Show white heart if not
//     }
//   />
// </TouchableOpacity>; */
// }
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import mainStyle from "../assets/stylesheet/StyleSheet.js";
import FilterModal from "./FilterModal"; // Adjust the path accordingly
import { useIsFocused } from "@react-navigation/native"; // Import hook để kiểm tra trạng thái focus
import { auth, db } from "../firebaseConfig";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";

export default function SearchHomeScreen({
  navigation,
  route,
  data,
  updateData,
}) {
  const isFocused = useIsFocused();
  const {
    location: initialLocation = "Anywhere",
    guests: initialGuests = "Add guests",
    when: initialWhen = "Anytime",
  } = route.params || {};
  const [location, setLocation] = useState(initialLocation);
  const [guests, setGuests] = useState(initialGuests);
  const [when, setWhen] = useState(initialWhen);
  const [filterByTaxInclusive, setFilterByTaxInclusive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
  const [hoveredId, setHoveredId] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({
    bedrooms: -1, // 'x' là giá trị mặc định
    beds: -1, // 'x' là giá trị mặc định
    bathrooms: -1, // 'x' là giá trị mặc định
    facilities: {},
    priceRange: [0, 4000], // Giá trị mặc định cho khoảng giá
    selectedType: "", // 'x' là giá trị mặc định để không lọc theo loại
  });
  useEffect(() => {
    if (isFocused) {
      // Thực hiện hành động để tải lại dữ liệu (ví dụ: gọi API hoặc lấy dữ liệu từ props)
      setItems(data); // Hoặc gọi hàm để tải lại data từ server
    }
  }, [isFocused, data]);
  useEffect(() => {
    if (route.params) {
      const { location, guests, when } = route.params;
      setLocation(location || "Anywhere");
      setGuests(guests || "Add guests");
      setWhen(when || "Anytime");
    }
  }, [route.params]);
  const openModal = () => {
    setIsModalVisible(true);
  };
  const applyFilters = (filters) => {
    setFilterCriteria({
      bedrooms: filters.bedrooms || "x",
      beds: filters.beds || "x",
      bathrooms: filters.bathrooms || "x",
      facilities: filters.facilities || {},
      priceRange: filters.priceRange || [0, 4000],
      selectedType: filters.selectedType || "x",
    });
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };
  const [items, setItems] = useState(data); // Sử dụng data đã định nghĩa ở trên
  const [selectedLocations, setSelectedLocations] = useState([]);
  // Toggle favourite status function
  const toggleFavourite = async (id) => {
    try {
      const currentUser = auth.currentUser; // Lấy thông tin người dùng hiện tại
      if (!currentUser) {
        console.error("No user is logged in.");
        return;
      }
  
      const userId = currentUser.uid; // UID của người dùng
      const favoriteDocRef = doc(db, "favorites", `${userId}_${id}`); // Tạo tham chiếu đến tài liệu trong Firestore
  
      const updatedItems = items.map((item) => {
        if (item.id === id) {
          const isFavourite = !item.favourite; // Đảo ngược trạng thái yêu thích
  
          // Nếu được chọn là yêu thích
          if (isFavourite) {
            // Lưu vào Firestore
            setDoc(favoriteDocRef, {
              userId,
              itemId: id,
            });
          } else {
            // Nếu bỏ chọn, xóa khỏi Firestore
            deleteDoc(favoriteDocRef);
          }
  
          return { ...item, favourite: isFavourite }; // Cập nhật trạng thái
        }
        return item;
      });
  
      setItems(updatedItems); // Cập nhật danh sách
      updateData(updatedItems); // Đồng bộ dữ liệu
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  useEffect(() => {
    if (route.params?.data) {
      setItems(route.params.data);
    }
  }, [route.params?.data]);
  // Function to filter based on location type and search query
  const filteredData = items.filter(
    (item) =>
      (selectedLocations.length === 0 ||
        selectedLocations.includes(item.type)) &&
      (!filterByTaxInclusive || item.taxInclusive === false) // Lọc theo trường Tax-inclusive
  );
  const filteredDataWithSearch = (() => {
    return filteredData.filter((item) =>
      // Check condition for location
      (location === "Anywhere" ||
        item.location.toLowerCase().includes(location.toLowerCase())) &&
      // Check condition for number of guests
      (guests === "Add guests" ||
        item.totalGuests >= (guests === "Add guests" ? 0 : guests)) &&
      // Check condition for dates
      (when === "Anytime" ||
        when === "No dates selected" || // If no date selected
        (Array.isArray(when) ? 
          // When 'when' is an array, check if item dates match any date in the array
          when.some((date) => item.startDate === date) :
          // When 'when' is a string, check if it's a range and matches the item dates
          (typeof when === "string" &&
            when !== "No dates selected" &&
            (() => {
              const [startDate, endDate] = when.split(" to ");
              return (
                new Date(item.startDate) >= new Date(startDate) && // Item starts on or after the start date
                new Date(item.startDate) <= new Date(endDate) // Item starts on or before the end date
              );
            })())))
    );
  })();
  
  const filteredDataWithFilter = (() => {
    // Check if any filter criteria are provided
    const hasFilterCriteria =
      filterCriteria.bedrooms !== -1 ||
      filterCriteria.beds !== "x" ||
      filterCriteria.bathrooms !== "x" ||
      Object.values(filterCriteria.facilities).some(Boolean) ||
      filterCriteria.priceRange[0] !== 0 ||
      filterCriteria.priceRange[1] !== Infinity ||
      (filterCriteria.selectedType !== "x" &&
        filterCriteria.selectedType !== "");

    // If no filter criteria, return original filtered data
    if (!hasFilterCriteria) {
      return filteredDataWithSearch; // Return the original data if no filter criteria are provided
    }

    const result = [];

    filteredDataWithSearch.forEach((item) => {
      // Extract room and bed data from item.roomsAndBeds
      const { bedroom, beds, bathroom } = item.roomsAndBeds;

      // Initialize a flag to check if all conditions are met
      let allConditionsMet = true;

      // Apply room and bed filters (skip if -1)
      if (
        !(filterCriteria.bedrooms === -1 || bedroom >= filterCriteria.bedrooms)
      ) {
        allConditionsMet = false;
      }
      if (!(filterCriteria.beds === "x" || beds >= filterCriteria.beds)) {
        allConditionsMet = false;
      }
      if (
        !(
          filterCriteria.bathrooms === "x" ||
          bathroom >= filterCriteria.bathrooms
        )
      ) {
        allConditionsMet = false;
      }

      // Apply facility filters, compare lowercase and remove spaces
      Object.keys(filterCriteria.facilities).forEach((facility) => {
        const normalizedFacility = facility.toLowerCase().trim();
        const itemFacilities = item.facilities.map((f) =>
          f.toLowerCase().trim()
        );

        if (
          filterCriteria.facilities[normalizedFacility] &&
          !itemFacilities.includes(normalizedFacility)
        ) {
          allConditionsMet = false;
        }
      });

      // Extract price and format it for comparison (remove '$' and '/night')
      const price = parseFloat(
        item.price.replace("$", "").split("/")[0].trim()
      );

      // Apply price range filters
      if (
        !(
          price >= filterCriteria.priceRange[0] &&
          price <= filterCriteria.priceRange[1]
        )
      ) {
        allConditionsMet = false;
      }

      // Apply type filter (skip if empty or 'x'), compare lowercase without spaces
      const selectedType = filterCriteria.selectedType.toLowerCase().trim();
      const itemType = item.typeOfPlace.toLowerCase().trim();
      if (
        !(
          selectedType === "x" ||
          selectedType === "" ||
          itemType === selectedType
        )
      ) {
        allConditionsMet = false;
      }

      // If all conditions are met, add the item to the result
      if (allConditionsMet) {
        result.push(item);
      }
    });

    return result;
  })();
  const valueChoiceText = () => {
    const dateText = when === "Anytime" ? "Anytime" : when; // Kiểm tra nếu là "Anytime" để gán giá trị 'Anytime', nếu không lấy giá trị khi chọn
    const guestsText =
      guests === "Add guests" ? "No limit quests" : `${guests} Guests`;
    return `🔍 ${location || "Anywhere"} - ${dateText} - ${guestsText}`;
  };

  const toggleLocation = (locationType) => {
    if (selectedLocations === locationType) {
      setSelectedLocations(""); // Deselect if clicked again
    } else {
      setSelectedLocations(locationType); // Set only one location type
    }
  };
  
  const renderItem = ({ item }) => (
    <Pressable
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseLeave={() => setHoveredId(null)}
      style={[styles.card, hoveredId === item.id && styles.cardHovered]}
      onPress={() => navigation.navigate("Location Detail Screen", { item })} // Navigate to LocationDetailScreen
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {item.title} of {item.country}
          </Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.location}>{item.type}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => toggleFavourite(item.id)} // Toggle favorite status
      >
        <Image
          source={
            item.favourite
              ? require("../assets/images/icons/red_heart.png") // Pink heart for favourites
              : require("../assets/images/icons/white_heart.png") // White heart for non-favourites
          }
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </Pressable>
  );
  return (
    <View style={mainStyle.container}>
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate("Search Screen");
        }}
      >
        <Text>
          {location === "Anywhere" &&
          guests === "Add guests" &&
          when === "Anytime"
            ? "🔍 Where do you want to stay?"
            : valueChoiceText()}
        </Text>

        {/* Thay nút x bằng nút filter khi có criteria */}
        {location !== "Anywhere" ||
        guests !== "Add guests" ||
        when !== "Anytime" ? (
          <TouchableOpacity
            onPress={openModal}
            style={[
              styles.icon,
              {
                borderWidth: 1,
                borderRadius: 90,
                padding: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../assets/images/icons/filter.png")} // Thay thế hình ảnh nút filter
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      <FilterModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onApplyFilters={applyFilters} // Pass the applyFilters function to the modal
      />

      {location === "Anywhere" &&
      guests === "Add guests" &&
      when === "Anytime" ? (
        <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedLocations === "Beach" && styles.tabItemActive,
          ]}
          onPress={() => toggleLocation("Beach")}
        >
          <Image
            source={require("../assets/images/icons/beach.png")}
            style={styles.icon}
          />
          <Text
            style={selectedLocations === "Beach" ? styles.tabTextActive : styles.tabText}
          >
            Beach
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedLocations === "Mountain" && styles.tabItemActive,
          ]}
          onPress={() => toggleLocation("Mountain")}
        >
          <Image
            source={require("../assets/images/icons/mountain.png")}
            style={styles.icon}
          />
          <Text
            style={selectedLocations === "Mountain" ? styles.tabTextActive : styles.tabText}
          >
            Mountain
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedLocations === "Camping" && styles.tabItemActive,
          ]}
          onPress={() => toggleLocation("Camping")}
        >
          <Image
            source={require("../assets/images/icons/camping.png")}
            style={styles.icon}
          />
          <Text
            style={selectedLocations === "Camping" ? styles.tabTextActive : styles.tabText}
          >
            Camping
          </Text>
        </TouchableOpacity>
      </View>
      
      ) : (
        <View style={styles.checkboxContainer}>
          <View style={mainStyle.col_flex}>
            <Text style={styles.checkboxLabel}>Present total price</Text>
            <Text style={styles.checkboxDescription}>
              All-inclusive, pre-tax
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setFilterByTaxInclusive(!filterByTaxInclusive)}
          >
            <Image
              source={
                filterByTaxInclusive
                  ? require("../assets/images/icons/checked.png") // Hiển thị hình ảnh checked khi được chọn
                  : require("../assets/images/icons/unchecked.png") // Hiển thị hình ảnh unchecked khi không được chọn
              }
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* List of Apartments */}
      <FlatList
        data={filteredDataWithFilter}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Search Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/search.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorite Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/white_heart.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Booking Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/booking.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Inbox Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/inbox.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/profile.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 25,
    margin: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchText: {
    fontSize: 18,
    color: "#666",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tabItem: {
    width:'20%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff", // Initial white color
    borderRadius: 10,
  },
  tabText: {
    fontSize: 18,
    color: "#888",
    marginRight: 10,
  },
  list: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    position: "relative",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    color: "#888",
    marginVertical: 5,
  },
  rating: {
    color: "#FFD700",
  },
  price: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  heartIcon: {
    width: 20,
    height: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    color: "#888",
  },
  navTextActive: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
  cardHovered: {
    borderColor: "#00AEEF",
    shadowColor: "#00AEEF",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  tabItemActive: {
    backgroundColor: "#00BCD4", // Active color when selected
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});

//🔍

{
  /* <TouchableOpacity
  style={styles.favoriteIcon}
  onPress={() => toggleFavorite(item.id)} // Toggle favorite status
>
  <Image
    style={styles.heartIcon}
    source={
      favoriteItems[item.id]
        ? require("../assets/images/icons/red_heart.png") // Show red heart if favorited
        : require("../assets/images/icons/white_heart.png") // Show white heart if not
    }
  />
</TouchableOpacity>; */
}
