import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import { panelStyle as style } from './panel.style';
import { Colors } from 'deelzat/style';
import PanelHandle from 'assets/icons/PanelHandle.svg';
import { Touchable } from './index';
import { isRTL } from 'dz-I19n';
import DzText from './dz-text';

const Panel = (props) => {

    const {
        header = <></>,
        children = null,
        headerCount = 0,
        isExpanded = false,
        onExpandCollapse = (isExpanded) => {
        },
        CustomHandle,
        sideWayHandle = false,
        initialHeight = 0,
    } = props;

    const isAnimating = useRef(false);
    const [contentMaxHeight, contentMaxHeightSet] = useState(0);
    const [contentMinHeight, contentMinHeightSet] = useState(0);

    // Render a hidden view with children to get max content height
    const [renderShadowChildren, renderShadowChildrenSet] = useState(true);

    // prevent animation on first render, if isExpanded is true by default
    const [disableAnimation, disableAnimationSet] = useState(isExpanded);

    const contentAnim = useRef(new Animated.Value(0)).current;


    const onPressExpandButton = () => {
        if (!isAnimating.current) {
            onExpandCollapse(!isExpanded);
        }
    };


    useEffect(() => {
        if (!disableAnimation) {
            isAnimating.current = true;
            Animated.timing(
                contentAnim,
                {
                    toValue: isExpanded ? contentMinHeight + contentMaxHeight : contentMinHeight,
                    duration: 200,
                    useNativeDriver: false,
                },
            ).start(() => {
                isAnimating.current = false;
            });
        } else {

        }
    }, [isExpanded]);


    useEffect(() => {
        if (disableAnimation && contentMinHeight > 0 && contentMaxHeight > 0) {
            contentAnim.setValue(contentMinHeight + contentMaxHeight);
            disableAnimationSet(false);
        }
    }, [contentMaxHeight, contentMinHeight]);


    const onLayoutHeader = (e) => {
        const height = e.nativeEvent.layout.height;
        if (contentMinHeight === 0) {
            contentAnim.setValue(height);
            contentMinHeightSet(height);
        }
    };


    const onLayoutChildren = (e) => {
        const height = e.nativeEvent.layout.height;
        if (isExpanded && !isAnimating.current) {
            contentAnim.setValue(contentMinHeight + height);
        }
        if (height > contentMaxHeight) {
            contentMaxHeightSet(height);
        } else {
            renderShadowChildrenSet(false);
        }
    };

    return (
        <>
            <Animated.View
                style={[
                    { overflow: 'hidden' },
                    (!disableAnimation && contentMinHeight !== 0) ? { height: contentAnim } : (initialHeight && { height: initialHeight }),
                ]}>
                <View style={style.header} onLayout={onLayoutHeader}>
                    {header}
                    {
                        (!!children || sideWayHandle) &&
                        <Touchable
                            activeOpacity={1}
                            onPress={onPressExpandButton}
                            hitSlop={{top: 20, bottom: 20, left: 1000, right: 100}}
                            style={style.headerButton}>
                            {
                                (headerCount > 0) &&
                                <View style={style.selectedValuesView}>
                                    <DzText style={style.selectedValuesCount}>
                                        {headerCount}
                                    </DzText>
                                </View>
                            }
                            {
                                <View
                                    style={[
                                        style.openIcon,
                                        { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] },
                                        sideWayHandle && { transform: [{ rotate: isRTL() ? '90deg' : '270deg' }] },
                                    ]}>
                                    {
                                        (!!CustomHandle) ?
                                            <CustomHandle /> :
                                            <PanelHandle stroke={Colors.GREY} strokeWidth={1.5} width={16}
                                                         height={16} />
                                    }
                                </View>
                            }
                        </Touchable>
                    }
                </View>
                {
                    (!!children) &&
                    <View>
                        {children}
                    </View>
                }
            </Animated.View>
            {
                (renderShadowChildren) &&
                <View pointerEvents="none" style={{ position: 'absolute', opacity: 0 }} onLayout={onLayoutChildren}>
                    {children}
                </View>
            }
        </>
    );
};

export default Panel;
