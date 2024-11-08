import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Nhập Icon từ FontAwesome

const Policies = () => {
  const [showModal, setShowModal] = useState(false);

  const handleViewMore = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Policies</Text>
      <Text style={styles.subTitle}>House rules</Text>
      <View style={styles.policyItem}>
        <Icon name="clock-o" size={20} style={styles.icon} />
        <Text style={styles.policyText}>Earliest check-in time: 14:00</Text>
      </View>
      <View style={styles.policyItem}>
        <Icon name="clock-o" size={20} style={styles.icon} />
        <Text style={styles.policyText}>Latest check-out time: 12:00</Text>
      </View>
      <Text style={styles.subTitle}>Checkin policies</Text>
      <Text style={styles.policyText}>
        It's always a good idea to confirm the check-in policy directly with the
        owner/manager before your arrival so that you can...
      </Text>
      <TouchableOpacity style={styles.showMoreButton} onPress={handleViewMore}>
        <Text style={styles.showMoreText}>View more</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>Policies</Text>
          <Text style={styles.subTitle}>House rules</Text>
          <View style={styles.policyItem}>
            <Icon name="clock-o" size={20} style={styles.icon} />
            <Text style={styles.policyText}>Earliest check-in time: 14:00</Text>
          </View>
          <View style={styles.policyItem}>
            <Icon name="clock-o" size={20} style={styles.icon} />
            <Text style={styles.policyText}>Latest check-out time: 12:00</Text>
          </View>
          <Text style={styles.subTitle}>Checkin policies</Text>
          <Text style={styles.policyText}>
            It's always a good idea to confirm the check-in policy directly with
            the owner/manager before your arrival so that you can...
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'aqua',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  policyText: {
    fontSize: 14,
  },
  showMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreText: {
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Policies;
