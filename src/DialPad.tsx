import React from 'react';
import {View, Text, GestureResponderEvent, Pressable , StyleSheet} from 'react-native';
import {Colors} from './styles';

type DialerButtonProps = {
  button: string;
  onPress: (digit: string) => void;
};
const DialerButton = ({button, onPress}: DialerButtonProps) => {
  return (
    <Pressable
      style={Styles.dialPadButton}
      onPress={(_event: GestureResponderEvent) => {
        onPress(button);
      }}>
      <Text style={Styles.dialPadNumber}>{button}</Text>
    </Pressable>
  );
};

interface DialPadProps {
  onDigit: (digit: string) => void;
}
export default function DialPad({onDigit}: DialPadProps) {
  return (
    <View style={Styles.dialPadView}>
      <View style={[Styles.dialPadNumbersView]}>
        <View style={Styles.dialPadNumbersRow}>
          <DialerButton button="1" onPress={onDigit} />
          <DialerButton button="2" onPress={onDigit} />
          <DialerButton button="3" onPress={onDigit} />
        </View>
        <View style={Styles.dialPadNumbersRow}>
          <DialerButton button="4" onPress={onDigit} />
          <DialerButton button="5" onPress={onDigit} />
          <DialerButton button="6" onPress={onDigit} />
        </View>
        <View style={Styles.dialPadNumbersRow}>
          <DialerButton button="7" onPress={onDigit} />
          <DialerButton button="8" onPress={onDigit} />
          <DialerButton button="9" onPress={onDigit} />
        </View>
        <View style={Styles.dialPadNumbersRow}>
          <DialerButton button="*" onPress={onDigit} />
          <DialerButton button="0" onPress={onDigit} />
          <DialerButton button="#" onPress={onDigit} />
        </View>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  dialPadView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  dialPadNumber: {
    fontFamily: 'MTSCompact-Medium',
    fontSize: 32,
    textAlign: 'center',
  },
  dialPadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    backgroundColor: Colors.mts_bg_grey,
  },
  dialPadNumbersRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialPadNumbersView: {
    height: '100%',
    marginLeft: '15%',
    marginRight: '15%',
  },
})