import React from 'react';
import {View} from 'react-native';

import {style} from './spaces.style';

const Space = ({size = 'default', directions = 'v'}) => {

    if (Array.isArray(size)) {
        return (
            <>
                {
                    size.map((size, index) => {
                        const type = directions + '_' + (!size? 'default': size);
                        return (
                            <View key={index} style={style[type]} />
                        )
                    })
                }
            </>
        )
    }

    const type = directions + '_' + size;

    return  <View style={style[type]} />
};

export default Space;
