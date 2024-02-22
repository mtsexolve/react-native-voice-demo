import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Colors} from '../styles';
import React from "react";

interface CallOptionsButtonProps {
    children: React.ReactNode,
    onPress: () => void,
    isEnabled?: boolean
}

function CallOptionsButton({children, onPress, isEnabled}: CallOptionsButtonProps) {
    return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [{ backgroundColor: isEnabled ? Colors.mts_bg_grey_darker : Colors.mts_bg_grey }, styles.button ]}
            >
                        {children}
            </Pressable>
    );
}
export default CallOptionsButton;

const styles = StyleSheet.create({
    button: {
        width: 74,
        height: 74,
        borderRadius: 37,
        justifyContent: 'center',
        alignItems: 'center',
    },
});