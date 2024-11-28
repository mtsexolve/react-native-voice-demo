import {View} from 'react-native';
import React from "react";

interface QualitySemaphoreProps {
    qualityRating: number,
}          

function QualitySemaphore({qualityRating}: QualitySemaphoreProps) {
    const semaphoreColor = ( rating : number ) => {
        if( rating > 4.2 ){
            return "green";
        } else if ( rating > 2.5 ) {
            return "yellow";
        } else if ( rating > 0.0 ) {
            return "red";
        } else {
            return "maroon";
        }
    }
    
    return (
        <View style={{
            width: 10,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 10 / 2,
                            backgroundColor: semaphoreColor(qualityRating),
                        }} />
        </View>
    );
}

export default QualitySemaphore;