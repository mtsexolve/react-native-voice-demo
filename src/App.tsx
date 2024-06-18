import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import CallView from './CallView';
import {LogLevel} from '@exolve/react-native-voice-sdk';
import {createStackNavigator} from '@react-navigation/stack';
import {
  callClient,
  communicator,
  setActiveCalls,
  setupCallClientDispatch,
} from './communicator';
import {RootStackParamList} from './navigation';
import MainView from './MainView';
import {Provider} from 'react-redux';
import {store} from './store';
import {loadSipCredentials,loadSettings} from './store/persist';
import {setSipCredentials} from './store/registrationSlice';
import {
  setCallLocationEnabled,
  setAndroidRingtoneEnabled,
} from './store/settingsSlice';
import {setVersionInfo} from './store/versionInfoSlice';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from "react-native-toast-notifications";
import { PERMISSIONS } from 'react-native-permissions';
import { PermissionsRequester, PermissionsState } from './utils/PermissionsRequester';


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  var isAndroidRingtoneEnabled = false;
  var isCallLocationEnabled = true;

  useEffect(() => {
    setupCallClientDispatch(callClient);
    loadSettings().then(settings => {
      if (settings !== undefined) {
        store.dispatch(setCallLocationEnabled(settings.callLocationEnabled));
        store.dispatch(setAndroidRingtoneEnabled(settings.androidRingtoneEnabled));
        isAndroidRingtoneEnabled = settings.androidRingtoneEnabled;
        isCallLocationEnabled = settings.callLocationEnabled;
        console.debug('App settings loaded');
      }
      console.info('initializing communicator');
      communicator
        .initialize({
          logConfiguration: {logLevel: LogLevel.Debug},
          enableNotifications: true,
          androidNotificationConfiguration: {
            defaultIconName: 'ic_notification',
            enableRingtone: isAndroidRingtoneEnabled
          },
          callKitConfiguration: {
            iconTemplateImageResource: 'CallKitIcon',
            ringtoneSound: 'ringtone.wav',
            includeInRecents: true,
            notifyInForeground: false,
            enableDtmf: false,
          },
          enableSecureConnection: false,
          enableDetectCallLocation: isCallLocationEnabled
        })
        .then(() => {
          loadSipCredentials().then(sipCredentials => {
            if (sipCredentials !== undefined) {
              store.dispatch(setSipCredentials(sipCredentials));
              console.debug('SIP credentials loaded');
            }
          });
          callClient.requestRegistrationState();
          callClient.getCalls().then(activeCalls => setActiveCalls(activeCalls));
          communicator.getVersionInfo().then(versionInfo => {
            store.dispatch(setVersionInfo(`SDK ver.${versionInfo.buildVersion} env: ${(versionInfo.environment.length > 0) ? versionInfo.environment : "default"}`));
          });
        });
    });
    if(Platform.OS === 'android'){
      PermissionsRequester.requestPermissions([PERMISSIONS.ANDROID.POST_NOTIFICATIONS], (state: PermissionsState) => {})
    }
  }, []);

  return (
    <Provider store={store}>

        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              detachInactiveScreens={false}
              screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={MainView} />
              <Stack.Screen name="Calls" component={CallView} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      <Toast 
        placement="bottom"
        duration={2000}
        ref={(ref) => ((global as any)["toast"] = ref)}
      />
    </Provider>
  );
};

export default App;
