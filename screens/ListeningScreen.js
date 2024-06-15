// screens/ListeningScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListeningScreen({ route }) {
  const { sessionKey, sessionId, masterKey, serverUrl } = route.params;
  const [revealKey, setRevealKey] = useState(false);

  const copyToClipboard = (text) => {
    console.log(text);
  };

  return (
    <View style={styles.container}>
      <Text>Listening...</Text>
      <Text>Session ID: {sessionId}</Text>
      <Text>Server URL: {serverUrl} <Button title="Copy" onPress={() => copyToClipboard(serverUrl)} /></Text>
      <Text>Master Key: {masterKey} <Button title="Copy" onPress={() => copyToClipboard(masterKey)} /></Text>
      <TouchableOpacity onPress={() => setRevealKey(!revealKey)}>
        <Text>Session Key: {revealKey ? sessionKey : '******'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
