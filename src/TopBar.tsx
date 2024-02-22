import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {Colors} from './styles';
import {useSelector} from 'react-redux';
import {selectRegistrationState} from './store/registrationSlice';

export default function TopBar() {
    const registrationTextStatus = useSelector(selectRegistrationState);

  return (
    <View style={Styles.topBarView}>
      <Image
        style={Styles.topBarImage}
        source={require('./res/images/ic_status.png')}
      />
      <Text style={Styles.topBarText}>
        Registration State: {registrationTextStatus}
      </Text>
    </View>
  );
}

const Styles = StyleSheet.create({
  topBarView: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  topBarText: {
    fontFamily: 'MTSCompact-Medium',
    color: Colors.black,
  },
  topBarImage: {
    height: 20,
    width: 20,
    marginLeft: 20,
  },
})
