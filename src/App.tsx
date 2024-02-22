import React, {useEffect} from 'react';
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
import {loadSipCredentials} from './store/persist';
import {setSipCredentials} from './store/registrationSlice';
import {setVersionInfo} from './store/versionInfoSlice';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    console.info('initializing communicator');
    setupCallClientDispatch(callClient);
    communicator
      .initialize({
        logConfiguration: {logLevel: LogLevel.Debug},
        enableNotifications: true,
        enableBackgroundRunning: false,
        androidNotificationConfiguration: {
          defaultIconName: 'ic_notification',
        },
        callKitConfiguration: {
          iconTemplateImageResource: 'CallKitIcon',
          ringtoneSound: 'ringtone.wav',
          includeInRecents: true,
        },
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
    </Provider>
  );
};

export default App;
