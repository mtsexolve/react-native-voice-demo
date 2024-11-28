import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  ScrollView,
  StyleSheet,
  Platform,
  PermissionsAndroid
} from 'react-native';
import {Colors} from './styles';
import {Icons} from './res/icons';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './navigation';
import {CallItem} from './CallItem';
import {useSelector} from 'react-redux';
import {CallData, selectActiveCalls, dtmfSequence, setCalls} from './store/callsSlice';
import {selectSpeakerState} from './store/audioRouteSlice';
import {AudioRoute, CallState} from '@exolve/react-native-voice-sdk';
import {callClient, callsMap} from './communicator';
import CallOptionsButton from './components/CallOptionsButton';
import DialPad from './DialPad';
import {store} from './store';
import {checkMicrophonePermission} from './components/Permissions';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { selectContactPhone } from 'react-native-select-contact';

type CallViewProps = StackScreenProps<RootStackParamList, 'Calls'>;

var isFocused : boolean = true

export default function CallView({navigation}: CallViewProps) {
  const [isMuted, setMuted] = useState(false);
  const [isDtmfVisible, setDtmfVisible] = useState(false);
  const [activeCallId, setActiveCallId] = useState('');
  const [currentDTMFInput, setCurrentDTMFInput] = useState('');
  const calls : CallData[] = useSelector(selectActiveCalls);
  const isSpeakerOn = useSelector(selectSpeakerState);

  useEffect(() => {
    if (Platform.OS == 'android') {
      (async () => {
        const granted = await checkMicrophonePermission();
        if (!granted) {
          console.error('Requires RECORD_AUDIO permission to accept call');
          navigation.navigate('Home');
        }
      })();
    }
  }, []);

  useEffect(() => {
    updateCallsDuration();
    navigation.addListener('blur', () => {
      isFocused = false;
    })
    navigation.addListener('focus', () => {
      isFocused = true;
    })
    const interval = setInterval(() => {
      if(isFocused)
        updateCallsDuration();
    }, 1000);
    return () => {
      clearInterval(interval)
      navigation.removeListener('focus', () => {})
      navigation.removeListener('blur', () => {})
    };
  }, [navigation]);

  const updateCallsDuration = () => {
    store.dispatch(setCalls(
      store.getState().calls.calls.map(item => ({
        ...item,
        start_time: (item.start_time > 0) ?  item.start_time : - 1.0
      }))
    ));
  }
  
  useEffect(() => {
    if (calls.length === 0) {
      console.debug('No active calls, navigating to Home screen');
      navigation.navigate('Home');
    }
    const activeCall = findActiveCall();
    if(activeCall){
        setMuted(activeCall.isMuted)
        setActiveCallId(activeCall.id)
        let activeCallData = calls.find((c: CallData) => c.id == activeCall.id);
        if(activeCallData != undefined)
            setCurrentDTMFInput(activeCallData.dtmfSequence)
    } else {
      setMuted(false)
      setActiveCallId('')     
      navigation.navigate('Home');
    }
  }, [calls, navigation]);

  const findActiveCall = () => {
    let callData  = calls.find((c: CallData) => c.state === CallState.Connected);

    if (callData !== undefined) {
      return callsMap.get(callData.id);
    } else {
      if(calls.length > 0){
        return [...callsMap.values()][0];
      } else {
        return null
      }
    }
  };

  const activeCall = () => {
    return callsMap.get(activeCallId);
  }

  const toggleMute = () => {
    if (isMuted) {
      activeCall()?.unmute();
    } else {
      activeCall()?.mute();
    }
  };

  const toggleDtmfInput = () => {
    console.log('CallView Dtmf pressed');
    setDtmfVisible(!isDtmfVisible);
  };

  const toggleSpeaker = () => {
    callClient.setAudioRoute((isSpeakerOn) ?  AudioRoute.Earpiece : AudioRoute.Speaker);
  };

  const addCall = () => {
    navigation.navigate('Home');
  };

  const endCall = () => {
    activeCall()?.terminate();
  };

  const transferCall = async () => {
    console.log('CallView: transfer call pressed');
    await getPhoneNumber()
      .then((result) => {
        if (result) {
          activeCall()?.transfer(result.replace(/[^0-9]/g, ""));
        }
      })
      .catch((error) => {
        console.error('Error selecting phone number:', error);
      });
  };

  async function getPhoneNumber() {
    // On android we need to explicitly request for contacts permission and make sure it's granted
    // before calling API methods
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (request === PermissionsAndroid.RESULTS.DENIED) throw Error("Permission Denied");
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) throw Error("Permission Denied");
    }
    const selection = await selectContactPhone();
    if (!selection) {
        return null;
    }  
    let { contact, selectedPhone } = selection;
    console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
    return selectedPhone.number;
}

  const appendDTMFDigit = (digit: string) => {
    activeCall()?.sendDtmf(digit);
    if(activeCall()){
        let callData = calls.find((c: CallData) => c.id === activeCallId);
        if (callData != undefined) {
            store.dispatch(dtmfSequence({
              id: callData.id,
              state: callData.state,
              dtmfSequence: callData.dtmfSequence+digit
            }));
        }
    }  
  };


  const callItems = calls.map((call: CallData) => {
    return <CallItem callId={call.id} key={call.id} start_time={call.start_time} isActive={(call.id === activeCallId)}/>;
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // Paddings to handle safe area
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <View style={Styles.callViewModal}>
        {isDtmfVisible && (
          <View style={{flex: 1, alignSelf: 'stretch'}}>
            <View style={Styles.dtmfEntryPanel}>
              <Text style={Styles.dtmfEntryPanelText}>{currentDTMFInput}</Text>
            </View>
            <DialPad onDigit={appendDTMFDigit} />
          </View>
        )}
        {!isDtmfVisible && (
          <View style={{flex: 1,flexDirection: 'column',alignSelf: 'stretch'}} >
            <ScrollView style={{alignSelf: 'stretch', marginBottom: 20}}>
              {callItems}
            </ScrollView>
            <View style={{flex: 1}} />
          </View>
        )
        }

        <View style={Styles.callViewButtons}>
          <View style={Styles.callViewButtonsRow}>
            <View>
              <CallOptionsButton onPress={toggleMute} isEnabled={isMuted}>
                <Icons.CallMute width="28" height="36" />
              </CallOptionsButton>
              <Text style={Styles.callViewButtonsText}>Mute</Text>
            </View>
            <View>
              <CallOptionsButton onPress={toggleDtmfInput} isEnabled={isDtmfVisible}>
                <Icons.DtmfCall
                  width="30"
                  height="31"
                  style={{color: Colors.black} as StyleProp<ViewStyle>}
                />
              </CallOptionsButton>
              <Text style={Styles.callViewButtonsText}>Dtmf</Text>
            </View>
            <View>
              <CallOptionsButton onPress={toggleSpeaker} isEnabled={isSpeakerOn}>
                <Icons.CallSpeaker width="26" height="28" />
              </CallOptionsButton>
              <Text style={Styles.callViewButtonsText}>Speaker</Text>
            </View>
          </View>
          <View style={Styles.callViewButtonsRow}>
            <View>
              <CallOptionsButton onPress={addCall}>
                <Icons.CallAdd width="28" height="28" />
              </CallOptionsButton>
              <Text style={Styles.callViewButtonsText}>New call</Text>
            </View>
            <View>
              <Pressable
                style={[
                  Styles.callViewButton,
                  {backgroundColor: Colors.mts_red},
                ]}
                onPress={endCall}>
                <Icons.CallEnd width="37" height="18" />
              </Pressable>
              <Text style={Styles.callViewButtonsText}>End call</Text>
            </View>
            <View>
              <CallOptionsButton onPress={transferCall}>
                <Icons.CallTransfer width="52" height="33" />
              </CallOptionsButton>
              <Text style={Styles.callViewButtonsText}>Transfer</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


const Styles = StyleSheet.create({
  callViewModal: {
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
    flex: 1,
    alignSelf: 'stretch',
  },
  callViewTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  callViewEntryPanel: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callViewButtons: {
    height: 280,
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 20,
  },
  callViewButtonsRow: {
    flexDirection: 'row',
    gap: 25,
  },
  callViewButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Colors.mts_bg_grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callViewButtonsText: {
    marginTop: 5,
    fontFamily: 'MTSCompact-Regular',
    fontSize: 12,
    color: Colors.call_control_button_mts,
    textAlign: 'center',
  },
  dtmfEntryPanelText: {
    fontFamily: 'MTSCompact-Medium',
    fontSize: 32,
  },
  dtmfEntryPanel: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})