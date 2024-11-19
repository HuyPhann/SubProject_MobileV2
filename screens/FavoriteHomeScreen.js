
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc 
} from 'firebase/firestore';
import { auth } from '../firebaseConfig'; // Import auth
import mainStyle from '../assets/stylesheet/StyleSheet.js';

export default function FavoriteHomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritesAndAccommodation = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser?.uid) {
          const db = getFirestore();

          // Step 1: Lấy danh sách favorites của user
          const favoritesRef = collection(db, 'favorites');
          const favoritesQuery = query(favoritesRef, where('userId', '==', currentUser.uid));
          const favoritesSnapshot = await getDocs(favoritesQuery);

          const favoriteItemIds = favoritesSnapshot.docs.map((doc) => doc.data().itemId);

          if (favoriteItemIds.length > 0) {
            // Step 2: Lấy tất cả accommodations với một query duy nhất
            const accommodationsRef = collection(db, 'accommodations');
            const accommodationQuery = query(accommodationsRef, where('id', 'in', favoriteItemIds));
            const accommodationSnapshot = await getDocs(accommodationQuery);

            const accommodations = accommodationSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setFavorites(accommodations);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites and accommodations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesAndAccommodation();
  }, []);

  // const toggleFavourite = async (id) => {
  //   try {
  //     const updatedFavorites = favorites.map((item) =>
  //       item.id === id ? { ...item, favourite: !item.favourite } : item
  //     );
  //     setFavorites(updatedFavorites);
  //     // TODO: Update Firestore nếu cần
  //   } catch (error) {
  //     console.error('Error toggling favourite:', error);
  //   }
  // };
  const toggleFavourite = async (id) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.uid) return;
  
      const db = getFirestore();
  
      // Tìm mục yêu thích trong Firestore
      const favoritesRef = collection(db, 'favorites');
      const favoritesQuery = query(
        favoritesRef,
        where('userId', '==', currentUser.uid),
        where('itemId', '==', id)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
  
      if (!favoritesSnapshot.empty) {
        // Lấy tài liệu đầu tiên từ kết quả truy vấn
        const favoriteDoc = favoritesSnapshot.docs[0];
  
        // Xóa tài liệu này khỏi Firestore
        await deleteDoc(doc(db, 'favorites', favoriteDoc.id));
  
        // Cập nhật danh sách cục bộ
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== id)
        );
      }
    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };
  
  // const renderItem = ({ item }) => (
  //   <Pressable
  //     onMouseEnter={() => setHoveredId(item.id)}
  //     onMouseLeave={() => setHoveredId(null)}
  //     style={[
  //       styles.card,
  //       hoveredId === item.id && styles.cardHovered,
  //     ]}
  //     onPress={() => navigation.navigate('Location Detail Screen', { item })}
  //   >
  //     <Image source={{ uri: item.image }} style={styles.image} />
  //     <View style={styles.infoContainer}>
  //       <View style={styles.titleRow}>
  //         <Text style={styles.title}>
  //           {item.title} of {item.country}
  //         </Text>
  //         <Text style={styles.rating}>⭐ {item.rating}</Text>
  //       </View>
  //       <View style={styles.titleRow}>
  //         <Text style={styles.location}>{item.type}</Text>
  //         <Text style={styles.price}>{item.price}</Text>
  //       </View>
  //     </View>
  //     <TouchableOpacity
  //       style={styles.favoriteIcon}
  //       onPress={() => toggleFavourite(item.id)}
  //     >
  //       <Image
  //         source={
  //           item.favourite
  //             ? require('../assets/images/icons/red_heart.png') // Pink heart for favourites
  //             : require('../assets/images/icons/white_heart.png') // White heart for non-favourites
  //         }
  //         style={styles.heartIcon}
  //       />
  //     </TouchableOpacity>
  //   </Pressable>
  // );
  const renderItem = ({ item }) => (
    <Pressable
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseLeave={() => setHoveredId(null)}
      style={[
        styles.card,
        hoveredId === item.id && styles.cardHovered,
      ]}
      onPress={() => navigation.navigate('Location Detail Screen', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
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
        onPress={() => toggleFavourite(item.id)}
      >
        <Image
          source={require('../assets/images/icons/red_heart.png')} // Luôn hiển thị trái tim đỏ
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </Pressable>
  );
  
  if (loading) {
    return (
      <View style={[mainStyle.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={mainStyle.container}>
      <Text style={styles.heading}>Your Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        initialNumToRender={5} // Tối ưu FlatList
        windowSize={10}
      />
      {favorites.length === 0 && (
        <Text style={styles.noFavoritesText}>No favorites added yet!</Text>
      )}

       <View style={styles.bottomNav}>
         <TouchableOpacity
          onPress={() => navigation.navigate('Search Home Screen')}
          style={styles.navItem}>
          <Image
            source={require('../assets/images/icons/search.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Favorite Home Screen')}
          style={styles.navItem}>
          <Image
            source={require('../assets/images/icons/white_heart.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Booking Home Screen')}>
          <Image
            source={require('../assets/images/icons/booking.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inbox Home Screen')}>
          <Image
            source={require('../assets/images/icons/inbox.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile Home Screen')}>
          <Image
            source={require('../assets/images/icons/profile.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap:20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardHovered: {
    borderColor: '#00AEEF', // Viền đèn LED khi hover
    shadowColor: '#00AEEF',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
  },
  location: {
    color: '#888',
    marginVertical: 5,
  },
  rating: {
    color: '#FFD700',
  },
  price: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  heartIcon: {
    width: 20,
    height: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    color: '#888',
  },
  navTextActive: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
});