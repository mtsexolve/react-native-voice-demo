import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './navigation';
import {Image, Pressable, StyleProp, Text, View, ViewStyle} from 'react-native';
import TopBar from './TopBar';
import {Icons} from './res/icons';
import {Colors} from './styles';
import DialerView from './DialerView';
import SettingsView from './SettingsView';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {CallData, selectActiveCalls} from './store/callsSlice';
import {CallState} from '@exolve/react-native-voice-sdk';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

var isFirstLaunch : boolean = true

type MainViewProps = StackScreenProps<RootStackParamList, 'Home'>;
export default function MainView({navigation}: MainViewProps) {
  const calls = useSelector(selectActiveCalls);

  useEffect(() => {
    if (calls.some((c: CallData) => c.state === CallState.New) || (isFirstLaunch && calls.length > 0)) {
      isFirstLaunch = false;
      console.debug('Found a new call, navigating to Calls screen');
      navigation.navigate('Calls');
    }
  }, [calls, navigation]);

  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      // Paddings to handle safe area
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <View style={{height: '8%'}}>
        <TopBar />
      </View>
      {calls.length > 0 && (
        <Pressable onPress={() => navigation.navigate('Calls')}>
          <Text
            style={{
              marginTop: 8,
              marginBottom: 8,
              alignSelf: 'stretch',
              textAlign: 'center',
              fontFamily: 'MTSCompact-Bold',
            }}>
            Go to call
          </Text>
        </Pressable>
      )}
      <View style={{flex: 1}}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused}) => {
              if (route.name === 'Dialer') {
                return (
                  <Icons.DtmfCall
                    width="20"
                    height="20"
                    style={
                      {
                        color: focused ? Colors.mts_red : Colors.mts_grey,
                      } as StyleProp<ViewStyle>
                    }
                  />
                );
              } else if (route.name === 'Settings') {
                return (
                  <Image
                    style={{
                      tintColor: focused ? Colors.mts_red : Colors.mts_grey,
                      height: 20,
                      width: 20,
                    }}
                    source={require('./res/images/ic_settings.png')}
                  />
                );
              } else {
                return <Text>Wrong tab</Text>;
              }
            },
            tabBarInactiveTintColor: Colors.mts_grey,
            tabBarActiveTintColor: Colors.mts_red,
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: 'MTSCompact-Medium',
            },
            headerShown: false,
          })}>
          <Tab.Screen name="Dialer" component={DialerView} />
          <Tab.Screen name="Settings" component={SettingsView} />
        </Tab.Navigator>
      </View>
    </View>
  );
}
