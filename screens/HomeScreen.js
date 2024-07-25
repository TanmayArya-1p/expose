// screens/HomeScreen.js
import React, { useEffect , useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Linking, Image , ActivityIndicator,Switch,TextInput , KeyboardAvoidingView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { NativeWindStyleSheet } from 'nativewind';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionsAndroid } from 'react-native';
import Modal from "react-native-modal";
import Svg, { Path } from "react-native-svg"
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeAtom , keyPairAtom , userIDAtom , sessionIDAtom , relayServerAtom , motherServerAtom, relayServerKeyAtom , sessionPassAtom} from './atoms'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import Toast from 'react-native-simple-toast';

const mserver = require("../tunnel/mserver");
const relay = require("../tunnel/relay");



async function dealWithPerms() {
  const aPerms = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE');
  const bPerms = await PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE');
  console.log("PERMS:")
  console.log("WRITE_EXTERNAL_STORAGE , READ_EXTERNAL_STORAGE")
  console.log(aPerms && bPerms)
  return (aPerms && bPerms)
}

//<Button title="Create Session" onPress={() => navigation.navigate('CreateSession')} />
export default function HomeScreen({ navigation }) {
  const backgroundStyle = "text-black dark:text-white"
  const [hasPermission, setHasPermission] = React.useState(null);

  const [sessionPass, setSessionPass] = useRecoilState(sessionPassAtom)

  const [creating, SetCreating] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const [resetting, setResetting] = React.useState(false)

  const [settingsOpen , setSettingsOpen] = useState(false)
  const [createSessionModelOpen, setCreateSessionModelOpen] = useState(false)
  const [joinSessionModelOpen, setJoinSessionModelOpen] = useState(false)

  const [userID , setUserID] = useRecoilState(userIDAtom)
  const [sessionID , setSessionID] = useRecoilState(sessionIDAtom)

  const [connectionString, setConnectionString] = useState("")

  const [ThemeAtomValue, setThemeAtomValue] = useRecoilState(ThemeAtom)
  const [isEnabled , setEnabled] = useState(ThemeAtomValue == "light" ? false : true);

  const [ServerUrl , setServerUrl] = useRecoilState(motherServerAtom)
  const [RelayServerUrl, setRelayServerUrl] = useRecoilState(relayServerAtom)
  const [relayServerKey, setRelayServerKey] = useRecoilState(relayServerKeyAtom)

  const keypair = useRecoilValueLoadable(keyPairAtom)

  useEffect(() => {
    async function setter() {
      AsyncStorage.setItem("MServerURL" , ServerUrl)
    }
    setter()
  } , [ServerUrl])
  useEffect(() => {
    async function setter() {
      AsyncStorage.setItem("RServerURL" , RelayServerUrl)
    }
    setter()
  } , [RelayServerUrl])
  useEffect(() => {
    async function setter() {
      AsyncStorage.setItem("RServerKey" , relayServerKey)
    }
    setter()
  } , [relayServerKey])
  useEffect(() => {
    async function setter() {
      AsyncStorage.setItem("Theme" , ThemeAtomValue)
      console.log(ThemeAtomValue)
    }
    setter()
  } , [ThemeAtomValue])


  async function requestStoragePermissions() 
  {
    try {
      const aPerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      const bPerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) 
      const granted = aPerms && bPerms
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true)
      } else {
        setHasPermission(false)
      }
    } catch (err) {
      console.log("PERMS REQ FAILED",err)
      setHasPermission(false)
    }
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      const result = await dealWithPerms();
      console.log("RESULT", result);
      setHasPermission(result);
    };
    fetchPermissions();
    requestStoragePermissions()
  }, []);
  //console.log(hasPermission)
  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white w-full">
    <View className="flex-1 justify-center items-center bg-white">
      <View className="flex-row justify-center items-center bg-white w-3/4">
          <Text style={styles.header}>
          Expose
          </Text>
          <Text className="justify-bottom">
            v1.0
          </Text>
      </View>
      {hasPermission ?
      <View className="flex-row justify-center items-center bg-white mt-40 w-3/4">
        <TouchableOpacity disabled={!hasPermission} className="mx-2" style = {styles.container} onPress={() => setJoinSessionModelOpen(true)}>
          <Text style={styles.button}>Join Session</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity disabled={!hasPermission} className="mx-2" style = {styles.container} onPress={() => navigation.navigate('Create Session')}>
          <Text style={styles.button}>Create Session</Text>
        </TouchableOpacity> */}
        <TouchableOpacity disabled={!hasPermission} className="mx-2" style = {styles.container} onPress={() => setCreateSessionModelOpen(true)}>
          <Text style={styles.button}>Create Session</Text>
        </TouchableOpacity>
      </View>
      : 
      <View style={styles.concatbox}>
      <Text className="mt-5" style={styles.header3}>Grant Access Permissions for Media and Restart the App</Text>
      <TouchableOpacity disabled={hasPermission} className="mx-2 mt-5 , mb-5" style = {styles.container} onPress={() => Linking.openSettings()}>
          <Text style={styles.button}>Grant Permissions </Text>
      </TouchableOpacity>
      </View>
      }
    </View>

    <View className="bg-white flex-row align-left items-end justify-end">
      <TouchableOpacity className="border-1 rounded-xl bg-white shadow-2xl m-2 w-15 h-12" style = {styles.container} onPress={() => setSettingsOpen(true)}>
        {/* <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/3019/3019014.png ',
        }}
        /> */}
        <Icon name="settings" size={24}></Icon>
      </TouchableOpacity>
    </View>
    <Modal isVisible={settingsOpen} className="flex-1 ml-1" backdropColor="white" animationInTiming={200} backdropOpacity={1}>
      <View className = "flex-col border rounded-xl bg-white shadow-inner m-2 w-[100%] h-[75%] align-middle justify-center border-slate-200 mr-10"  style = {styles.modal}>
        <TouchableOpacity onPress = {() => setSettingsOpen(false)}>
          <Icon name="arrow-back-outline" size={24}></Icon>
        </TouchableOpacity>

        <Text style={styles.header2}>Settings</Text>

        <View className="flex-col mb-1 p-2 justify-center align-middle" style={styles.container}>
            <View className="flex-row">
              <Icon name="server" className="" size={30}></Icon>
              <Text style={styles.header3} className="">Mother Server</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter Server URL"
              value={ServerUrl}
              onChangeText={setServerUrl}
              placeholderTextColor="#666"
              className="w-[90%] h-10"
            />
        </View>
        
        <View className="flex-col mb-1 p-2 justify-center align-middle" style={styles.container}>
          <View className="flex-col w-full">
            <View className="flex-row justify-center">
              <Icon name="radio" size={30}></Icon>
              <Text style={styles.header3}>Relay Server</Text>
            </View>
            <View className="flex-row">


            </View>
            <View className="flex-row">
              <TextInput
                style={styles.input}
                placeholder="Server URL"
                value={RelayServerUrl}
                onChangeText={setRelayServerUrl}
                placeholderTextColor="#666"
                className="w-[40%] h-10"
              />
              <Icon name="chevron-forward-outline" size={35}></Icon>
              <Text style={styles.header3}>Key</Text>
              <TextInput
                style={styles.input}
                placeholder="Access Key"
                value={relayServerKey}
                onChangeText={setRelayServerKey}
                placeholderTextColor="#666"
                className="h-10 w-[33%]"
              />
            </View>

          </View>
          <View className="flex-row">

          </View>
        </View>
        <View className="flex-row mb-1 p-2 justify-center align-middle" style={styles.container}>
          <View className="flex-row p-2">
            <Text style={styles.header3} className="">Theme</Text>
          </View>
          <View className="flex-row">
            <Icon name="sunny-outline" size={24}></Icon>
            <Switch
              trackColor={{false: '#dbdbdb', true: '#262626'}}
              thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
              onValueChange={() => setThemeAtomValue(a=> {
                setEnabled(a=> !a)
                if(a == "dark") {
                  return "light"
                }
                else {
                  return "dark"
                }
              })}
              value={isEnabled}
            />
          </View>

          <Icon name="moon" size={24}></Icon>
        </View>

        <View className="flex-col mb-1 p-2" style={styles.container}>
          <Text style={styles.header3}>Storage Permissions : {hasPermission ? "✅" : "❌"}</Text>
        </View>
        <TouchableOpacity style ={styles.container} onPress={() => {
          setResetting(true)
          fetch("https://raw.githubusercontent.com/TanmayArya-1p/expose-backend/main/default-config.json").then(r=> r.json().then(j => {
            setServerUrl(j.mserverurl)
            setRelayServerUrl(j.rserverurl)
            setRelayServerKey(j.rserverkey)
            setTimeout(() => setResetting(false) , 700) 
          }))
        }}>
          <View className="flex-row">
            <Text style={styles.button}>Reset To Defaults</Text>
            {resetting && <ActivityIndicator size="small" color="#0000ff" />}
          </View>

        </TouchableOpacity>

      </View>
    </Modal>

    <Modal isVisible={createSessionModelOpen} className="flex-1 ml-1" backdropColor="white" animationInTiming={200} backdropOpacity={1}>
      <View className = "flex-col border rounded-xl bg-white shadow-inner m-2 w-[100%] h-[50%] align-middle justify-center border-slate-200 mr-10"  style = {styles.modal}>
          <TouchableOpacity onPress = {() => setCreateSessionModelOpen(false)}>
            <Icon name="arrow-back-outline" size={24}></Icon>
          </TouchableOpacity>
          <Text style={styles.header2}>Set a Password</Text>
          <Text style={styles.button} className="">Users require this password to join the session</Text>
            <RNPasswordStrengthMeter
              inputStyle={styles.passinput}
              containerWrapperStyle = {{borderColor : "#000000"}}
              onChangeText={(a) => {
                setSessionPass(a)
              }}
              value={sessionPass}
              meterType="bar"
              width={5}
            />

            <TouchableOpacity disabled={!hasPermission} className="mt-5" style = {styles.container} onPress={async () => {
              SetCreating(true)
              console.log(keypair)
              let res = await mserver.isAlive(ServerUrl) 
              if (!res) {
                console.log("INVALID SERVER URL: " + ServerUrl)
                Toast.show('Invalid Server URL');
                SetCreating(false)
                return;
              }
              res = await relay.isAlive(RelayServerUrl , relayServerKey)
              console.log(res)
              if(!res.serverStat) {
                console.log("INVALID RELAY SERVER URL: " + RelayServerUrl)
                Toast.show('Invalid Relay Server URL');
                setJoining(false)
                return;
              }
              if(!res.keyStat) {
                console.log("INVALID RELAY SERVER KEY: " + RelayServerUrl)
                Toast.show('Invalid Relay Server Key');
                setJoining(false)
                return;
              }
              res = await mserver.createSession(ServerUrl , sessionPass, keypair.publicKey)
              setUserID(res.userid)
              setSessionID(res.sessionid)
              SetCreating(false)
              navigate.navigate('Join Session')
              }
            }>
              <View className="flex-row">
                <Text style={styles.button}>Create</Text>
                {creating && <ActivityIndicator size="small" color="#0000ff" /> }
              </View>
            </TouchableOpacity>



            
      </View>
    </Modal>

    <Modal isVisible={joinSessionModelOpen} className="flex-1 ml-1" backdropColor="white"  animationInTiming={200} backdropOpacity={1}>
      <View className = "flex-col border rounded-xl bg-white shadow-inner m-2 w-[100%] h-[35%] align-middle justify-center border-slate-200 mr-10"  style = {styles.modal}>
          <TouchableOpacity onPress = {() => setJoinSessionModelOpen(false)}>
            <Icon name="arrow-back-outline" size={24}></Icon>
          </TouchableOpacity>
          <Text style={styles.header3}>Enter Connection String</Text>
          <View className="flex-col mb-1 p-2 justify-center align-middle" style={styles.container1}>
          <TextInput
              style={styles.input}
              placeholder=""
              value={connectionString}
              onChangeText={setConnectionString}
              placeholderTextColor="#666"
              className="w-[90%] h-10 align-middle"
            />
          </View>

            <TouchableOpacity disabled={!hasPermission} className="m-2" style = {styles.container} onPress={async () => {
              setJoining(true)
              let res = await mserver.isAlive(ServerUrl) 
              if (!res) {
                console.log("INVALID SERVER URL: " + ServerUrl)
                Toast.show('Invalid Server URL');
                setJoining(false)
                return;
              }
              res = await relay.isAlive(RelayServerUrl , relayServerKey)
              console.log(res)
              if(!res.serverStat) {
                console.log("INVALID RELAY SERVER URL: " + RelayServerUrl)
                Toast.show('Invalid Relay Server URL');
                setJoining(false)
                return;
              }
              if(!res.keyStat) {
                console.log("INVALID RELAY SERVER KEY: " + RelayServerUrl)
                Toast.show('Invalid Relay Server Key');
                setJoining(false)
                return;
              }
              res = await mserver.joinSession(connectionString, ServerUrl, keypair.publicKey)
              setUserID(res.userid)
              setSessionID(res.sessionid)
              setSessionPass(res.auth)
              setRelayServerUrl(connectionString.split("||")[2])
              setRelayServerKey(connectionString.split("||")[3])
              setJoining(false)
              navigate.navigate('Join Session')
              }}>
              <View className="flex-row">
                <Text style={styles.button}>Join</Text>
                {joining && <ActivityIndicator size="small" color="#0000ff" />}
                
              </View>
            </TouchableOpacity>
            
      </View>
    </Modal>
    </View>
  );
}





