import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore import
import { db } from "../firebaseConfig"; // Đường dẫn đúng đến file firebaseConfig.js
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";

const calculateNights = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInTime = end.getTime() - start.getTime();
  let nights = differenceInTime / (1000 * 3600 * 24);

  return Math.max(1, nights);
};


const ConfirmAndPayScreen = ({ navigation, route, paymentData }) => {
  const { item } = route.params;
  const [paymentOption, setPaymentOption] = useState('full');
  const [randomFees, setRandomFees] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalBasePrice, setTotalBasePrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [nights, setNights] = useState(1);
  const currentUser = auth.currentUser;
const userId = currentUser.uid;
console.log(userId);

  const randomFeeOptions = [
    { label: 'Cleaning fee', amount: 10 },
    { label: 'Service fee', amount: 20 },
    { label: 'Resort fee', amount: 15 },
    { label: 'Administration fee', amount: 5 },
    { label: 'Insurance fee', amount: 25 },
    { label: 'Security deposit', amount: 50 },
    { label: 'Late checkout fee', amount: 30 },
    { label: 'Early check-in fee', amount: 35 },
    { label: 'Pet fee', amount: 40 },
    { label: 'Parking fee', amount: 12 },
  ];

  const getRandomFees = () => {
    const randomCount = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    const shuffled = randomFeeOptions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, randomCount);
  };

  useEffect(() => {
    const fees = getRandomFees();
    setRandomFees(fees);

    const calculatedNights = calculateNights(item.startDate, item.endDate);
    setNights(calculatedNights); // Set the calculated nights

    const pricePerNight = parseInt(item.price.replace('$', ''));
    const basePrice = pricePerNight * calculatedNights;
    const totalRandomFees = fees.reduce((total, fee) => total + fee.amount, 0);

    const taxRate = item.taxInclusive ? 0 : Math.random() * (15 - 10) + 10; // 10% to 15% random tax
    const taxAmount = (basePrice + totalRandomFees) * (taxRate / 100);

    const total = basePrice + totalRandomFees + taxAmount;
    setTotalBasePrice(basePrice);
    setTotalPrice(total);
  }, [item]);


  
  const handleBooking = async () => {
    const existingBooking = paymentData.find((payment) => payment.id === item.id);
  
    if (existingBooking) {
      setModalVisible(true); // Hiển thị modal nếu địa điểm đã được đặt
    } else {
      // Thêm booking vào paymentData với ngày và giờ hiện tại
      const now = new Date();
      const date = now.toISOString().split('T')[0]; // Lấy ngày hiện tại (YYYY-MM-DD)
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Lấy giờ hiện tại (HH:MM AM/PM)
  
      paymentData.push({
        id: item.id,
        amount: totalPrice.toFixed(2),
        date: date,
        time: time,
      });
  
      try {
        // Thêm tài liệu mới vào Firestore với userId là currentUser.uid
        await addDoc(collection(db, "bookings"), {
          itemId: item.id,
          amount: totalPrice.toFixed(2),
          date: date,
          time: time,
          userId: userId, // Lấy userId của người dùng hiện tại
          status: "booked", // Trạng thái đơn đặt
        });
  
        console.log("Booking successfully saved to Firestore");
  
        // Điều hướng sau khi lưu thành công
        navigation.navigate("Payment Success Screen", {
          amount: totalPrice,
          refNumber: Math.random().toString(36).substring(2, 15), // Số tham chiếu ngẫu nhiên
          itemID: item.id,
        });
      } catch (error) {
        console.error("Error saving booking to Firestore: ", error);
      }
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm and pay</Text>
      </View>

      <View style={styles.listingContainer}>
        <View style={styles.listingInfo}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.listingTitle}>{item.title}</Text>
          <Text style={styles.rating}>
            ★ {item.rating} ({item.favourite ? 'Favourite' : 'Not Favourite'})
          </Text>
        </View>
        <Image source={item.image} style={styles.listingImage} />
      </View>

      <View style={styles.tripDetailsContainer}>
        <Text style={styles.sectionTitle}>Your trip</Text>
        <View style={styles.tripDetailRow}>
          <View>
            <Text style={styles.tripDetailLabel}>Dates</Text>
            <Text>{`${item.startDate} to ${item.endDate}`}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tripDetailRow}>
          <View>
            <Text style={styles.tripDetailLabel}>Guests</Text>
            <Text>{`${item.totalGuests} guest(s)`}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.paymentOptionsContainer}>
        <Text style={styles.sectionTitle}>Payment options</Text>
        <View style={styles.paymentOption}>
          <RadioButton
            value="full"
            status={paymentOption === 'full' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentOption('full')}
          />
          <View style={styles.paymentOptionInfo}>
            <Text style={styles.paymentOptionTitle}>Pay in full</Text>
            <Text style={styles.paymentOptionDescription}>
              Pay ${totalPrice.toFixed(2)} now to finalize your booking.
            </Text>
          </View>
        </View>
        <View style={styles.paymentOption}>
          <RadioButton
            value="part"
            status={paymentOption === 'part' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentOption('part')}
          />
          <View style={styles.paymentOptionInfo}>
            <Text style={styles.paymentOptionTitle}>Pay a part now</Text>
            <Text style={styles.paymentOptionDescription}>
              Make a partial payment now and pay the rest later.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.priceDetailsContainer}>
        <Text style={styles.sectionTitle}>Price details</Text>

        <View>
          {randomFees.map((fee, index) => (
            <View key={index} style={styles.priceRow}>
              <Text style={styles.priceLabel}>{fee.label}</Text>
              <Text>${fee.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{`${item.price} x ${nights}`}</Text>
          <Text>{`$${totalBasePrice.toFixed(2)}`}</Text>
        </View>

        {!item.taxInclusive && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text>{`$${((totalBasePrice + randomFees.reduce((total, fee) => total + fee.amount, 0)) * 0.1).toFixed(2)}`}</Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total (USD)</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.bookNowButtonContainer}>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              This accommodation is already booked.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  listingInfo: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listingTitle: {
    fontSize: 16,
  },
  rating: {
    fontSize: 14,
    color: 'gray',
  },
  listingImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },
  tripDetailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tripDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripDetailLabel: {
    fontSize: 16,
  },
  editButton: {
    fontSize: 20,
    color: 'blue',
  },
  paymentOptionsContainer: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentOptionInfo: {
    marginLeft: 10,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: 'gray',
  },
  priceDetailsContainer: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  bookNowButtonContainer: {
    marginBottom: 30,
  },
  bookNowButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookNowButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ConfirmAndPayScreen;
