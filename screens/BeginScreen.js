import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import mainStyle from "../assets/stylesheet/StyleSheet"
export default function Beginscreen({ navigation }) {
  return (
    <View style={[mainStyle.container, mainStyle.column_center_flex]}>
      <TouchableOpacity onPress = {()=> navigation.navigate("Create An Account Screen") }>
      <Image source={require('../assets/images/logos/app-logo.png')} /></TouchableOpacity>
      
    </View>
  );
}
