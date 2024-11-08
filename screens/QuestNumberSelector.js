import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GuestNumberSelector = ({ onUpdateGuests }) => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const incrementAdults = () => {
    setAdults(adults + 1);
  };

  const decrementAdults = () => {
    if (adults > 0) {
      setAdults(adults - 1);
    }
  };

  const incrementChildren = () => {
    setChildren(children + 1);
  };

  const decrementChildren = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  const handleNext = () => {
    onUpdateGuests(adults, children);
  };

  const handleSkip = () => {
    onUpdateGuests(0, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How many guests?</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Adults</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={decrementAdults} style={styles.button}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.count}>{adults}</Text>
          <TouchableOpacity onPress={incrementAdults} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Children</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={decrementChildren} style={styles.button}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.count}>{children}</Text>
          <TouchableOpacity onPress={incrementChildren} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  count: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipButton: {
    padding: 10,
    borderColor: '#ccc', // Viền cho nút Skip
    flex: 1,
    marginRight: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#00FFFF', // Màu nền cho nút Next
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default GuestNumberSelector;
