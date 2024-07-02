// screens/CreateSessionScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text , TouchableOpacity, Alert } from 'react-native';


async function createsessiononcss(navigation,serverUrl,masterKey,sessionKey) {
  if(serverUrl=="" || masterKey=="" || sessionKey==""){
    Alert.alert(
      'Missing Fields',
      'Fill Out All Required Fields Before Creating a Session. Required Fields: Master Key, Session Key, Server URL',
    );
    return 0
  }
  if(serverUrl[serverUrl.length - 1] == '/'){
    serverUrl = serverUrl.slice(0, -1)
  }
  const tunnel = await require("./tunnel")
  tunnel.isAlive(serverUrl).then(srvstat => {
    if(!srvstat){
      Alert.alert(
        'Invalid Server URL',
        `Server at '${serverUrl}' is Unresponsive`,
      );
      return 0
    }
  });
  // console.log("CREATE SESSION PRESSED")
  // let servstat = await tunnel.isAlive(serverUrl)
  // console.log("SERVERSTAT" , serverstat)
  sessionId = await tunnel.sessionCreate(serverUrl,masterKey,sessionKey)
  console.log("SES ID",sessionId)
  const IntId = await tunnel.startListenerThread(serverUrl,sessionKey,sessionId,masterKey)
  navigation.navigate('Listening', { sessionKey, sessionId, masterKey, serverUrl, IntId })
}

export default function CreateSessionScreen({ navigation }) {
  const [sessionKey, setSessionKey] = useState('');
  const [masterKey, setMasterKey] = useState('');
  var [serverUrl, setServerUrl] = useState('');
  //serverUrl = "http://192.168.0.113:3000"
  return (
    <View style={styles.container} className="flex-1 bg-white">
      <Text style={styles.header}>Create Session</Text>
      <TextInput
        style={styles.input}
        placeholder="Session Key"
        value={sessionKey}
        onChangeText={setSessionKey}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Master Key"
        value={masterKey}
        onChangeText={setMasterKey}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        placeholderTextColor="#666"
      />
      <TouchableOpacity className="mx-2" style={styles.container1} onPress={() => createsessiononcss(navigation,serverUrl,masterKey,sessionKey)}>
          <Text style={styles.button}>Create Session</Text>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
  },
  button: {
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    textAlign: "center",
    fontFamily : "Roboto",
    padding: 4,
  },
  header:{
    fontFamily: "Rubik-Black",
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
    paddingLeft: 16,
    paddingRight: 16,
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
