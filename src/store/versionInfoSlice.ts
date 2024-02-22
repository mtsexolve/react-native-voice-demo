import {createSlice} from '@reduxjs/toolkit';

const initialState  = {
    versionInfo: '',
};

export const versionInfoSlice = createSlice({
  name: 'versionInfo',
  initialState,
  reducers: {
    setVersionInfo: (state, action) => {
      return {
        ...state,
        versionInfo: action.payload,
      };
    },
  },
});

export const {setVersionInfo} =
versionInfoSlice.actions;

export const selectVersionInfo = (state: any) => {
    return state.versionInfo.versionInfo;
  };

export default versionInfoSlice.reducer;