const styles = StyleSheet.create({
  input: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:3,
  
  },
  passinput: {
    borderRadius:3,
    color: "#000000",
    borderColor: "#000000",
  },
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
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
  container1: {
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    overflow: "visible"
  },
  button: {
    color: "rgba(0,0,0,1)",
    fontSize: 17,
    textAlign: "center",
    fontFamily : "Rubik-Regular",
    padding: 4,
  },
  header:{
    fontFamily: "Rubik-Black",
    fontSize: 40,
    textAlign: "center",
    color: "rgba(0,0,0,1)",
    padding: 4,
  },
  header2:{
    fontFamily: "Rubik-Black",
    fontSize: 27,
    textAlign: "center",
    color: "rgba(0,0,0,1)",
    padding: 4,
  },
  header3:{
    fontFamily: "Rubik-Black",
    fontSize: 20,
    textAlign: "center",
    color: "rgba(0,0,0,1)",
    padding: 4,
  },
  tinyLogo: {
    width: 30,
    height: 30,
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
  modal: {
    backgroundColor: "rgba(255,255,255,1)",
    justifyContent: "center",
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
  }
});

NativeWindStyleSheet.create({
  "bg-gradient-to-gray": {
    background: 'linear-gradient(90deg, #000000, #808080)',
  },
});