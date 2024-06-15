// screens/CreateSessionScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function CreateSessionScreen({ navigation }) {
  const [sessionKey, setSessionKey] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [serverUrl, setServerUrl] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Session Key"
        value={sessionKey}
        onChangeText={setSessionKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Master Key"
        value={masterKey}
        onChangeText={setMasterKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
      />
      <Button
        title="Submit"
        onPress={() => navigation.navigate('Listening', { sessionKey, sessionId: '', masterKey, serverUrl })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
  },
});
