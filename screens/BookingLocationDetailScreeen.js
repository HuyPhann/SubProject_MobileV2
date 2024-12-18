import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Dùng biểu tượng
import GeneralLocationInfo from './GeneralLocationInfo'; // Điều chỉnh lại đường dẫn nếu cần
import FacilitiesAndServices from './FacilitiesAndServices'; // Đã cập nhật đường dẫn
import Reviews from './Reviews'; // Đã cập nhật đường dẫn
import Policies from './Policies';
import Description from './Description';
import { db } from '../firebaseConfig'; // Nhập Firestore instance

export default function BookingLocationDetailScreen({
  navigation,
  route,
  user,
  paymentData,
}) {
  const { item } = route.params || {}; // Lấy dữ liệu từ route.params

  // Lấy thông tin thanh toán cho item hiện tại
  const paymentInfo = paymentData.find((payment) => payment.id === item.id);
  const amount = paymentInfo ? paymentInfo.amount : 'N/A'; // Hiển thị số tiền hoặc 'N/A'
  const bookingDate = paymentInfo
    ? `${paymentInfo.date} at ${paymentInfo.time}`
    : 'N/A';

  //const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm lưu thông tin đặt phòng vào Firestore
  const saveBookingToFirestore = async () => {
    try {
      // Chuẩn bị dữ liệu đặt phòng
      const bookingData = {
        userId: user.uid, // ID người dùng từ thông tin đã đăng nhập
        accommodationId: item.id,
        accommodationTitle: item.title,
        amount: amount,
        bookingDate: bookingDate,
        startDate: item.startDate,
        endDate: item.endDate,
        totalGuests: item.totalGuests,
        bookingStatus: 'confirmed', // Trạng thái có thể thay đổi tùy theo yêu cầu
        createdAt: new Date(),
      };

      // Lưu dữ liệu đặt phòng vào Firestore dưới collection 'bookings'
      await db.collection('bookings').add(bookingData);
  
  
  //    setIsModalVisible(true); // Hiển thị modal thành công sau khi lưu booking

    } catch (error) {
      console.error('Lỗi khi lưu booking vào Firestore: ', error);
    }
  };

  // Tạo số lượng đánh giá ngẫu nhiên (từ 5 đến 300)
  const randomReviewsCount = Math.floor(Math.random() * (300 - 5 + 1)) + 5; // Từ 5 đến 300

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Booking Home Screen')}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image section */}
        <Image source={item.image} style={styles.image} />

        {/* General Info Section */}
        <GeneralLocationInfo
          item={item}
          navigation={navigation}
          reviews={randomReviewsCount}
          rating={item.rating}
        />

        {/* Separator Line */}
        <View style={styles.separator} />
        <FacilitiesAndServices item={item} navigation={navigation} />
        {/* Separator Line */}
        <View style={styles.separator} />
        {/* Pass randomReviewsCount to Reviews */}
        <Reviews
          navigation={navigation}
          reviewsCount={randomReviewsCount}
          rating={item.rating}
        />
        {/* Separator Line */}
        <View style={styles.separator} />
        <Policies />
        <View style={styles.separator} />
        <Description item={item} />
      </ScrollView>

      {/* Fixed Footer */}
      

      {/* Success Modal */}
      
    </View>
  );
}

// Styles for the screen remain the same...

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 80, // Add padding to avoid overlap with the footer
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unbookText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
