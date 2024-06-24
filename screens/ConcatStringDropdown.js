import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

const ConcatStringDropdown = ({ func }) => {
  var [textInputValue, setTextInputValue] = useState('');


  const handleSetPress = () => {
    console.log('Set Pressed: ', textInputValue);
    func(textInputValue)

    // You can perform any action you want with the text input value here
  };
  //textInputValue = `123|http://16.171.161.157:3000|897c22599e2e|123`

  return (
    <View style={styles.container} className="mt-5">
      <View className="flex-row">
      <TextInput
        style={styles.textInput}
        placeholder="Concat String"
        value={textInputValue}
        placeholderTextColor="#666"
        onChangeText={setTextInputValue}
      />
      {/* <Button title="Set" onPress={handleSetPress} className="h-min"/> */}
      <TouchableOpacity className="mx-2" style = {styles.container1} onPress={handleSetPress}>
          <Text style={styles.button}>Set</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

ConcatStringDropdown.propTypes = {
  func: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  toggleButton: {
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 16,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    width:"75%",
    paddingHorizontal: 7,
    leftMargin: 10,
    borderRadius:3
  },
  button: {
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    textAlign: "center",
    fontFamily : "Roboto",
    padding: 4,
  },
  header:{
    fontFamily: "Roboto",
    fontSize: 40,
    textAlign: "center",
    color: "rgba(0,0,0,1)",
    padding: 4,
  },
  container1: {
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 3,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    shadowColor: "rgba(179,179,179,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.82,
    shadowRadius: 0,
    overflow: "visible",
  },
});

export default ConcatStringDropdown;
