import {createSlice} from '@reduxjs/toolkit';
import {Call, CallState} from '@exolve/react-native-voice-sdk';
import {store} from '.'

export type CallData = {
  id: string;
  state: CallState;
  dtmfSequence: string;
};

interface ActiveCallsState {
  calls: CallData[];
}

const initialState: ActiveCallsState = {
  calls: [],
};

function updateCall(calls: CallData[], newCall: CallData) {
  return calls.map(call => {
    if (call.id !== newCall.id) {
      return call;
    }
    return newCall
  });
}


export function toCallData(call: Call): CallData {
  let callData  = store.getState().calls.calls.find((c: CallData) => c.id === call.id);
  return {
    id: call.id,
    state: call.state,
    dtmfSequence: (callData != undefined) ? callData?.dtmfSequence : "" 
  };
}

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    setCalls: (state, action) => {
      return {calls: action.payload};
    },
    newCall: (state, action) => {
      if (action.payload !== undefined) {
        const newCallId = action.payload.id;
        if (state.calls.findIndex(c => c.id === newCallId) === -1) {
          return {calls: state.calls.concat(action.payload)};
        }
      }
      return state;
    },
    connected: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    disconnected: (state, action) => {
      return {calls: state.calls.filter(e => e.id !== action.payload.id)};
    },
    error: (state, action) => {
      return {calls: state.calls.filter(e => e.id !== action.payload.id)};
    },
    hold: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    resume: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    conference: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    mute: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    dtmfSequence: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
    noConnection: (state, action) => {
      return {calls: updateCall(state.calls, action.payload)};
    },
  },
});

export const {
  setCalls,
  newCall,
  connected,
  disconnected,
  error,
  hold,
  resume,
  conference,
  mute,
  dtmfSequence,
  noConnection,
} = callsSlice.actions;

export const selectActiveCalls = (state: any) => {
  return state.calls.calls;
};

export default callsSlice.reducer;
