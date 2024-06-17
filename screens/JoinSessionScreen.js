// screens/JoinSessionScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,useWindowDimensions } from 'react-native';
import ConcatStringDropdown from './ConcatStringDropdown';
import { ReactNativeScannerView } from "@pushpendersingh/react-native-scanner";


async function transition(navigation,serverUrl,sessionId,sessionKey,masterKey) {
  const tunnel = await require("./tunnel")
  if(!tunnel.isAlive(serverUrl)){
    Toast.show({
      type: 'error',
      text1: 'Failed to Join Session'
    });
    return 0
  }
  await tunnel.startListenerThread(serverUrl,sessionKey,sessionId,masterKey)
  navigation.navigate('Listening', { sessionKey, sessionId, masterKey, serverUrl })
  return 1
}
var qrcodebuttontext = "Show QR Code Scanner"
export default function JoinSessionScreen({ navigation }) {

  const [isVisible, setIsVisible] = useState(false);
  
  const toggleElement = () => {
    setIsVisible(!isVisible);
    console.log(qrcodebuttontext)
    if(qrcodebuttontext == "Show QR Code Scanner"){
      qrcodebuttontext = "Hide QR Code Scanner"
    }
    else {
      qrcodebuttontext = "Show QR Code Scanner"
    }
    console.log(qrcodebuttontext)
  };


  var [sessionKey, setSessionKey] = useState('');
  var [sessionId, setSessionId] = useState('');
  var [masterKey, setMasterKey] = useState('');
  var [serverUrl, setServerUrl] = useState('');
  var concatstring = ""
  function setConcatString(inp) {
    try{
      let arr = inp.split("|")
      setServerUrl(arr[1])
      setSessionId(arr[2])
      setMasterKey(arr[0])
      setSessionKey(arr[3])
      concatstring = inp
    }
    catch {
      return 0
    }

  }

  
  //serverUrl = 'http://16.171.177.71:3000'
  //sessionId = "75403d0baa70"
  //masterKey = "123"
  //sessionKey = "123"
  //concatstring = `123|http://16.171.177.71:3000|75403d0baa70|123`
  const {height, width} = useWindowDimensions();
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
      <ConcatStringDropdown func={(inputst) => setConcatString(inputst)}  />
      <Button title={qrcodebuttontext} onPress={toggleElement} />
            {isVisible && (
                <View style={styles.revealedElement}>
                          <ReactNativeScannerView
                          style={{ height, width }}
                          onQrScanned={(value: any) => {
                            console.log(value.nativeEvent.value);
                            if(value.nativeEvent.value != null){
                              toggleElement()
                              setConcatString(value.nativeEvent.value);
                            }
                            }}
                          />
                </View>
            )}

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
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
  revealedElement: {
    marginTop: 20,
    width: '80%',
    padding: 20,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
