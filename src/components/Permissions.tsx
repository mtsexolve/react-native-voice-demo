import {
    PermissionsAndroid,
} from 'react-native';

export const checkMicrophonePermission = async () => {
    return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ).then(async granted => {
        if (granted) {
            return true;
        }
        return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Exolve React Native Demo App',
                message: 'We need access microphone access to make calls',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        ).then(result => {
            return result === PermissionsAndroid.RESULTS.GRANTED;
        });
    });
};