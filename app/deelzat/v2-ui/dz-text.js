import React from 'react';
import {Animated} from 'react-native';
import {StyleSheet, Text} from 'react-native';
import {Font} from '../style';

const textStyles = StyleSheet.create({
  defaultText: {
    ...Font.Regular,
    fontSize: 13,
    // lineHeight: 18,
    // textAlign: 'left'
  },
});


const DzText = (props) => {
  return (
    <>
      {
        props.useAnimated &&
        <Animated.Text {...props} style={[textStyles.defaultText, props.style]} />
      }
      {
        !props.useAnimated &&
        <Text {...props} style={[textStyles.defaultText, props.style]}  allowFontScaling={false}  />
      }
    </>
  );
};

export default DzText;
