import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const Description = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const moreInfo = {
    description:
      'Looking for the perfect place to travel and relax? This is a great place to travel and relax.',
    details:
      'Located on a quiet street just minutes from the beach, this villa offers a private pool, fully equipped kitchen, and spacious living area. Perfect for families or groups of friends.',
  };

  const handleViewMore = () => {
    setShowModal(true);
  };

  const {
    facilities,
    totalGuests,
    roomsAndBeds: { bedroom, beds, bathroom },
  } = item;

  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>Description</Text>
      <Text style={styles.description}>{moreInfo.description}</Text>
      {/* Original modal trigger */}
      <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMore}>
        <Text style={styles.viewMoreText}>View more</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.details}>{moreInfo.details}</Text>
          <Text style={{ fontSize: 14 }}>
            {totalGuests} guest{totalGuests !== 1 && 's'}, {beds} bed
            {beds !== 1 && 's'}, {bedroom} bedroom{bedroom !== 1 && 's'},{' '}
            {bathroom} bathroom{bathroom !== 1 && 's'}
          </Text>
          {/* Inserted interface */}
          <View style={styles.infoRow}>
            <Text style={styles.location}>
              {item.country}
            </Text>
            <TouchableOpacity>
              <Text style={styles.openMap}>Open map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bulletPoints}>
            <Text style={styles.bullet}>✔ Consectetur magna consectetur</Text>
            <Text style={styles.bullet}>
              ✔ Voluptate magna fugiat tempor incididunt
            </Text>
            <Text style={styles.bullet}>
              ✔ Aliqua in in mollit laboris tempor in ut incididunt
            </Text>
          </View>
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
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  infoRow: {
    gap: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  openMap: {
    color: 'aqua',
    fontSize: 14,
  },
  bulletPoints: {
    marginTop: 10,
  },
  bullet: {
    fontSize: 14,
    marginBottom: 5,
  },
  viewMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  viewMoreText: {
    color: 'black',
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    fontSize: 16,
    marginBottom: 20,
  },
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
});

export default Description;
