import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const GeneralLocationInfo = ({ item, navigation, reviews }) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity>
          <Text style={styles.mapLink}>View map</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.location}>{item.country}</Text>
      <View style={[styles.ratingContainer,styles.row]}>
        <View style={styles.row}>
          <Ionicons name="star" size={24} color="gold" />
          <Text style={styles.rating}>{item.rating}/5</Text>
        </View>
        <Text> · </Text>
        <TouchableOpacity>
          <Text style={styles.reviews}>{reviews} reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  mapLink: {
    color: 'aqua',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  rating: {
    fontSize: 16,
    marginLeft: 5,
  },
  reviews: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline', // Underline for button effect
  },
});

export default GeneralLocationInfo;
