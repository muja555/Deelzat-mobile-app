import { TouchableOpacity } from 'react-native';
import React from 'react';

import Button, {ButtonOptions} from "./../ui/button";

const IconButtonSizeMap = {
    [ButtonOptions.Size.LG]: 43,
    [ButtonOptions.Size.MD]: 32,
    [ButtonOptions.Size.SM]: 25,
};

const IconButton = (props) => {

    const {
        children = <></>,
        size = ButtonOptions.Size.LG,
        loading = false,
        btnStyle = {},
        ...rest
    } = props;

    return (
        <Button
            activeOpacity={0.7}
            {...rest}
            btnStyle={[{
                width: IconButtonSizeMap[size],
                height: IconButtonSizeMap[size],
                paddingHorizontal: 0,
                borderRadius: (IconButtonSizeMap[size] / 5),
                borderWidth: 0.5},
                btnStyle
            ]}
            hideLabel={true}
            loading={loading}
            size={size}
            icon={loading ? <></> : children}
        />
    );
};

export default IconButton;
