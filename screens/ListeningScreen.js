// screens/ListeningScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity  ,Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import BackgroundTimer from 'react-native-background-timer';
import { useNavigation } from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function ListeningScreen({ route }) {
  const navigation = useNavigation();
  const { sessionKey, sessionId, masterKey, serverUrl , IntId} = route.params;
  const [revealKey, setRevealKey] = useState(false);
  const [revealKey1, setRevealKey1] = useState(false);
  const [ServerAlive,SetServerAlive]  = useState(false)
  const serverAliveChecker = async () => {
    const tunnel = await require("./tunnel")
    let t = await tunnel.isAlive(serverUrl)
    SetServerAlive(t)
  }
  let PingingSIID = setInterval(serverAliveChecker,10000)
  const copyToClipboard = (text) => {
    Clipboard.setString(text)
  };
  serverAliveChecker()
  function stopListener(i) {
    BackgroundTimer.clearInterval(i)
    console.log("STOPPED" , i)
    //navigation.navigate('Home')
  } 

  useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    e.preventDefault();
    Alert.alert(
      "",
      "Are you sure you want to end the Listener Thread?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "End Listener",
          onPress: () => {
            console.log(PingingSIID)
            clearInterval(PingingSIID)
            stopListener(IntId)
            navigation.dispatch(e.data.action);
          },
        },
      ],
      { cancelable: true }
    );

  });
  return unsubscribe
  },[navigation]);


  let logoFromFile = require('../assets/Expose.png');
  return (
    <View style={styles.container} className="bg-white">
      <Text style={styles.header}>Listening</Text>
      <View style={styles.concatbox}>
        <Text style={styles.texty1} className="">Server Status: {ServerAlive ? "Alive 🟢" : "Unresponsive 🔴"}</Text>
      </View>
      <Text style={styles.texty} className="mt-5">Session ID: {sessionId}</Text>
      <Text style={styles.texty}>Server URL: {serverUrl}</Text>
      <TouchableOpacity onPress={() => setRevealKey1(!revealKey1)}>
        <Text style={styles.texty}>Master Key: {revealKey1 ? `${masterKey} (Tap to Hide)` : '******  (Tap to Reveal)'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setRevealKey(!revealKey)}>
        <Text style={styles.texty}>Session Key: {revealKey ? `${sessionKey} (Tap to Hide)` : '******  (Tap to Reveal)'}</Text>
      </TouchableOpacity>
      <View style={styles.concatbox} className = "mt-7">
        <Text className="mb-2" style={styles.texty2}>Concat String</Text>
        <View className="flex-row">
          <TouchableOpacity className="w-auto" onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`) }>
          <Text style={styles.textInput} className="w-auto">{`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`.substring(0,10)+`...(Tap to Copy)`}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity className="mx-2" style = {styles.container1} onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`)}>
            <Icon name="content-copy" size={24} color="black" style={styles.icon} />
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.concatbox1} className="justify-center">
          <TouchableOpacity className="mt-10" style = {styles.container1} onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`)}>
              <Icon name="content-copy" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity className="mt-10" style = {styles.container1} onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`)}>
              <Icon name="share" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View> */}
      </View>
    <View style={styles.concatbox} className="mt-4">
      <View style={styles.qrCodeContainer} className="mb-5">
        {`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}` ? <QRCode value={`exp:||${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`} size={200} logo={logoFromFile} /> : null}
      </View>
    </View>
      <Text className="">Go Back to End Listener</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  texty: {
    fontFamily: "Rubik-Light",
    fontSize: 20,
    textAlign: 'center',
  },
  texty1: {
    fontFamily: "Rubik-Regular",
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
  },
    texty2: {
    fontFamily: "Rubik-Black",
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4169e1',  // Royal blue color
    padding: 8,  // Reduced padding
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
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
  concatbox : {
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
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
  icon: {
    marginRight: 10,
  },
  concatbox1 : {
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    width:"100%",
    paddingHorizontal: 10,
    leftMargin:2,
    borderRadius:3,
    fontSize:15,
    justifyContent:"center",
    textAlign: "center"
  },
  button: {
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    textAlign: "center",
    fontFamily : "Roboto",
    padding: 2,
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
    paddingLeft: 8,
    paddingRight: 0,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    shadowColor: "rgba(179,179,179,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
  }
});
