import {StyleSheet} from 'react-native';

const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  dark_violet: '#9700CC',
  mts_red: '#E30611',
  mts_red_lighter: '#fa5058',
  grey: '#9e9e9e',
  mts_grey: '#AEB5BD',
  mts_grey_lighter: '#b6bcc4',
  mts_text_grey: '#626C77',
  mts_bg_grey: '#F2F3F7',
  mts_bg_grey_darker: '#a3aac7',
  mts_bg_grey_lighter: '#fafafc',
  call_card_number_text: '#1D2023',
  call_card_button_accept_mts_green: '#26CD58',
  call_control_button_mts: '#1D2023',
};

const CommonStyles = StyleSheet.create({
  // Accounts
  accountViewBackground: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  accountView: {
    height: 500,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  //Buttons
  actionButtonsBlock: {
    height: 60,
    flexDirection: 'row',
    gap: 10,
  },
  sendLogsButton: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 0,
    elevation: 0,
    backgroundColor: 'transparent'
  },
  sendLogsText: {
    fontSize: 16,
    fontFamily: 'MTSCompact-Regular',
    lineHeight: 21,
    fontWeight: 'regular',
    letterSpacing: 0.25,
    color: 'black'
  },
  //Input
  input: {
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.mts_bg_grey,
    borderColor: Colors.mts_grey,
    paddingHorizontal: 10,
    color: Colors.mts_text_grey,
    fontSize: 16,
    fontFamily: 'MTSCompact-Regular',
  },
  inputLabelText: {
    marginTop: 10,
    fontFamily: 'MTSCompact-Regular',
    fontSize: 14,
    color: Colors.mts_text_grey,
  },
  inputBlock: {
    height: 100,
  },
  //Spacing
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export {CommonStyles, Colors};
