import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const ConcatStringDropdown = ({ func }) => {
  const [isVisible, setIsVisible] = useState(false);
  var [textInputValue, setTextInputValue] = useState('');
  const animation = useRef(new Animated.Value(0)).current;

  const handleTogglePress = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const handleSetPress = () => {
    console.log('Set Pressed: ', textInputValue);
    func(textInputValue)

    // You can perform any action you want with the text input value here
  };
  textInputValue = `123|http://13.60.58.24:3000|75403d0baa70|123`

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTogglePress}>
        <View style={styles.toggleButton}>
          <Button
            title={isVisible ? "Hide" : "Use Concat String"}
            onPress={handleTogglePress}
          />
        </View>
      </TouchableOpacity>
      {isVisible && (
          <View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Concat String"
            value={textInputValue}
            onChangeText={setTextInputValue}
          />
          <Button title="Set" onPress={handleSetPress} />
          </View>
      )}
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
    paddingHorizontal: 8,
  },
});

export default ConcatStringDropdown;
