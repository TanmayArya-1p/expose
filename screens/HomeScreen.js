// screens/HomeScreen.js
import React, { useEffect } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Linking, Image , ActivityIndicator } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { NativeWindStyleSheet } from 'nativewind';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionsAndroid } from 'react-native';


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
  useEffect(() => {
    const fetchPermissions = async () => {
      const result = await dealWithPerms();
      console.log("RESULT", result);
      setHasPermission(result);
    };
    fetchPermissions();
  }, []);
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
  //console.log(hasPermission)
  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View className="flex-1">
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
        <TouchableOpacity disabled={!hasPermission} className="mx-2" style = {styles.container} onPress={() => navigation.navigate('Join Session')}>
          <Text style={styles.button}>Join Session</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!hasPermission} className="mx-2" style = {styles.container} onPress={() => navigation.navigate('Create Session')}>
          <Text style={styles.button}>Create Session</Text>
        </TouchableOpacity>
      </View>
      : 
      <View style={styles.concatbox}>
      <Text className="mt-5" style={styles.header2}>Expose Requires Storage Permissions to Send and Recieve Photos</Text>
      <TouchableOpacity disabled={hasPermission} className="mx-2 mt-5 , mb-5" style = {styles.container} onPress={() => requestStoragePermissions()}>
          <Text style={styles.button}>Grant Permissions </Text>
      </TouchableOpacity>
      </View>
      }
    </View>

    <View className="bg-white flex-row align-left items-end justify-end">
      <TouchableOpacity style = {styles.container1} onPress={() => Linking.openURL("https://github.com/TanmayArya-1p/expose")}>
        <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
        }}
        />
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontFamily: "Rubik-Regular",
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
});

NativeWindStyleSheet.create({
  "bg-gradient-to-gray": {
    background: 'linear-gradient(90deg, #000000, #808080)',
  },
});