import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function FacilitiesAndServicesScreen({ navigation, route }) {
  // Get the item from route.params, with a fallback to an empty object
  const { item = {} } = route.params || {};
  const {
    facilities = [],
    totalGuests = 0,
    roomsAndBeds: {
      beds = 0,
      bedroom: bedrooms = 0,
      bathroom: bathrooms = 0,
    } = {}, // Corrected destructuring
  } = item;
  useEffect(() => {
    Alert.alert('Item Information', JSON.stringify(item, null, 2)); // Format item as a string for better readability
  }, [item]); // This will run when the item changes

  // Mapping for icons associated with facilities
  const iconMap = {
    kitchen: '🍽️', // Fork and knife
    pool: '🏊', // Person swimming
    gym: '🏋️‍♂️', // Weight lifter
    outdoorSpace: '🌳', // Deciduous tree
    wifi: '📶', // Wi-Fi signal
  };

  // Transform facilities to include icons
  const facilitiesData =
    facilities.map((facility) => ({
      icon: iconMap[facility.toLowerCase()] || '❓', // Default icon if not found
      title: facility.charAt(0).toUpperCase() + facility.slice(1), // Capitalize the first letter
    })) || [];

  // Sample data for services
  const servicesData = {
    'Cleaning & Laundry': [
      'Washer',
      'Free dryer - In unit',
      'Ironing service',
      'Dry cleaning service',
    ],
    Bathroom: ['Bathtub', 'Hair dryer', 'Shower gel', 'Towels'],
    Kitchen: ['Microwave', 'Coffee maker', 'Refrigerator', 'Cookware'],
    Entertainment: ['TV', 'Cable channels', 'Streaming services'],
    Outdoor: ['BBQ grill', 'Outdoor furniture', 'Garden'],
  };

  // Render each facility item
  const renderFacilityItem = ({ item }) => (
    <View style={styles.facilityItem}>
      <Text style={styles.iconText}>{item.icon}</Text>
      <Text style={styles.facilityText}>{item.title}</Text>
    </View>
  );

  // Render each service item with a title
  const renderServiceItem = (title, items) => (
    <View style={styles.serviceContainer} key={title}>
      <Text style={styles.serviceTitle}>{title}</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${title}-${index}`} // Ensure unique keys
        renderItem={({ item }) => (
          <Text style={styles.serviceItem}>- {item}</Text>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>{' '}
          {/* You can replace this with an icon */}
        </TouchableOpacity>

        <Text style={styles.headerText}>Facilities and Services</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.subHeader}>Facilities</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {totalGuests} guest{totalGuests !== 1 && 's'}, {beds} bed
            {beds !== 1 && 's'}, {bedrooms} bedroom{bedrooms !== 1 && 's'},{' '}
            {bathrooms} bathroom{bathrooms !== 1 && 's'}
          </Text>
        </View>

        <FlatList
          data={facilitiesData.slice(0, 3)} // Show only a few facilities
          keyExtractor={(facility) => facility.title}
          renderItem={renderFacilityItem}
        />

        <Text style={styles.subHeader}>Services</Text>
        {Object.entries(servicesData).map(([title, items]) =>
          renderServiceItem(title, items)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff', // Set background color to white
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
    fontSize: 24, // Size of the back arrow
  },
  scrollContainer: {
    marginTop: 20, // To prevent the content from being under the back button
    paddingRight: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1, // Add a bottom border for separation
    borderBottomColor: '#ccc',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 20, // Increase the size of the icon text
  },
  facilityText: {
    marginLeft: 10,
    fontSize: 16,
  },
  serviceContainer: {
    marginVertical: 10,
    backgroundColor: '#f9f9f9', // Light gray background for service sections
    padding: 10, // Add padding around the service container
    borderRadius: 5, // Add rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3, // Add shadow for Android
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5, // Add spacing between items
  },
  summaryText: {
    fontSize: 14,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20, // Space between the back button and the title
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
