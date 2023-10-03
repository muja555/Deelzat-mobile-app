import React, {useEffect, useRef} from 'react';
import DropdownAlert from "react-native-dropdownalert";
import {Colors, Font, LocalizedLayout} from "../style";
import {addToastRef, getHaysToastRef, removeToastRef} from './index';

const WillShowToast = (props) => {

    const {
        id,
        ...rest
    } = props;

    const alertRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            addToastRef({
                id: id,
                ref: alertRef
            });
        }, 0);

        return () => {
            removeToastRef(id);
        }
    }, []);

    const thisRef = getHaysToastRef(id);
    const onTap = () => {
        if (thisRef?.onTap) {
            thisRef.onTap();
        }
    }

    const textLocaleStyle = LocalizedLayout.TextAlignRe();

    return (
        <DropdownAlert
            zIndex={1000000}
            updateStatusBar={true}
            closeInterval={1000}
            successColor={Colors.MAIN_COLOR}
            errorColor={Colors.ORANGE_PINK}
            warnColor={Colors.LIGHT_ORANGE}
            messageNumOfLines={3}
            messageStyle={{
                fontSize: 14,
                color: 'white',
                ...Font.Bold,
                ...textLocaleStyle,
            }}
            imageStyle={{borderRadius: 20, marginStart: 10, marginEnd: 10, alignSelf: 'center'}}
            onTap={onTap}
            ref={alertRef}
            {...rest}
        />
    );
};

export default WillShowToast;
