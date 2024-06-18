import AsyncStorage from '@react-native-async-storage/async-storage';
import {SipCredentials,Settings} from '../types';

const sipCredentialsKey = 'sipCredentials';
const settingsKey = 'settings';

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

export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(settingsKey);
    if (jsonValue != null) {
      const loadedSettings: Settings = JSON.parse(jsonValue);
      return loadedSettings;
    } else {
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

export const saveSettings = async (settings: Settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(settingsKey, jsonValue);
  } catch (e) {
    console.error(e);
  }
};
