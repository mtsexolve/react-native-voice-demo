import {
  RegistrationEvent,
  RegistrationError,
  Call,
  CallClient,
  CallEvent,
  Communicator,
  DevicePushTokenEvent,
} from '@exolve/react-native-voice-sdk';
import {store} from './store';
import {setRegistrationState} from './store/registrationSlice';
import {
  CallData,
  toCallData,
  conference,
  connected,
  disconnected,
  hold,
  mute,
  newCall,
  resume,
  error,
  setCalls,
} from './store/callsSlice';

import {setDevicePushTokenSliceState} from './store/devicePushTokenSlice';

import {Alert} from 'react-native';

export const communicator: Communicator = new Communicator();

export const callClient: CallClient = communicator.callClient();

export const callsMap = new Map<string, Call>();

export function setActiveCalls(calls: Call[]) {
  const callDataArray: CallData[] = [];
  for (const call of calls) {
    callsMap.set(call.id, call);
    callDataArray.push(toCallData(call));
  }
  store.dispatch(setCalls(callDataArray));
}

export function setupCallClientDispatch(client: CallClient) {
  console.log('setupCallClientDispatch');
  setupRegistrationStateDispatch(client);
  setupCallStateDispatch(client);
  setupDevicePushTokenDispatch(client);
}

function setupDevicePushTokenDispatch(client: CallClient) {
  client.on(DevicePushTokenEvent, ({token}) => {
    console.log('Device push token:', token);
    store.dispatch(setDevicePushTokenSliceState(token));
  });
}

function setupRegistrationStateDispatch(client: CallClient) {
  client.on(RegistrationEvent.NotRegistered, ({stateName}) => {
    console.debug('RegistrationEvent.NotRegistered');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Registering, ({stateName}) => {
    console.debug('RegistrationEvent.Registering');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Registered, ({stateName}) => {
    console.debug('RegistrationEvent.Registered');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Offline, ({stateName}) => {
    console.debug('RegistrationEvent.Offline');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.NoConnection, ({stateName}) => {
    console.debug('RegistrationEvent.NoConnection');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Error, ({stateName, errorObj, errorMessage}) => {
    console.debug(`RegistrationEvent.Error: ${errorObj} ${errorMessage}`);
    Alert.alert('Activation error', errorMessage, [
      {text: 'OK', onPress: () => {}},
    ]);
    if (errorObj === RegistrationError.BadCredentials) {
      store.dispatch(setRegistrationState('NotRegistered'));
    } else {
      store.dispatch(setRegistrationState(stateName));
    }
  });
}

function setupCallStateDispatch(client: CallClient) {
  client.on(CallEvent.New, (call: Call) => {
    console.debug(`CallEvent.New id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(newCall(toCallData(call)));
  });
  client.on(CallEvent.Connected, (call: Call) => {
    console.debug(`CallEvent.Connected id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(connected(toCallData(call)));
  });
  client.on(CallEvent.OnHold, (call: Call) => {
    console.debug(`CallEvent.OnHold id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(hold(toCallData(call)));
  });
  client.on(CallEvent.Resumed, (call: Call) => {
    console.debug(`CallEvent.Resumed id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(resume(toCallData(call)));
  });
  client.on(CallEvent.Error, ({call, errorObj, errorMessage}) => {
    console.debug(
      `CallEvent.Error id: ${call.id} error: ${errorObj} ${errorMessage}`,
    );
    Alert.alert('Call error', errorMessage, [{text: 'OK', onPress: () => {}}]);
    callsMap.delete(call.id);
    store.dispatch(error(toCallData(call)));
  });
  client.on(CallEvent.Disconnected, (call: Call) => {
    console.debug(`CallEvent.Disconnected id: ${call.id}`);
    callsMap.delete(call.id);
    store.dispatch(disconnected(toCallData(call)));
  });
  client.on(CallEvent.Conference, (call: Call) => {
    console.debug(`CallEvent.Conference id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(conference(toCallData(call)));
  });
  client.on(CallEvent.Mute, (call: Call) => {
    console.debug(`CallEvent.Mute id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(mute(toCallData(call)));
  });
}
