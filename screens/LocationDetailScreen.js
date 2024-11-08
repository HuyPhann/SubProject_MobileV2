import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import mainStyle from '../assets/stylesheet/StyleSheet.js';
import GeneralLocationInfo from './GeneralLocationInfo'; // Adjust the import path as needed
import FacilitiesAndServices from './FacilitiesAndServices'; // Updated import
import Reviews from './Reviews'; // Updated import
import Policies from './Policies.js';
import Description from './Description.js';

export default function LocationDetailScreen({ navigation, route }) {
  const { item } = route.params || {}; // Safely access `route.params` and fallback to an empty object

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  // Generate a random number of reviews (between 5 and 30)
  const randomReviewsCount = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
 // Between 5 and 30

  // Generate random ratings and calculate the average rating
  let totalRating = 0;
  for (let i = 0; i < randomReviewsCount; i++) {
    totalRating += Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
  }
  const facilitiesData =
    item.facilities?.map((facility) => ({
      icon: facility.toLowerCase(), // Ensure facility names match icon names
      title: facility.charAt(0).toUpperCase() + facility.slice(1), // Capitalize the first letter
    })) || [];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Search Home Screen')}>
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
        {/* Pass randomReviewsCount and averageRating to Reviews */}
        <Reviews
          navigation={navigation}
          reviewsCount={randomReviewsCount}
          rating={item.rating}
        />
        {/* Separator Line */}
        <View style={styles.separator} />
        {/* Pass randomReviewsCount and averageRating to Reviews */}
        <Policies />
        <View style={styles.separator} />
        {/* Pass randomReviewsCount and averageRating to Reviews */}
        <Description item={item} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() =>
            navigation.navigate('Confirm And Pay Screen', { item, navigation })
          }>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    backgroundColor: 'lightgray',
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
  bookNowButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bookNowText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
