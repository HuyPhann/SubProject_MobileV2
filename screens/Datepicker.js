import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const DatePicker = ({ selectedDates, setSelectedDates, isAnyTime, setIsAnyTime, handleNext, handleSkip }) => {
  const [days, setDays] = useState(1);

  const handleDayPress = (day) => {
    const startDate = new Date(day.dateString);
    const newSelectedDates = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      newSelectedDates.push(currentDate.toISOString().split('T')[0]);
    }

    setSelectedDates(newSelectedDates);
  };

  const updateSelectedDates = (newDays) => {
    if (selectedDates.length === 0) return;

    const startDate = new Date(selectedDates[0]);
    const newSelectedDates = [];

    for (let i = 0; i < newDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      newSelectedDates.push(currentDate.toISOString().split('T')[0]);
    }

    setSelectedDates(newSelectedDates);
  };

  const incrementDays = () => {
    const newDays = days + 1;
    setDays(newDays);
    updateSelectedDates(newDays);
  };

  const decrementDays = () => {
    if (days > 1) {
      const newDays = days - 1;
      setDays(newDays);
      updateSelectedDates(newDays);
    }
  };

  const getMarkedDates = () => {
    if (selectedDates.length === 0) return {};
    
    let markedDates = {};
    selectedDates.forEach((date) => {
      markedDates[date] = {
        selected: true,
        marked: true,
        selectedColor: '#00FFFF',
      };
    });

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>When staying</Text>
      <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pillButton, !isAnyTime && styles.selectedButton]}
          onPress={() => setIsAnyTime(false)}>
          <Text style={styles.pillText}>Choose dates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pillButton, isAnyTime && styles.selectedButton]}
          onPress={() => {
            setIsAnyTime(true);
            setSelectedDates([]);
          }}>
          <Text style={styles.pillText}>Any time</Text>
        </TouchableOpacity>
      </View>

      {!isAnyTime && (
        <>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            minDate={new Date().toISOString().split('T')[0]}
          />

          <View style={styles.daysContainer}>
            <TouchableOpacity onPress={decrementDays} style={styles.adjustButton}>
              <Text style={styles.adjustText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.daysText}>{days} days</Text>
            <TouchableOpacity onPress={incrementDays} style={styles.adjustButton}>
              <Text style={styles.adjustText}>+</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Viền xung quanh
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pillButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'aqua',
  },
  pillText: {
    textAlign: 'center',
    color: '#000',
  },
  calendar: {
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adjustButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  adjustText: {
    fontSize: 20,
  },
  daysText: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  skipButtonText: {
    color: '#000',
  },
  nextButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DatePicker;
