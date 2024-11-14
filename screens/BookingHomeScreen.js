import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import mainStyle from '../assets/stylesheet/StyleSheet.js';

const BookingHomeScreen = ({ navigation, data, paymentData }) => {
  const [hoveredId, setHoveredId] = useState(null);

  // Lọc các item có trong paymentData
  const filteredData = data.filter(item =>
    paymentData.some(payment => payment.id === item.id)
  );

  const renderItem = ({ item }) => {
    // Lấy thông tin thanh toán từ paymentData
    const paymentInfo = paymentData.find(payment => payment.id === item.id);
    const amount = paymentInfo ? paymentInfo.amount : 'N/A'; // Hiển thị số tiền hoặc 'N/A'
    const bookingDate = paymentInfo ? `${paymentInfo.date} at ${paymentInfo.time}` : 'N/A';

    return (
      <Pressable
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={[
          styles.card,
          hoveredId === item.id && styles.cardHovered,
        ]}
        onPress={() => navigation.navigate('Booking Location Detail Screen', { item })}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>

          {/* Số tiền */}
          <View style={styles.iconRow}>
            <Icon name="dollar" size={18} color="#00AEEF" />
            <Text style={styles.amount}>${amount}</Text>
          </View>

          {/* Đánh giá */}
          <View style={styles.iconRow}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>

          {/* Quốc gia */}
          <View style={styles.iconRow}>
            <Icon name="flag" size={18} color="gray" />
            <Text style={styles.country}>{item.country} - {item.location}</Text>
          </View>

          {/* Loại chỗ ở */}
          <View style={styles.iconRow}>
            <Icon name="home" size={18} color="gray" />
            <Text style={styles.infoText}>{item.typeOfPlace}</Text>
          </View>

          {/* Số khách */}
          <View style={styles.iconRow}>
            <Icon name="users" size={18} color="gray" />
            <Text style={styles.infoText}>Guests: {item.totalGuests}</Text>
          </View>

          {/* Số giường và phòng */}
          <View style={styles.iconRow}>
            <Icon name="bed" size={18} color="gray" />
            <Text style={styles.infoText}>
              {item.roomsAndBeds.beds} beds, {item.roomsAndBeds.bedroom} bedrooms
            </Text>
          </View>

          {/* Số phòng tắm */}
          <View style={styles.iconRow}>
            <Icon name="shower" size={18} color="gray" />
            <Text style={styles.infoText}>{item.roomsAndBeds.bathroom} bathrooms</Text>
          </View>

          {/* Ngày đặt và thời gian */}
          <View style={styles.iconRow}>
            <Icon name="calendar" size={18} color="gray" />
            <Text style={styles.infoText}>Booking: {bookingDate}</Text>
          </View>

          {/* Ngày bắt đầu và kết thúc */}
          <View style={styles.iconRow}>
            <Icon name="clock-o" size={18} color="gray" />
            <Text style={styles.infoText}>
              {item.startDate} to {item.endDate}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={mainStyle.container}>
      <Text style={styles.heading}>Your Bookings</Text>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // Đảm bảo id là chuỗi
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={true}
      />
      {filteredData.length === 0 && (
        <Text style={styles.noBookingsText}>No bookings found!</Text>
      )}
      {/* Thanh điều hướng ở cuối */}
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
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate('Booking Home Screen')}>
          <Image
            source={require('../assets/images/icons/booking.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Bookings</Text>
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
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    color: '#00AEEF',
    marginLeft: 10,
  },
  rating: {
    marginLeft: 10,
    color: 'gray',
  },
  country: {
    marginLeft: 10,
    color: 'gray',
  },
  infoText: {
    marginLeft: 10,
    color: 'gray',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
  },
  noBookingsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
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

export default BookingHomeScreen;
