// screens/ListeningScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity  ,Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import BackgroundTimer from 'react-native-background-timer';
import { useNavigation } from '@react-navigation/native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useRecoilValue } from 'recoil';
import {ThemeAtom , keyPairAtom , userIDAtom , sessionIDAtom , relayServerAtom , motherServerAtom, relayServerKeyAtom,sessionPassAtom,authblobSelector } from './atoms'
import RNFS from 'react-native-fs';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const mserver = require("../tunnel/mserver");
const relay = require("../tunnel/relay");


function Sync({AisPolling}) {
  const [lastTS , setLastTS] = useState(Date.now())
  const [ImageLookup , SetImageLookup] = useState({})
  const [IDisPolling , IDsetIsPolling] = useState(true)
  const [IRisPolling , IRsetIsPolling] = useState(true)
  const [RHisPolling , RHsetIsPolling] = useState(true)

  useEffect(() => {
    if(!AisPolling) {
      IDsetIsPolling(false)
      IRsetIsPolling(false)
      RHsetIsPolling(false)
      return;
    }
  },[AisPolling])

  return <>
    <ImageDispatcher lastTS= {lastTS} setLastTS={setLastTS} ImageLookup={ImageLookup} SetImageLookup={SetImageLookup} isPolling={IDisPolling} />
    <ImageReceiver ImageLookup={ImageLookup} isPolling={IRisPolling} />
    <RequestHandler isPolling={RHisPolling} setTS={setLastTS} ImageLookup={ImageLookup}/>
  </>
}

function ImageDispatcher({lastTS , setLastTS , ImageLookup , SetImageLookup , isPolling , intrv}) {
  let photos = []

  const serverUrl = useRecoilValue(motherServerAtom)
  const relayServerUrl = useRecoilValue(relayServerAtom)
  const relayServerKey = useRecoilValue(relayServerKeyAtom)
  const keypair = useRecoilValue(keyPairAtom)
  const sID = useRecoilValue(sessionIDAtom)
  const uID = useRecoilValue(userIDAtom)
  const sessionPass = useRecoilValue(sessionPassAtom)
  const authblob = useRecoilValue(authblobSelector)
  const [setIntervalID , SetsetIntervalID] = useState(0)

  if (!intrv) intrv=10000
  if (isPolling == null) isPolling = true

  async function poll() {
    if(!isPolling){
      return;
    }
    photos = await CameraRoll.getPhotos({
      assetType: 'Photos',
      fromTime: lastTS
    });
    for (let i = 0; i < photos.edges.length; i++) {
      await relay.uploadFile(relayServerUrl , photos.edges[i] , sessionPass, relayServerKey)
      let fileContents = await RNFS.readFile(photos.edges[i].node.image.uri , 'base64')
      let hash = CryptoJS.MD5(CryptoJS.enc.Base64.parse(fileContents)).toString()
      let res = await mserver.appendIMG(serverUrl , authblob , uID,hash, photos.edges[i].node.image.fileSize)
      SetImageLookup(a => a[res.image.id] = photos.edges[i])
      console.log(ImageLookup)
    }
    setLastTS(Date.now())
  }

  useEffect(() => {
    SetsetIntervalID(BackgroundTimer.setInterval(poll, intrv))
  }, [])

  useEffect(() => {
    if(!isPolling) BackgroundTimer.clearInterval(setIntervalID)
  } , [isPolling , setIntervalID])

  return null;
}

function ImageReceiver({ImageLookup , intrv , isPolling}) {
  if (!intrv) intrv = 10000
  if (isPolling == null) isPolling = true
  const [setIntervalID , SetsetIntervalID] = useState(0)

  async function poll() {
    if (isPolling) return;
    let res = await mserver.sessionMetaData(serverUrl , authblob , uID)

    for (let i = 0; i < res.images.length; i++) {
      if(! ImageLookup[res.images[i].id]) {
        await mserver.createPR(serverUrl , authblob, uID , res.images[i].seed[res.images[i].seed.length-1].id)
      }
    }
  }

  useEffect(() => {
    SetsetIntervalID(BackgroundTimer.setInterval(poll, intrv))
  }, [])

  useEffect(() => {
    if(!isPolling) BackgroundTimer.clearInterval(setIntervalID)
  } , [isPolling , setIntervalID])

  return null;
}

