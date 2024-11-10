import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';

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
      <Text style={styles.reviewText}>
        {item.review}
      </Text>
    </View>
  );
};

// ReviewsScreen Component
const ReviewsScreen = ({ route, navigation }) => {
  const { reviews } = route.params; // Get reviews data passed through navigation
  
  // Create a ratings summary object to count how many reviews for each star
  const ratingsSummary = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Back button and title container */}
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text> {/* You can replace this with an icon */}
        </TouchableOpacity>

        <Text style={styles.headerText}>All Reviews</Text>
      </View>

      <ScrollView contentContainerStyle = {{padding:10}}>
        {/* Display total number of reviews */}
        <Text style={styles.totalReviewsText}>{reviews.length} reviews</Text>

        {/* Ratings summary card */}
        <View style={styles.ratingsSummaryCard}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.ratingRow}>
              <Rating
                type="star"
                ratingCount={5}
                startingValue={star}
                imageSize={20}
                readonly
              />
              <Text style={styles.ratingText}>
                {ratingsSummary[star] || 0} review{(ratingsSummary[star] || 0) !== 1 && 's'}
              </Text>
            </View>
          ))}
        </View>

        {/* List of reviews */}
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={true} // Enable vertical scroll indicator
          contentContainerStyle={styles.reviewsList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Space between the header and the reviews list
  },
  reviewItem: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10, // Space between review items vertically
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
    fontWeight: 'bold',
  },
  reviewDate: {
    color: 'gray',
  },
  reviewText: {
    marginTop: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20, // Space between the back button and the title
  },
  reviewsList: {
    paddingBottom: 20, // Padding at the bottom for better scrolling experience
  },
  backButton: { 
    width: 40,
    height: 40,
    borderRadius: 20, // Make it circular
    backgroundColor: '#f0f0f0', // Background color of the button
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add some shadow for Android
  },
  backButtonText: {
    fontSize: 24, // Increase size of the back arrow
    color: 'black', // Color of the back arrow
  },
  totalReviewsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15, // Space between total reviews and the ratings summary
  },
  ratingsSummaryCard: {
    borderWidth: 1,
    backgroundColor: 'transparent', // Light gray background
    padding: 15,
    borderRadius: 10,
    marginBottom: 20, // Space between the summary and the reviews list
    elevation: 2, // Add shadow for Android
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between rows
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ReviewsScreen;
