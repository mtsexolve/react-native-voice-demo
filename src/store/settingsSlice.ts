import {createSlice} from '@reduxjs/toolkit';
import {Settings} from '../types';

const initialState : Settings  = {
    callLocationEnabled: true,
    androidRingtoneEnabled: false
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCallLocationEnabled: (state, action) => {
      return {
        ...state,
        callLocationEnabled: action.payload,
      };
    },
    setAndroidRingtoneEnabled: (state, action) => {
      return {
        ...state,
        androidRingtoneEnabled: action.payload,
      };
    },
  },
});

export const {setCallLocationEnabled,setAndroidRingtoneEnabled} =
settingsSlice.actions;

export const selectCallLocationEnabled = (state: any) => {
    return state.settings.callLocationEnabled;
  };

export const selectAndroidRingtoneEnabled = (state: any) => {
    return state.settings.androidRingtoneEnabled;
  };

export default settingsSlice.reducer;