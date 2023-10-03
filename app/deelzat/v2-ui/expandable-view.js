import React, {useEffect, useRef, useState} from 'react'
import {View, Animated, Image, StyleSheet} from "react-native";
import Colors from "../style/colors";
import {DzText, Touchable} from "./index";
import I19n from "dz-I19n";
import {Space} from "../ui";
import Gradient from "assets/icons/GradientWhite.png";
import {LayoutStyle} from "../style";


const ExpandableView = (props) => {

    const {
        collapseHeight = 0,
        isExpanded = false,
        onExpandCollapse = (isExpanded) => {},
        children = <></>,
    } = props;

    const isAnimating = useRef(false);
    const contentAnim = useRef(new Animated.Value(collapseHeight)).current;
    const [maxHeight, maxHeightSet] = useState(0);
    const [enableAnimation, enableAnimationSet] = useState(false);


    useEffect(() => {
        if (enableAnimation) {
            isAnimating.current = true;
            Animated.timing(
                contentAnim,
                {
                    toValue: isExpanded? maxHeight : collapseHeight,
                    duration: 400,
                    useNativeDriver: false
                }
            ).start(() => {
                isAnimating.current = false;
            })
        } else {

        }
    }, [isExpanded]);


    const onLayout =  ({nativeEvent: {layout: {height}}}) => {

        if (!enableAnimation && height > maxHeight) {
            maxHeightSet(height);
            enableAnimationSet(true);
        }
    }


    const onPressExpandButton = () => {
        if (!isAnimating.current) {
            onExpandCollapse(!isExpanded)
        }
    }


    return (
        <View style={[LayoutStyle.AlignItemsCenter, !enableAnimation && {height: collapseHeight, overflow: 'hidden'}]}>
            <Animated.View
                style={[
                    {overflow: 'hidden', width: '100%'},
                    enableAnimation && {height: contentAnim},
                ]} onLayout={onLayout}>
                {children}
                {
                    (!isExpanded) &&
                    <Image source={Gradient} resizeMethod={'scale'} style={style.gradient}/>
                }
            </Animated.View>
            <Touchable onPress={onPressExpandButton}>
                <DzText style={[style.showMore, isExpanded && {marginTop: 0}]}>
                    {!isExpanded? I19n.t('أظهر المزيد'): I19n.t('أظهر أقل')}
                </DzText>
            </Touchable>
        </View>
    )
}

export default ExpandableView;


const _style = {
    gradient: {
        position: 'absolute',
        width: '100%',
        height: 50,
        bottom: 0
    },
    showMore: {
        color: Colors.LINK,
        marginTop: -10,
    }

};
const style = StyleSheet.create(_style);
