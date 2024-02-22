import {createSlice} from '@reduxjs/toolkit';
import {SipCredentials} from '../types';

interface RegistrationData {
  registrationState: string;
  sipCredentials: SipCredentials;
}

const initialState: RegistrationData = {
  registrationState: '',
  sipCredentials: {
    username: '',
    password: '',
  },
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setRegistrationState: (state, action) => {
      return {
        ...state,
        registrationState: action.payload,
      };
    },
    setSipCredentials: (state, action) => {
      return {
        ...state,
        sipCredentials: {
          username: action.payload.username,
          password: action.payload.password,
        },
      };
    },
    clearSipCredentials: state => {
      return {
        ...state,
        sipCredentials: {
          username: '',
          password: '',
        },
      };
    },
  },
});

export const {setRegistrationState, setSipCredentials, clearSipCredentials} =
  registrationSlice.actions;

export const selectRegistrationState = (state: any) => {
  return state.registration.registrationState;
};

export const selectSipCredentials = (state: any) => {
  return state.registration.sipCredentials;
};

export default registrationSlice.reducer;
