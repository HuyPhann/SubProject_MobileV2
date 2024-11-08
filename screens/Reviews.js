import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import { faker } from '@faker-js/faker';

// Function to generate random reviews
const generateReviews = (numReviews) => {
  const reviewsData = [];

  for (let i = 0; i < numReviews; i++) {
    reviewsData.push({
      id: i + 1,
      avatar: faker.image.avatar(), // Random avatar image
      name: `${faker.name.firstName()} ${faker.name.lastName()}`, // Random name
      date: `${faker.date.past().toLocaleDateString()}`, // Random past date
      rating: faker.number.int({ min: 1, max: 5 }), // Random rating between 1 and 5
      review: faker.lorem.sentence(faker.number.int({ min: 5, max: 20 })), // Random review
    });
  }

  return reviewsData;
};

// ReviewItem Component
const ReviewItem = ({ item }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewName}>{item.name}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
          <Rating
            type="star"
            ratingCount={5}
            startingValue={item.rating}
            imageSize={20}
            readonly
          />
        </View>
      </View>
      <Text style={styles.reviewText} numberOfLines={3} ellipsizeMode="tail">
        {item.review}
      </Text>
    </View>
  );
};

// Main Reviews Component
const Reviews = ({ navigation, reviewsCount, rating }) => {
  const reviewsData = generateReviews(reviewsCount);

  return (
    <View style={{ padding: 15 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Reviews</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Reviews Screen', { reviews: reviewsData })}>
          <Text style={styles.seeAllText}>See all &gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          <Text style={styles.boldRating}>{rating}</Text>/5
        </Text>
      </View>
      <FlatList
        data={reviewsData.slice(0, reviewsCount)} // Show only the first three reviews
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={true} // Enable horizontal scroll indicator
        contentContainerStyle={styles.reviewsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1, // Add border width
    borderColor: 'black', // Set border color to black
    marginRight: 10, // Space between review items
    maxWidth: 200, // Limit maximum width to 200 px
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewInfo: {
    marginLeft: 10,
  },
  reviewName: {
    fontWeight: 'bold', // Bold name
  },
  reviewDate: {
    color: 'gray',
  },
  reviewText: {
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold', // Make header text bold
  },
  seeAllText: {
    textDecorationLine: 'underline', // Underline the text
    color: 'black', // Change the text color to black
    fontSize: 14, // Font size for "See all >"
  },
  ratingContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 24,
  },
  boldRating: {
    fontWeight: 'bold', // Make the left number bold
    fontSize: 35, // Increase font size for the left number
  },
  reviewsList: {
    paddingVertical: 10,
  },
});

export default Reviews;
