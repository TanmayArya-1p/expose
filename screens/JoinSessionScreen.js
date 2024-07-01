// screens/JoinSessionScreen.js
import React, { useState , useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,useWindowDimensions,Text,TouchableOpacity, ScrollView , Alert} from 'react-native';
import ConcatStringDropdown from './ConcatStringDropdown';
//import { ReactNativeScannerView } from "@pushpendersingh/react-native-scanner";
import {Camera, Code, useCameraDevice,useCodeScanner} from 'react-native-vision-camera'


async function transition(navigation,serverUrl,sessionId,sessionKey,masterKey) {
  if(serverUrl == "" || sessionId == "" || sessionKey == "" || masterKey == ""){
    Alert.alert(
      'Missing Fields',
      'Fill Out All Required Fields Before Joining a Session. Required Fields: Master Key, Session Key, Session ID, Server URL',
    );
    return 0
  }
  const tunnel = await require("./tunnel")
  // sesses= await tunnel.fetchSessions()
  // if(!(sessionId in sesses)){
  //   Alert.alert(
  //     'Invalid Session ID',
  //     'The Session ID you have entered is invalid. Please try again.',
  //   );
  //   return 0
  // }
  if(serverUrl[serverUrl.length - 1] == '/'){
    serverUrl = serverUrl.slice(0, -1)
  }
  const IntId = await tunnel.startListenerThread(serverUrl,sessionKey,sessionId,masterKey)
  navigation.navigate('Listening', { sessionKey, sessionId, masterKey, serverUrl, IntId })
  return 1
}
var qrcodebuttontext = "QR Code Scanner"
export default function JoinSessionScreen({ navigation }) {



  const [isVisible, setIsVisible] = useState(false);
  
  const device = useCameraDevice("back")


  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      toggleElement()
      navigation.dispatch(e.data.action);
    });
    return unsubscribe
  },[navigation]);



  const toggleElement = () => {
    setIsVisible(!isVisible);
    console.log(qrcodebuttontext)
    if(qrcodebuttontext == "QR Code Scanner"){
      qrcodebuttontext = "Close QR Code Scanner"
    }
    else {
      qrcodebuttontext = "QR Code Scanner"
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
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      console.log(codes[0].value);
      if(codes[0].value != null){
        if(codes[0].value.slice(0,6) == "exp:||"){
          toggleElement()
          setConcatString(codes[0].value.slice(6));
        }
      }
    },
  });
  
  //serverUrl = 'http://16.171.177.71:3000'
  //sessionId = "75403d0baa70"
  //masterKey = "123"
  //sessionKey = "123"
  //concatstring = `123|http://16.171.177.71:3000|75403d0baa70|123`
  const {height, width} = useWindowDimensions();
  return (
    <View style={styles.container} className="flex-1 bg-white">
      <Text style={styles.header}>Join Session</Text>
      <ConcatStringDropdown className="" func={(inputst) => setConcatString(inputst)}  />
      <TextInput
        style={styles.input}
        placeholder="Session Key"
        value={sessionKey}
        onChangeText={setSessionKey}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Session ID"
        value={sessionId}
        onChangeText={setSessionId}
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
      <TouchableOpacity  style={styles.container1} onPress={() => transition(navigation,serverUrl,sessionId,sessionKey,masterKey)}>
          <Text style={styles.button}>Join Session</Text>
      </TouchableOpacity>
            {isVisible && (
                      <Camera
                      style={StyleSheet.absoluteFill}
                      codeScanner={codeScanner}
                      device={device}
                      isActive={true}
                    />
            )}
      <TouchableOpacity className="mx-2 opacity-70" style={styles.container1} onPress={toggleElement}>
          <Text style={styles.button}>{qrcodebuttontext}</Text>
      </TouchableOpacity>
    </View>
      

  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:3
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
    fontFamily:"courier"
  },
  revealedElement: {
    marginTop: 20,
    width: '80%',
    padding: 20,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex:1,
    backgroundColor: "rgba(255,255,255,1)",
    alignItems: "center",
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
    overflow: "visible"
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
    padding: 2,
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
  qrc: {
    height:"40%",
    width: "100%"
  }
});
