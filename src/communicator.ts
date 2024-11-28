import {
  RegistrationEvent,
  RegistrationError,
  Call,
  CallClient,
  CallEvent,
  Communicator,
  DevicePushTokenEvent,
  AudioRoutesEvent,
  CallPendingEvent,
  CallUserAction,
  AudioRouteData,
  AudioRoute
} from '@exolve/react-native-voice-sdk';
import { store } from './store';
import { setRegistrationState } from './store/registrationSlice';
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
  noConnection
} from './store/callsSlice';

import { setDevicePushTokenSliceState } from './store/devicePushTokenSlice';

import { setSpeakerSliceState  } from './store/audioRouteSlice';

import { Alert, Platform } from 'react-native';

export const communicator: Communicator = new Communicator();

export const callClient: CallClient = communicator.callClient();

export const callsMap = new Map<string, Call>();

import { PERMISSIONS, Permission } from 'react-native-permissions';
import { PermissionsRequester, PermissionsState } from './utils/PermissionsRequester';

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
  setupAudioRoutesDispatch(client);
}

function fixSpeakerStateOnIOS(){
  if (Platform.OS === 'ios') {
    callClient.setAudioRoute((store.getState().audioRoute.isSpeakerOn) ?  AudioRoute.Speaker : AudioRoute.Earpiece);
  } 
}

function setupDevicePushTokenDispatch(client: CallClient) {
  client.on(DevicePushTokenEvent, ({ token }) => {
    console.log('Device push token:', token);
    store.dispatch(setDevicePushTokenSliceState(token));
  });
}

function setupAudioRoutesDispatch(client: CallClient) {
  client.on(AudioRoutesEvent.Changed, ({ routes }) => {
    routes.map((route : AudioRouteData) => {
      if(route.route == AudioRoute.Speaker){
        store.dispatch(setSpeakerSliceState(route.isActive));
      }
    });
  });
}

function setupRegistrationStateDispatch(client: CallClient) {
  client.on(RegistrationEvent.NotRegistered, ({ stateName }) => {
    console.debug('RegistrationEvent.NotRegistered');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Registering, ({ stateName }) => {
    console.debug('RegistrationEvent.Registering');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Registered, ({ stateName }) => {
    console.debug('RegistrationEvent.Registered');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Offline, ({ stateName }) => {
    console.debug('RegistrationEvent.Offline');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.NoConnection, ({ stateName }) => {
    console.debug('RegistrationEvent.NoConnection');
    store.dispatch(setRegistrationState(stateName));
  });
  client.on(RegistrationEvent.Error, ({ stateName, errorObj, errorMessage }) => {
    console.debug(`RegistrationEvent.Error: ${errorObj} ${errorMessage}`);
    Alert.alert('Activation error', errorMessage, [
      { text: 'OK', onPress: () => { } },
    ]);
    if (errorObj === RegistrationError.BadCredentials) {
      store.dispatch(setRegistrationState('NotRegistered'));
    } else {
      store.dispatch(setRegistrationState(stateName));
    }
  });
}

function showUserActionRequiredToast(callPendingEvent: CallPendingEvent, callUserAction: CallUserAction) {
  //Skip redundant toast
  if (callUserAction == CallUserAction.EnableLocationProvider && callPendingEvent == CallPendingEvent.AcceptCall) {
    return;
  }
  var toastMessage: string;
  switch (callUserAction) {
    case CallUserAction.NeedsLocationAccess: {
      toastMessage = "No location access for " + ((callPendingEvent == CallPendingEvent.AcceptCall) ? "accept" : "answering") + " call."
      break;
    }
    case CallUserAction.EnableLocationProvider: {
      toastMessage = "Disabled access to geolocation in notification panel"
      break;
    }
    default: {
      toastMessage = "action is null"
      break;
    }
  }
  (global as any)["toast"].show('Call location error: ' + toastMessage, { type: "error" })
}

function setupCallStateDispatch(client: CallClient) {
  client.on(CallEvent.New, (call: Call) => {
    console.debug(`CallEvent.New id: ${call.id}`);
    callsMap.set(call.id, call);
    store.dispatch(newCall(toCallData(call)));
    fixSpeakerStateOnIOS();
  });
  client.on(CallEvent.Connected, (call: Call) => {
    console.debug(`CallEvent.Connected id: ${call.id}`);
    callsMap.set(call.id, call);
    var callData = toCallData(call)
    if( callData.start_time < 0 ){
      callData.start_time = Date.now()
    }
    store.dispatch(connected(callData));
    fixSpeakerStateOnIOS();
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
    fixSpeakerStateOnIOS();
  });
  client.on(CallEvent.Error, ({ call, errorObj, errorMessage }) => {
    console.debug(
      `CallEvent.Error id: ${call.id} error: ${errorObj} ${errorMessage}`,
    );
    (global as any)["toast"].show('Call error: ' + errorMessage, { type: "error" })
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
  client.on(CallEvent.UserActionRequired, ({ call, callPendingEvent, callUserAction }) => {
    console.debug(`CallEvent.UserActionRequired id: ${call.id}`);
    if (callUserAction == CallUserAction.NeedsLocationAccess && callPendingEvent == CallPendingEvent.AcceptCall) {
      const permissions: Permission[] = (Platform.OS === 'ios') ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] : [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      PermissionsRequester.requestPermissions(permissions, (state: PermissionsState) => {
        call.accept()
      })
    } else if (callUserAction == CallUserAction.EnableLocationProvider && callPendingEvent == CallPendingEvent.AcceptCall) {
      call.accept()
    }
    showUserActionRequiredToast(callPendingEvent, callUserAction);
  });
  client.on(CallEvent.ConnectionLost, (call: Call) => {
    console.debug(`CallEvent.ConnectionLost id: ${call.id} ${call.state}`);
    callsMap.set(call.id, call);
    store.dispatch(noConnection(toCallData(call)));
  });
}
