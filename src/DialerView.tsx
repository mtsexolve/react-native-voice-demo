import React, {useState,useEffect} from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Colors} from './styles';
import {Icons} from './res/icons';
import {callClient} from './communicator';
import DialPad from './DialPad';
import {useSelector} from 'react-redux';
import {checkMicrophonePermission} from './components/Permissions';
import {PERMISSIONS} from 'react-native-permissions';
import {PermissionsRequester,PermissionsState} from './utils/PermissionsRequester';
import {selectRegistrationState} from './store/registrationSlice';
import {selectCallLocationEnabled} from './store/settingsSlice';

export default function DialerView() {
  const [currentInput, setCurrentInput] = useState('');
  const [lastDialedNumber, setLastDialedNumber] = useState('');
  const registrationState = useSelector(selectRegistrationState);
  const isCallLocationEnabled = useSelector(selectCallLocationEnabled);

  const appendDigit = (digit: string) => {
    setCurrentInput(currentInput.concat(digit));
  };

  const eraseLastDigit = () => {
    if (currentInput.length > 0) {
      setCurrentInput(currentInput.slice(0, -1));
    }
  };

  const makeCall = async () => {
    console.log('make call');
    if (currentInput.length === 0) {
      setCurrentInput(lastDialedNumber);
      return;
    }

    if (registrationState != 'Registered') {
      console.log(`wrong registration state: ${registrationState}`);
      return;
    }

    if (Platform.OS === 'ios') {
      if(isCallLocationEnabled){
        PermissionsRequester.requestPermissions([PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],(state: PermissionsState) => {
          makeCallInternal();
        })
      } else {
        makeCallInternal();
      }
    } else {
      const granted = await checkMicrophonePermission();
      if (granted) {
        if(isCallLocationEnabled){
          PermissionsRequester.requestPermissions([PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],(state: PermissionsState) => {
            makeCallInternal();
          })
        } else {
          makeCallInternal();
        }
      } else {
        console.error('Requires RECORD_AUDIO permission to make call');
      }
    }
  };

  const makeCallInternal = () => {
    callClient.makeCall(currentInput);
    setLastDialedNumber(currentInput);
    setCurrentInput('');  
  };

  return (
    <View style={Styles.dialerView}>
      <View style={Styles.dialerEntryPanel}>
        <Text style={Styles.dialerEntryPanelText}>{currentInput}</Text>
      </View>
      <DialPad onDigit={appendDigit} />
      <View style={Styles.dialerBottomButtons}>
        <View style={Styles.dialerCallButtonView}>
          <Pressable
            style={Styles.dialerCallButton}
            onPress={() => {
              makeCall();
            }}>
            <Icons.ButtonCall width="72" height="72" />
          </Pressable>
        </View>
        <Pressable
          style={Styles.dialerRemoveDigitButton}
          onPress={() => {
            eraseLastDigit();
          }}>
          <Icons.RemoveDigit width="42" height="42" />
        </Pressable>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  dialerView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  dialerEntryPanelText: {
    fontFamily: 'MTSCompact-Medium',
    fontSize: 32,
  },
  dialerRemoveDigitButton: {
    width: 42,
    height: 42,
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 120,
  },
  dialerCallButton: {
    width: 72,
    height: 72,
  },
  dialerEntryPanel: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialerBottomButtons: {
    height: '20%',
    justifyContent: 'center',
  },
  dialerCallButtonView: {
    height: 125,
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', //Centered horizontally
  }
})