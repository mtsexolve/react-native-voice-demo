import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Colors} from '../styles';
import React from "react";

interface ButtonStyledProps {
    children: React.ReactNode,
    onPress: () => void,
    isActiveStyle?: boolean
}

function ButtonStyled({children, onPress, isActiveStyle}: ButtonStyledProps) {
    return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [{ backgroundColor: !isActiveStyle ? (pressed ? Colors.mts_grey_lighter : Colors.mts_grey) : (pressed ? Colors.mts_red_lighter : Colors.mts_red) }, styles.button ]}
            >
                    <Text style={[styles.buttonText]}>
                        {children}
                    </Text>
            </Pressable>
    );
}

ButtonStyled.defaultProps = {
    isActiveStyle: true
};

export default ButtonStyled;

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontFamily: 'MTSCompact-Bold',
        color: Colors.white,
        textAlign: 'center',
    },
});