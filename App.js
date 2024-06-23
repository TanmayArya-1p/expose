import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import JoinSessionScreen from './screens/JoinSessionScreen';
import CreateSessionScreen from './screens/CreateSessionScreen';
import ListeningScreen from './screens/ListeningScreen';
import { FileLogger } from "react-native-file-logger";
const Stack = createStackNavigator();


async function enableLogging() {
  FileLogger.configure()
  let logpath = await FileLogger.getLogFilePaths()
  console.log("LOGGING FILES AT" , logpath)
}

export default function App() {

  enableLogging()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Join Session" component={JoinSessionScreen} options={{title:""}}/>
        <Stack.Screen name="Create Session" component={CreateSessionScreen} options={{title:""}}/>
        <Stack.Screen name="Listening" component={ListeningScreen} options={{title:""}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



