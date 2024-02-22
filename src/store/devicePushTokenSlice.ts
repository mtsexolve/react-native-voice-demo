import {createSlice} from '@reduxjs/toolkit';

const initialState  = {
    token: '',
};

export const devicePushTokenSlice = createSlice({
  name: 'devicePushToken',
  initialState,
  reducers: {
    setDevicePushTokenSliceState: (state, action) => {
      return {
        ...state,
        token: action.payload,
      };
    },
  },
});

export const {setDevicePushTokenSliceState} = devicePushTokenSlice.actions;

export const selectDevicePushTokenState = (state: any) => {
  return state.devicePushToken.token;
};

export default devicePushTokenSlice.reducer;