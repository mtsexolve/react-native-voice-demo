import {createSlice} from '@reduxjs/toolkit';

const initialState  = {
    isSpeakerOn: false,
};

export const audioRouteSlice = createSlice({
  name: 'audioRoute',
  initialState,
  reducers: {
    setSpeakerSliceState: (state, action) => {
      return {
        ...state,
        isSpeakerOn: action.payload,
      };
    },
  },
});

export const {setSpeakerSliceState} = audioRouteSlice.actions;

export const selectSpeakerState = (state: any) => {
  return state.audioRoute.isSpeakerOn;
};

export default audioRouteSlice.reducer;