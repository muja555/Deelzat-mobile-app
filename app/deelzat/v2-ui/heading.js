import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { style } from "./heading.style";
import Touchable from "./touchable";
import DzText from "./dz-text";

const HeadingTypes = {
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
};
export { HeadingTypes as HeadingTypes};


const Heading = (props) => {

    const {
        children = <></>,
        link = null,
        linkText = null,
        onLinKPress = () => {},
        type = HeadingTypes.H1
    } = props;

    return (
        <View style={style.container}>
            <DzText style={[style.text, style['text_' + type]]}>{children}</DzText>
            {
                (!!linkText) &&
                <Touchable onPress={onLinKPress}>
                    <DzText style={style.linkText}>{linkText}</DzText>
                </Touchable>
            }
            {
                (!!link) &&
                <Touchable onPress={onLinKPress}>
                    {link}
                </Touchable>
            }

        </View>
    );
};

Heading.Types = {
  H1: 'H1'
};

export default Heading;
