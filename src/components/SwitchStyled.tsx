import { Text, Switch} from 'react-native';
import {Colors,CommonStyles} from '../styles';
import React from "react";

interface SwitchStyledProps {
    onValueChange: () => void,
    isEnabled: boolean,
    labelText: string
}

function SwitchStyled({onValueChange,isEnabled,labelText}: SwitchStyledProps) {
    return (
        <React.Fragment>
            <Text style={CommonStyles.inputLabelText}>{labelText} </Text>
            <Switch
                thumbColor={isEnabled ? Colors.mts_red : Colors.white}
                trackColor={{false: Colors.mts_bg_grey_darker, true: Colors.mts_bg_grey}}
                style={{marginTop: 10}}
                onValueChange={onValueChange}
                value={isEnabled}
            />
        </React.Fragment>
    );
}

export default SwitchStyled;