function RequestHandler({intrv, isPolling,ImageLookup , setTS}) {
  if (!intrv) intrv = 10000
  if (isPolling == null) isPolling = true
  const [setIntervalID , SetsetIntervalID] = useState(0)

  async function poll() {
    if (isPolling) return;
    let res = await mserver.sessionMetaData(serverUrl, authblob, uID)
    for (let i = 0; i < res.requests.length; i++) {
      if(res.requests[i].req.split(" ")[0] === "UploadImage") {
        let res2 = await relay.uploadFile(relayServerUrl , ImageLookup[res.requests[i].req.split(" ")[1]]  , sessionPass , relayServerKey)
        console.log(res2.route_id)
        await mserver.createPR(serverUrl, authblob, uID , res.requests[i].from.id ,  "FetchImage "+res2.route_id)
      }
      else if(res.requests[i].req.split(" ")[0] === "FetchImage") {
        let res2 = await relay.fetchFile(relayServerUrl , sessionPass , relayServerKey ,res.requests[i].req.split(" ")[1])
        await mserver.delPR(serverUrl , authblob , uID , res.requests[i].id)
        setTS(Date.now()+100)
      }
    }
  }

  useEffect(() => {
    SetsetIntervalID(BackgroundTimer.setInterval(poll, intrv))
  }, [])

  useEffect(() => {
    if(!isPolling) BackgroundTimer.clearInterval(setIntervalID)
  } , [isPolling , setIntervalID])

  return null;
}

export default function ListeningScreen(props) {
  const navigation = useNavigation();

  const serverUrl = useRecoilValue(motherServerAtom)
  const relayServerUrl = useRecoilValue(relayServerAtom)
  const relayServerKey = useRecoilValue(relayServerKeyAtom)
  const keypair = useRecoilValue(keyPairAtom)
  const sID = useRecoilValue(sessionIDAtom)
  const uID = useRecoilValue(userIDAtom)
  const sessionPass = useRecoilValue(sessionPassAtom)
  const authblob = useRecoilValue(authblobSelector)

  const [revealKey, setRevealKey] = useState(false);
  const [revealKey1, setRevealKey1] = useState(false);
  const [ServerAlive,SetServerAlive]  = useState(false)
  const [PingingSIID , SetPingingSIID] = useState({})

  const [isPolling, setIsPolling] = useState(true)

  const serverAliveChecker = async () => {
    let t = await relay.isAlive(relayServerUrl)
    SetServerAlive(t)
  }

  useEffect(()=> {
    serverAliveChecker()
    SetPingingSIID(setInterval(serverAliveChecker,25000))
  },[])
  
  
  const copyToClipboard = (text) => {
    Clipboard.setString(text)
  };

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
              clearInterval(PingingSIID)
              setIsPolling(false)
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
      <Text style={styles.texty}>Relay Server URL: {relayServerUrl}</Text>
      <TouchableOpacity onPress={() => setRevealKey1(!revealKey1)}>
        <Text style={styles.texty}>Relay Key: {revealKey1 ? `${relayServerKey} (Tap to Hide)` : '******  (Tap to Reveal)'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setRevealKey(!revealKey)}>
        <Text style={styles.texty}>Session Password: {revealKey ? `${sessionPass} (Tap to Hide)` : '******  (Tap to Reveal)'}</Text>
      </TouchableOpacity>
      <View style={styles.concatbox} className = "mt-7">
        <Text className="mb-2" style={styles.texty2}>Connection String</Text>
        <View className="flex-row">
          <TouchableOpacity className="w-auto" onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`) }>
          <Text style={styles.textInput} className="w-auto">{`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`.substring(0,10)+`...(Tap to Copy)`}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.texty3}>Go Back to End Listener</Text>
      <Sync AisPolling={isPolling}/>
    </View>
  );
}

const styles = StyleSheet.create({
  texty: {
    fontFamily: "Rubik-Regular",
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
  texty3: {
    fontFamily: "Rubik-Black",
    fontSize: 15,
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
    fontFamily : "Rubik-Regular",
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
