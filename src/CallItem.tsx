import {Image, Pressable, Text, View ,StyleSheet} from 'react-native';
import {Colors} from './styles';
import {Icons} from './res/icons';
import React from 'react';
import {callsMap} from './communicator';
import {CallDirection, CallState} from '@exolve/react-native-voice-sdk';

export function CallItem(props: {callId: string, isActive:boolean}) {
  const call = callsMap.get(props.callId);

  const formattedNumber = call?.formattedNumber;
  const isOnHold = call?.state === CallState.OnHold;
  const isIncomingNew = call?.state === CallState.New && call?.direction == CallDirection.Incoming
  const isNoConnection = call?.state === CallState.LostConnection


  return (
    <View style={{alignSelf: 'stretch', marginTop: 20}}>
      <View style={[Styles.callViewCallInfo,{ backgroundColor: props.isActive ? Colors.mts_bg_grey : Colors.mts_bg_grey_lighter }]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.callViewCallInfoText}>{`${formattedNumber}:`}</Text>
          {isNoConnection ? (
            <React.Fragment>
              <Icons.CallNoConnection style={Styles.callViewCallInfoIcon} width="22" height="22" />
              <Text style={Styles.callViewCallInfoText}>No connect</Text>
            </React.Fragment>
          ) : (
            <Text style={Styles.callViewCallInfoText}>{`${call?.state}`}</Text>
          )}
        </View>
        <View style={{flex: 1, flexDirection: 'row', gap: 20}}>
          <Pressable
            style={Styles.callViewCallInfoButton}
            onPress={() => {
              console.debug('terminate pressed');
              call?.terminate();
            }}>
            <Image
              style={{
                tintColor: Colors.mts_red,
                height: 20,
                width: 20,
              }}
              source={require('./res/images/ic_terminate_call.png')}
            />
            <Text style={Styles.callViewCallInfoControlText}>Terminate</Text>
          </Pressable>
          {!isIncomingNew && !isNoConnection && (
          <Pressable
            style={Styles.callViewCallInfoButton}
            onPress={() => {
              console.debug('hold pressed');
              isOnHold ? call?.resume() : call?.hold();
            }}>
            {isOnHold ? (
                <Icons.CallResume width="22" height="22" />
              ) : (
                <Icons.CallHold width="22" height="22" /> 
            )}
            <Text style={Styles.callViewCallInfoControlText}>
              {isOnHold ? 'Resume' : 'Hold'}
            </Text>
          </Pressable>
          )}
          {isIncomingNew && (
          <Pressable
            style={Styles.callViewCallInfoButton}
            onPress={() => {
              console.debug('accept pressed');
              call?.accept()
            }}>
            <Image
              style={{
                //tintColor: Colors.mts_red,
                height: 22,
                width: 22,
              }}
              source={require('./res/images/ic_accept_call.png')}
            />
            <Text style={Styles.callViewCallInfoControlText}>
              {'Accept'}
            </Text>
          </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  callViewCallInfo: {
    height: 100,
    justifyContent: 'center',
    paddingLeft: 20,
    alignSelf: 'stretch',
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 16,
  },
  callViewCallInfoButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  callViewCallInfoText: {
    marginTop: 20,
    marginRight: 20,
    fontFamily: 'MTSCompact-Regular',
    fontSize: 17,
    color: Colors.call_card_number_text,
  },
  callViewCallInfoIcon: {
    marginTop: 20,
    marginRight: 5,
  },
  callViewCallInfoControlText: {
    marginLeft: 5,
    fontFamily: 'MTSCompact-Regular',
    fontSize: 14,
    color: Colors.mts_text_grey,
  },
})