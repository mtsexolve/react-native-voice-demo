import AsyncStorage from '@react-native-async-storage/async-storage';
import {SipCredentials} from '../types';

const sipCredentialsKey = 'sipCredentials';

export const loadSipCredentials = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(sipCredentialsKey);
    if (jsonValue != null) {
      const loadedCredentials: SipCredentials = JSON.parse(jsonValue);
      return loadedCredentials;
    }
  } catch (e) {
    console.error(e);
  }
};

export const saveSipCredentials = async (sipCredentials: SipCredentials) => {
  try {
    const jsonValue = JSON.stringify(sipCredentials);
    await AsyncStorage.setItem(sipCredentialsKey, jsonValue);
  } catch (e) {
    console.error(e);
  }
};
