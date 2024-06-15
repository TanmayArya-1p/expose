// screens/JoinSessionScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';


async function transition(navigation,serverUrl,sessionId,sessionKey,masterKey) {
  const tunnel = await require("./tunnel")
  if(!tunnel.isAlive(serverUrl)){
    return 0
  }
  await tunnel.startListenerThread(serverUrl,sessionKey,sessionId,masterKey)
  navigation.navigate('Listening', { sessionKey, sessionId, masterKey, serverUrl })
  return 1
}

export default function JoinSessionScreen({ navigation }) {

  var [sessionKey, setSessionKey] = useState('');
  var [sessionId, setSessionId] = useState('');
  var [masterKey, setMasterKey] = useState('');
  var [serverUrl, setServerUrl] = useState('');

  
  serverUrl = 'http://51.20.65.50:3000'
  sessionId = "38ad4b50fce7"
  masterKey = "123"
  sessionKey = "123"


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
        placeholder="Session ID"
        value={sessionId}
        onChangeText={setSessionId}
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
        onPress={() => transition(navigation,serverUrl,sessionId,sessionKey,masterKey)}
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
