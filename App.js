import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

class App extends Component {

  async componentDidMount() {
    let is_supported = await NfcManager.isSupported()
    console.log('anss', is_supported)
    if (is_supported) {
      NfcManager.start();
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        console.log('tag', tag);
        NfcManager.setAlertMessageIOS('I got your tag!');
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
      </SafeAreaView>
    )
  }
}

export default App;