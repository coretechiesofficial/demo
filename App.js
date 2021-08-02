import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import NfcManager, { NfcEvents, Ndef , NfcTech} from 'react-native-nfc-manager';

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([
      Ndef.textRecord(valueToWrite),
  ]);
}

class App extends Component {

  async componentDidMount() {
    let is_supported = await NfcManager.isSupported()
    console.log('Supported', is_supported)
    
    
    if (is_supported) {
      NfcManager.start();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        console.log('Scan tag response =>', tag);
        //NfcManager.setAlertMessageIOS('I got your tag!');
        NfcManager.unregisterTagEvent().catch(() => 0);
      });
    }

  }

  componentWillUnmount() {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.unregisterTagEvent().catch(() => 0);
    
  }

  

  _cancel = () => {
    NfcManager.unregisterTagEvent().catch(() => 0);
  }

  _test = async () => {
   
    try {
      await NfcManager.registerTagEvent();
    } catch (ex) {
      console.log('ex', ex);
      NfcManager.unregisterTagEvent().catch(() => 0);
    }
  }

  _testNdef = async () => {
    try {
      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some NFC tags!'
      });
      console.log('res',resp);
      let ndef = await NfcManager.getNdefMessage();
      console.log('ndef',ndef.ndefMessage[0].payload);
      let bytes = buildUrlPayload('hello Successfully demo');
      await NfcManager.writeNdefMessage(bytes);
      console.log('successfully write ndef');
      
    
    } catch (ex) {
      console.warn('ex', ex);
      
    }
  }

  
  render() {
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <Text>NFC Demo</Text>
        <TouchableOpacity
          style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
          onPress={this._test}
        >
          <Text>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
          onPress={this._cancel}
        >
          <Text>Cancel Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
          onPress={this._testNdef}
        >
          <Text>Write Test</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

export default App;