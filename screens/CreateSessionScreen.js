// screens/CreateSessionScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';


async function createsessiononcss(navigation,serverUrl,masterKey,sessionKey) {
  const tunnel = await require("./tunnel")
  if(!tunnel.isAlive(serverUrl)){
    return 0
  }

  sessionId = await tunnel.sessionCreate(serverUrl,masterKey,sessionKey)
  await Toast.show({
    type: 'success',
    text1: 'Session Created',
    text2: `SID: ${sessionId}`,
  });
  console.log("SES ID",sessionId)
  await tunnel.startListenerThread(serverUrl,sessionKey,sessionId,masterKey)
  navigation.navigate('Listening', { sessionKey, sessionId, masterKey, serverUrl })
}

export default function CreateSessionScreen({ navigation }) {
  const [sessionKey, setSessionKey] = useState('');
  const [masterKey, setMasterKey] = useState('');
  var [serverUrl, setServerUrl] = useState('');
  serverUrl= "http://13.60.58.24:3000"
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
        onPress={() => createsessiononcss(navigation,serverUrl,masterKey,sessionKey)}
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
