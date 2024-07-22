import { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';


function ProgressBar({
    duration = 100,
    row,
    borderRadius,
    progress,
    barColor,
    borderColor,
    fillColor,
    borderWidth,
    height,
    maxRange
}) {
    const animation = useRef(new Animated.Value(progress)).current;
    useEffect(() => {
        Animated.timing(animation, {
            toValue: progress,
            duration: duration,
            useNativeDriver: false // Add this line if you face issues with `useNativeDriver`
        }).start();
    }, [progress]);

    const widthInterpolated = animation.interpolate({
        inputRange: [0, maxRange],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp'
    });

    return (
        <View style={[{ flexDirection: 'row', height }, row ? { flex: 1 } : undefined]}>
            <View style={{ flex: 1, borderColor, borderWidth, borderRadius }}>
                <View
                    style={[StyleSheet.absoluteFill, { backgroundColor: fillColor, borderRadius }]}
                />
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: widthInterpolated,
                        backgroundColor: barColor,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8
                    }}
                />
            </View>
        </View>
    );
}

export default ProgressBar;