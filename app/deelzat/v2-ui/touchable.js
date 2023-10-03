import { TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';

const Touchable = (props) => {

    const {
        children = <></>,
        onPress = () => {},
        ...rest
    } = props;

    const [isOnPressDisabled, isOnPressDisabledSet] = useState(false);

    useEffect(() => {

        let timeout;
        if (isOnPressDisabled) {
            timeout = setTimeout(() => {
                isOnPressDisabledSet(false);
            }, 500);
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [isOnPressDisabled]);

    const thisOnPress = () => {
        if (isOnPressDisabled) return;
        isOnPressDisabledSet(true);

        if (onPress) {
            onPress();
        }
    }

    return (
        <TouchableOpacity
            onPress={thisOnPress}
            activeOpacity={0.7}
            {...rest}>
            {children}
        </TouchableOpacity>
    );
};

export default Touchable;
