import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { amount, refNumber } = route.params;

  // Get current date and time
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();
  const timeString = currentDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Possible payment methods
  const paymentMethods = ['Credit card', 'PayPal', 'Bank transfer'];

  // Randomly select a payment method
  const selectedPaymentMethod =
    paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/images/icons/payment-success.png')} // Replace with your success icon image source
          style={styles.successIcon}
        />
      </View>

      {/* Success Message */}
      <Text style={styles.successText}>Payment success!</Text>

      {/* Payment Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ref number</Text>
          <Text style={styles.detailValue}>{refNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{dateString}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{timeString}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment method</Text>
          <Text style={styles.detailValue}>{selectedPaymentMethod}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>${amount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Get PDF Receipt Button */}
      <TouchableOpacity style={styles.pdfButton}>
        <Text style={styles.pdfButtonText}>📄 Get PDF receipt</Text>
      </TouchableOpacity>

      {/* View Booking Button */}
      <TouchableOpacity
        style={styles.viewBookingButton}
        onPress={() => navigation.navigate('Booking Home Screen')}>
        <Text style={styles.viewBookingButtonText}>View booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    position: 'relative', // Position relative for the divider
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: 'gray',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    marginTop: 60,
    height: 1,
    backgroundColor: '#ccc', // Light gray color for the divider
    position: 'absolute',
    top: 65, // Adjust this value to position the divider
    left: 16,
    right: 16,
  },
  pdfButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  pdfButtonText: {
    fontSize: 14,
    color: '#00AEEF',
  },
  viewBookingButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  viewBookingButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;
