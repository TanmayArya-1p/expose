// screens/ListeningScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';


export default function ListeningScreen({ route }) {
  const { sessionKey, sessionId, masterKey, serverUrl } = route.params;
  const [revealKey, setRevealKey] = useState(false);

  const copyToClipboard = (text) => {
    Clipboard.setString(text)
  };

  return (
    <View style={styles.container}>
      <Text>Listening...</Text>
      <Text>Session ID: {sessionId}</Text>
      <Text>Server URL: {serverUrl} <Button title="Copy" onPress={() => copyToClipboard(serverUrl)} /></Text>
      <Text>Master Key: {masterKey} <Button title="Copy" onPress={() => copyToClipboard(masterKey)} /></Text>
      <Button title="Copy Concat" onPress={() => copyToClipboard(`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`)} />
      <TouchableOpacity onPress={() => setRevealKey(!revealKey)}>
        <Text>Session Key: {revealKey ? sessionKey : '******'}</Text>
      </TouchableOpacity>
      <View style={styles.qrCodeContainer}>
        {`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}` ? <QRCode value={`${masterKey}|${serverUrl}|${sessionId}|${sessionKey}`} size={200} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',}
});
