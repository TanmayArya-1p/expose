// screens/HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

function tester() {
  console.log("hello")
  let path="file:///storage/emulated/0/Download/downloaded_file.jpeg"
  CameraRoll.saveAsset(path,{album:"Camera"}).then(onfulfilled => console.log(onfulfilled))
  //console.log(`file:/${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera`)

}

//<Button title="Create Session" onPress={() => navigation.navigate('CreateSession')} />
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Join Session" onPress={() => navigation.navigate('JoinSession')} />
      <Button title="Create Session" onPress={() => navigation.navigate('CreateSession')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
