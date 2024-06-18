import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable, Platform} from 'react-native';
import {Colors, CommonStyles} from './styles';
import {callClient} from './communicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearSipCredentials,
  selectSipCredentials,
  setSipCredentials,
} from './store/registrationSlice';
import {saveSipCredentials,saveSettings} from './store/persist';
import ButtonStyled from './components/ButtonStyled';
import SwitchStyled from './components/SwitchStyled';
import {SharingProvider} from './utils/SharingProvider';
import {selectRegistrationState} from './store/registrationSlice';
import {selectDevicePushTokenState} from './store/devicePushTokenSlice';
import {selectVersionInfo} from './store/versionInfoSlice';
import Clipboard from '@react-native-clipboard/clipboard';
import {communicator} from './communicator';
import {
  selectAndroidRingtoneEnabled,
  setAndroidRingtoneEnabled,
  selectCallLocationEnabled,
  setCallLocationEnabled
} from './store/settingsSlice';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';

export default function SettingsView() {
  const sipCredentials = useSelector(selectSipCredentials);
  const registrationState = useSelector(selectRegistrationState);
  const devicePushToken = useSelector(selectDevicePushTokenState);
  const versionInfo = useSelector(selectVersionInfo);

  const isAndroidRingtoneEnabled = useSelector(selectAndroidRingtoneEnabled);
  const isCallLocationEnabled = useSelector(selectCallLocationEnabled);

  const dispatch = useDispatch();

  const [username, setUsername] = useState(sipCredentials.username);
  const [password, setPassword] = useState(sipCredentials.password);


  const locationToggleSwitched = () => {
    let newValue = !isCallLocationEnabled;
    saveSettings({
      callLocationEnabled: newValue,
      androidRingtoneEnabled: isAndroidRingtoneEnabled,
    }).then(() => {
      console.debug('Settings state saved');
    });
    communicator.сonfigurationManager().setDetectCallLocationEnabled(newValue);
    dispatch(setCallLocationEnabled(newValue));
  }

  const ringtoneToggleSwitched = () => {
    if(Platform.OS == 'android'){
      let newValue = !isAndroidRingtoneEnabled;
      saveSettings({
        callLocationEnabled: isCallLocationEnabled,
        androidRingtoneEnabled: newValue,
      }).then(() => {
        console.debug('Settings state saved');
      });
      communicator.сonfigurationManager().setAndroidRingtoneEnabled(newValue);
      dispatch(setAndroidRingtoneEnabled(newValue));
    }
  };
  

  const onActivateClicked = () => {
    if (registrationState == 'NotRegistered') {
      callClient.registerAccount(username, password);
      const newCredentials = {
        username: username,
        password: password,
      };
      saveSipCredentials(newCredentials).then(() => {
        console.debug('SIP account state saved');
      });
      dispatch(setSipCredentials(newCredentials));
    } else {
      callClient.unregisterAccount();
      dispatch(clearSipCredentials());
    }

  };

  const onCopyToClipboardClicked = () => {
    Clipboard.setString(devicePushToken)
  };

  const onSendLogsClicked = () => {
    SharingProvider.getInstance().share();
  };

  return (
    <View style={Styles.settingsView}>
      <View style={CommonStyles.accountViewBackground}>
        <View style={CommonStyles.accountView}>
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={CommonStyles.inputBlock}>
              <Text style={CommonStyles.inputLabelText}>User</Text>
              <TextInput
                style={CommonStyles.input}
                selectionColor={Colors.black}
                placeholder="Enter Username"
                onChangeText={text => setUsername(text)}
                value={username}
                editable={registrationState != 'Registered'}
              />
            </View>
            <View style={CommonStyles.inputBlock}>
              <Text style={CommonStyles.inputLabelText}>Password</Text>
              <TextInput
                style={CommonStyles.input}
                selectionColor={Colors.black}
                placeholder="Enter Password"
                onChangeText={text => setPassword(text)}
                value={password}
                editable={registrationState != 'Registered'}
              />
            </View>
            <View style={CommonStyles.actionButtonsBlock}>
              <ButtonStyled onPress={onActivateClicked}>{registrationState == 'NotRegistered' ? "Activate" : "Deactivate"}</ButtonStyled>
            </View>
            <View style={CommonStyles.inputBlock}>
              <Text style={CommonStyles.inputLabelText}>Device push token</Text>
              <TextInput
                style={CommonStyles.input}
                selectionColor={Colors.black}
                placeholder=""
                value={devicePushToken}
                editable={false}
              />
            </View>
            <View style={CommonStyles.actionButtonsBlock}>
              <ButtonStyled onPress={onCopyToClipboardClicked} isActiveStyle={false}>Copy token to clipboard</ButtonStyled>
            </View>
            <View style={Styles.switchBlock}>
              <SwitchStyled
                onValueChange={locationToggleSwitched}
                isEnabled={isCallLocationEnabled}
                labelText="Call location"
              />
              {Platform.OS === 'android' && (
                <SwitchStyled
                  onValueChange={ringtoneToggleSwitched}
                  isEnabled={isAndroidRingtoneEnabled}
                  labelText="Ringtone"
                />
              )
              }
            </View>
            <Pressable
              style={CommonStyles.sendLogsButton}
              onPress={onSendLogsClicked}>
              <Text style={CommonStyles.sendLogsText}>Send logs</Text>
            </Pressable>
            <Text style={[CommonStyles.inputLabelText]}>{versionInfo}</Text>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  settingsView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
  },
  switchBlock: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
  },
});
