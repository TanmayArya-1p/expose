// screens/HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { NativeWindStyleSheet } from 'nativewind';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function tester() {

  console.log("hello")
  let path="file:///storage/emulated/0/Download/downloaded_file.jpeg"
  CameraRoll.saveAsset(path,{album:"Camera"}).then(onfulfilled => console.log(onfulfilled))
  //console.log(`file:/${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera`)

}

//<Button title="Create Session" onPress={() => navigation.navigate('CreateSession')} />
export default function HomeScreen({ navigation }) {
  const backgroundStyle = "text-black dark:text-white"
  
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
      <View className="flex-row justify-center items-center bg-white mt-40 w-3/4">
        <TouchableOpacity className="mx-2" style = {styles.container} onPress={() => navigation.navigate('Join Session')}>
          <Text style={styles.button}>Join Session</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-2" style = {styles.container} onPress={() => navigation.navigate('Create Session')}>
          <Text style={styles.button}>Create Session</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View className="bg-white flex-row align-left items-end justify-end">
      <TouchableOpacity style = {styles.container1} onPress={() => Linking.openURL("https://github.com/TanmayArya-1p/expose/blob/main/README.md")}>
          <Icon name="information-outline" size={25} color="black" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style = {styles.container1} onPress={() => Linking.openURL("https://github.com/TanmayArya-1p/expose")}>
          <Icon name="github" size={25} color="black" style={styles.icon} />
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
    fontFamily : "Roboto",
    padding: 4,
  },
  header:{
    fontFamily: "Rubik-Black",
    fontSize: 40,
    textAlign: "center",
    color: "rgba(0,0,0,1)",
    padding: 4,
  }
});

NativeWindStyleSheet.create({
  "bg-gradient-to-gray": {
    background: 'linear-gradient(90deg, #000000, #808080)',
  },
});