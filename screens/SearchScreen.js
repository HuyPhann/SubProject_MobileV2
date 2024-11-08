import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import mainStyle from '../assets/stylesheet/StyleSheet.js';
import DestinationSelector from './DestinationSelector';
import DatePicker from './Datepicker';
import GuestNumberSelector from './QuestNumberSelector';

const SearchScreen = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState({ adults: 0, children: 0 });
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [confirmedDates, setConfirmedDates] = useState([]);
  const [isAnyTime, setIsAnyTime] = useState(true);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const handleClear = () => {
    setDestination('');
    setGuests({ adults: 0, children: 0 });
    setSelectedDestination('');
    setShowDestinationSelector(false);
    setShowDatePicker(false);
    setSelectedDates([]);
    setConfirmedDates([]);
    setIsAnyTime(true);
    setShowGuestSelector(false);
  };

  const handleDestinationSelect = (dest) => {
    setSelectedDestination(dest);
    setShowDestinationSelector(false);
    setDestination(dest);
  };

  const toggleAnywhere = () => {
    setSelectedDestination('');
    setShowDestinationSelector(!showDestinationSelector);
  };

  const formatDateRange = () => {
    if (confirmedDates.length > 0) {
      const startDate = confirmedDates[0];
      const endDate = confirmedDates[confirmedDates.length - 1];
      return confirmedDates.length === 1
        ? `${startDate}`
        : `${startDate} to ${endDate}`;
    }
    return 'Anytime';
  };
  const handleNext = () => {
    if (selectedDates.length > 0) {
      setConfirmedDates([...selectedDates]);
      console.log('Selected dates confirmed:', [...selectedDates]);
    }
    setShowDatePicker(false);
  };

  const handleSkip = () => {
    setShowDatePicker(false);
    setSelectedDates([]);
    setConfirmedDates([]);
    setIsAnyTime(true);
  };

  const updateGuests = (adults, children) => {
    setGuests({ adults, children });
    setShowGuestSelector(false);
  };

  // Function to create the button text based on selected values
  const valueChoiceText = () => {
  const guestCount = guests.adults + guests.children; // Total number of guests based on the number of adults and children
  const dateText = isAnyTime ? 'Anytime' : formatDateRange(); // Check if it's "Anytime" to assign the value 'Anytime', otherwise get the selected date range
  
  return guestCount === 0
    ? `${selectedDestination || 'Anywhere'} - ${dateText} - Add guests.`
    : `${selectedDestination || 'Anywhere'} - ${dateText} - ${guestCount} Guests`; 
};
  const commentSearch = `The search criteria will be: 
        1. Search by location: If 'Anywhere' is selected, there are no location limits; if a specific value is provided, it searches for items with the location field containing that string.
        2. Search by number of guests: If no guests are selected, it displays 'Add guests'; if a specific number is provided, it searches for items with totalGuests greater than or equal to that number.
        3. Search by date: If isAnyTime is true, there is no date restriction; if a date range is specified, it searches for items with startDate and endDate falling within that range.`;


  const handleSearch = () => {
    navigation.navigate('Search Home Screen', {
      location: selectedDestination || 'Anywhere', // Default to 'Anywhere' if no destination is selected
      guests:
        guests.adults + guests.children > 0
          ? guests.adults + guests.children
          : 'Add guests', // Default to 'Add guests' if there are no guests
      when: isAnyTime
        ? 'Anytime'
        : confirmedDates.length > 0
        ? confirmedDates
        : 'No dates selected', // Default to 'Anytime' if isAnyTime is true, or 'No dates selected' if confirmedDates is empty
    });
  };

  return (
    <View style={[mainStyle.container, { flex: 1 }]}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('Search Home Screen')}>
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={mainStyle.col_flex}>
          {/* Location Section */}
          <View style={styles.borderContainer}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={toggleAnywhere}>
              <Text style={styles.buttonText}>
                {selectedDestination || 'Anywhere'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDestinationSelector && (
            <DestinationSelector
              destination={destination}
              setDestination={setDestination}
              handleDestinationSelect={handleDestinationSelect}
            />
          )}

          {/* Date Section */}
          <View style={styles.borderContainer}>
            <Text style={styles.label}>When</Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setShowDatePicker(!showDatePicker)}>
              <Text style={styles.buttonText}>{formatDateRange()}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DatePicker
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              isAnyTime={isAnyTime}
              setIsAnyTime={setIsAnyTime}
              handleNext={handleNext}
              handleSkip={handleSkip}
            />
          )}

          {/* Guests Section */}
          <View style={styles.borderContainer}>
            <Text style={styles.label}>Guests</Text>
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setShowGuestSelector(!showGuestSelector)}>
              <Text style={styles.buttonText}>
                {guests.adults > 0 || guests.children > 0
                  ? `${guests.adults + guests.children} Guests`
                  : 'Add guests'}
              </Text>
            </TouchableOpacity>
          </View>

          {showGuestSelector && (
            <GuestNumberSelector onUpdateGuests={updateGuests} />
          )}
        </View>
        <Text style={styles.resultText}>{valueChoiceText()}</Text>
        {/* <Text>{commentSearch}</Text> */}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* New Text component for displaying search result */}

        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleSearch}>
          <Text style={styles.nextButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 80,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  clearButton: {
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  clearButtonText: {
    color: 'black',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#00FFFF',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginBottom: 5,
  },
  inputButton: {
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  resultText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    marginBottom: 10, // Add some space between the text and buttons
  },
});

export default SearchScreen;
