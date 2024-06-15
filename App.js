import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import JoinSessionScreen from './screens/JoinSessionScreen';
import CreateSessionScreen from './screens/CreateSessionScreen';
import ListeningScreen from './screens/ListeningScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JoinSession" component={JoinSessionScreen} />
        <Stack.Screen name="CreateSession" component={CreateSessionScreen} />
        <Stack.Screen name="Listening" component={ListeningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
