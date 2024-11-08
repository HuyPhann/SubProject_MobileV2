import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

const destinations = [
  {
    name: 'Anywhere',
    image: require('../assets/images/pictures/any-where.png'),
  },
  { name: 'Asia', image: require('../assets/images/pictures/asia.png') },
  { name: 'Europe', image: require('../assets/images/pictures/europe.png') },
  {
    name: 'North America',
    image: require('../assets/images/pictures/north-america.png'),
  },
  {
    name: 'South America',
    image: require('../assets/images/pictures/south-america.png'),
  },
  { name: 'Africa', image: require('../assets/images/pictures/africa.png') },
  {
    name: 'Oceania',
    image: require('../assets/images/pictures/oceania.png'),
  },
];

const DestinationSelector = ({
  destination,
  setDestination,
  handleDestinationSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where to?</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Search"
          value={destination}
          onChangeText={setDestination}
        />
        {destination.length > 0 && (
          <TouchableOpacity onPress={() => setDestination('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✖</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.options}>
        {destinations
          .filter((dest) => dest.name.toLowerCase().includes(destination.toLowerCase()))
          .map((dest, index) => (
            <TouchableOpacity key={index} onPress={() => handleDestinationSelect(dest.name)} style={styles.option}>
              <Image source={dest.image} style={styles.optionImage} />
              <Text style={styles.optionText}>{dest.name}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    minHeight: 50,
    flex: 1,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#000',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  option: {
    padding: 10,
    alignItems: 'center',
  },
  optionImage: {
    width: 100,
    height: 100,
  },
  optionText: {
    textAlign: 'center',
  },
});

export default DestinationSelector;
