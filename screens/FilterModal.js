import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Slider from '@mui/material/Slider'; // Importing Slider from MUI

const FilterModal = ({ isVisible, onClose, onApplyFilters }) => {
  // State for Rooms and Beds
  const [bedrooms, setBedrooms] = useState('-1');
  const [beds, setBeds] = useState('-1');
  const [bathrooms, setBathrooms] = useState('-1');
  const [facilities, setFacilities] = useState({
    kitchen: false,
    pool: false,
    gym: false,
    outdoorSpace: false,
    wifi: false,
  });

  // State for Price Range
  const [priceRange, setPriceRange] = useState([0, 4000]); // Initial values for price range
  const [selectedType, setSelectedType] = useState('');
  const minDistance = 100; // Minimum distance between two thumbs

  // Handle changes to price range with minimum distance logic
  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 2000 - minDistance); // Max limit adjustment
        setPriceRange([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setPriceRange([clamped - minDistance, clamped]);
      }
    } else {
      setPriceRange(newValue);
    }
  };

  // Handle facility selection
  const handleSelectFacility = (facility) => {
    setFacilities((prevState) => ({
      ...prevState,
      [facility]: !prevState[facility],
    }));
  };

  // Clear all filters
  const handleClearAll = () => {
    setBedrooms('-1');
    setBeds('-1');
    setBathrooms('-1');
    setFacilities({
      kitchen: false,
      pool: false,
      gym: false,
      outdoorSpace: false,
      wifi: false,
    });
    setPriceRange([0, 4000]); // Reset to default values
    setSelectedType('');
  };

  // Handle type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleViewResults = () => {
    onApplyFilters({
      bedrooms,
      beds,
      bathrooms,
      facilities,
      priceRange,
      selectedType,
    });
    onClose(); // Close the modal
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>Filters</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {/* Price Range Section */}
            <Text style={styles.sectionTitle}>Price Range</Text>
            <Slider
              value={priceRange}
              onChange={handleChange2} // Using the new handler
              valueLabelDisplay="auto"
              getAriaValueText={(value) => `${value}`}
              min={0} // Set min to 0
              max={2000} // Set max to 2000
              disableSwap
            />
            <View style={styles.priceRange}>
              <View style={styles.priceInputContainer}>
                <Text>Min</Text>
                <TextInput
                  style={styles.priceInput}
                  value={String(priceRange[0])}
                  onChangeText={(value) =>
                    setPriceRange([Number(value), priceRange[1]])
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceInputContainer}>
                <Text>Max</Text>
                <TextInput
                  style={styles.priceInput}
                  value={String(priceRange[1])}
                  onChangeText={(value) =>
                    setPriceRange([priceRange[0], Number(value)])
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Type of Place Section */}
            <Text style={styles.sectionTitle}>Type of place</Text>
            {['Entire place', 'Private room', 'Dormitories'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typePlaceOption,
                  selectedType === type && styles.selected,
                ]}
                onPress={() => handleTypeSelect(type)}>
                <Text>{type}</Text>
                {selectedType === type && <View style={styles.checkMark} />}
              </TouchableOpacity>
            ))}

            {/* Rooms and Beds Section */}
            <Text style={styles.sectionTitle}>Rooms and beds</Text>

            {/* Bedrooms */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput
                style={styles.numberInput}
                value={bedrooms}
                onChangeText={setBedrooms}
                keyboardType="numeric"
              />
            </View>

            {/* Beds */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Beds</Text>
              <TextInput
                style={styles.numberInput}
                value={beds}
                onChangeText={setBeds}
                keyboardType="numeric"
              />
            </View>

            {/* Bathrooms */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bathrooms</Text>
              <TextInput
                style={styles.numberInput}
                value={bathrooms}
                onChangeText={setBathrooms}
                keyboardType="numeric"
              />
            </View>

            {/* Facilities Section */}
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.facilityContainer}>
              {Object.keys(facilities).map((facility) => (
                <TouchableOpacity
                  key={facility}
                  style={styles.facilityOption}
                  onPress={() => handleSelectFacility(facility)}>
                  <Text style={styles.facilityLabel}>
                    {facility.charAt(0).toUpperCase() + facility.slice(1)}
                  </Text>
                  <Image
                    source={
                      facilities[facility]
                        ? require('../assets/images/icons/checked.png') // Show checked image when selected
                        : require('../assets/images/icons/unchecked.png') // Show unchecked image when not selected
                    }
                    style={{ height: 30, width: 30 }} // Image size
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewResultsButton}
              onPress={handleViewResults}>
              <Text style={styles.viewResultsText}>View Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    height: '70%', // Chiếm 70% chiều cao của nửa dưới màn hình
  },
  scrollViewContainer: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 10, // Thêm margin left 10px
  },
  priceInput: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 60, // Kích thước nhỏ hơn cho TextInput
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 80,
    textAlign: 'center',
  },
  facilityContainer: {
    marginBottom: 20,
  },
  facilityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  facilityLabel: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  clearAllText: {
    fontSize: 16,
    color: 'red',
  },
  viewResultsButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
  },
  viewResultsText: {
    color: 'white',
    fontSize: 16,
  },
  typePlaceOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#e0f7fa',
  },
  checkMark: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'green',
  },
});

export default FilterModal;
