import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import mainStyle from '../assets/stylesheet/StyleSheet.js';

export default function CreateAnAccountScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState('vn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const data = [
    {
      name: 'vn',
      headNumber: '+84',
      image: require('../assets/images/logos/vn.png'),
      regex: /^[0-9]{9,11}$/, // Adjust regex for Vietnam
    },
    {
      name: 'usa',
      headNumber: '+1',
      image: require('../assets/images/logos/usa.png'),
      regex: /^[0-9]{10}$/, // Adjust regex for USA
    },
  ];

  const selectedCountryData = data.find(
    (country) => country.name === selectedCountry
  );
  const phoneNumberInputPlaceholder =
    selectedCountry === 'usa' ? '+1 phone number' : '+84 phone number';

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.name);
    setIsModalVisible(false);
  };

  const handleContinue = () => {
    const regex = selectedCountryData.regex;
    if (regex.test(phoneNumber)) {
      // Navigate to HomeScreen if phone number is valid
      navigation.navigate('Search Home Screen');
    } else {
      // Show error modal if phone number is invalid
      setIsErrorModalVisible(true);
    }
  };

  return (
    <View
      style={[
        mainStyle.container,
        mainStyle.column_left_flex,
        mainStyle.space_between_flex,
      ]}>
      <View></View>
      <Text style={mainStyle.bold_text}>Create an account</Text>

      <View style={mainStyle.column_left_flex}>
        <Text>Enter your mobile number:</Text>

        <View style={styles.phoneInputContainer}>
          {/* Dropdown to select country */}
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.dropdown}>
            <Image
              source={selectedCountryData.image}
              style={styles.countryFlag}
            />
            <Text style={styles.headNumberText}>
              {selectedCountryData.headNumber}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.phoneInput}
            placeholder={phoneNumberInputPlaceholder}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={{ gap: 5, width: '100%' }}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.aqua_button, mainStyle.row_center_flex]}>
            <Text style={{ color: 'white' }}>Continue</Text>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search Home Screen')}
            style={[styles.apple_button, mainStyle.row_center_flex]}>
            <Image
              source={require('../assets/images/icons/apple.svg')}
              style={styles.icon}
            />
            <Text style={styles.appleText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Continue with Facebook */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search Home Screen')}
            style={[styles.facebook_button, mainStyle.row_center_flex]}>
            <Image
              source={require('../assets/images/icons/facebook.svg')}
              style={styles.icon}
            />
            <Text style={styles.facebookText}>Continue with Facebook</Text>
          </TouchableOpacity>

          {/* Continue with Google */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Search Home Screen')}
            style={[styles.google_button, mainStyle.row_center_flex]}>
            <Image
              source={require('../assets/images/icons/google.svg')}
              style={styles.icon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        <View style={[mainStyle.column_center_flex, { width: '100%' }]}>
          <Text>By signing up, you agree to our</Text>
          <View style={[mainStyle.row_center_flex, { gap: 4 }]}>
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          mainStyle.row_center_flex,
          { width: '100%', alignSelf: 'flex-end' },
        ]}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search Home Screen')}>
          <Text style={styles.log_in}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for country selection */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select your country</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCountrySelect(item)}
                  style={styles.countryItem}>
                  <Image source={item.image} style={styles.countryFlag} />
                  <Text style={styles.modalCountryText}>
                    {item.headNumber} - {item.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for error message */}
      <Modal visible={isErrorModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invalid Phone Number</Text>
            <Text>Please enter a valid phone number.</Text>
            <TouchableOpacity
              onPress={() => setIsErrorModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  countryFlag: {
    width: 24,
    height: 16,
    marginHorizontal: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  headNumberText: {
    fontSize: 16,
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalCountryText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#d9534f',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  aqua_button: {
    backgroundColor: 'aqua',
    width: '100%',
    borderRadius: 5,
    padding: 5,
  },
  apple_button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    borderRadius: 5,
    padding: 5,
  },
  facebook_button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'blue',
    width: '100%',
    borderRadius: 5,
    padding: 5,
  },
  google_button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
    width: '100%',
    borderRadius: 5,
    padding: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  appleText: {
    color: 'black',
  },
  facebookText: {
    color: 'blue',
  },
  googleText: {
    color: 'red',
  },
  log_in: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
