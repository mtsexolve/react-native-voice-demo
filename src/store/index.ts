import {configureStore} from '@reduxjs/toolkit';
import registrationReducer from './registrationSlice';
import callsReducer from './callsSlice';
import devicePushTokenReducer from './devicePushTokenSlice';
import versionInfoReducer from './versionInfoSlice';

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    calls: callsReducer,
    devicePushToken: devicePushTokenReducer,
    versionInfo: versionInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
