import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

import I19n from 'dz-I19n';
import { checkoutStepsStyle as style } from './checkout-steps.component.style';
import { DzText } from 'deelzat/v2-ui';
import { LayoutStyle } from 'deelzat/style';
import CheckoutStepsConst from 'v2modules/checkout/constants/checkout-steps.const';
import { Space } from 'deelzat/ui';

const STEP_CIRCLE_WIDTH = 24;
const CheckoutSteps = (props) => {

    const {
        step = CheckoutStepsConst.BAG,
    } = props;

    const [lineWidth, lineWidthSet] = useState(0);

    const previousStep = useRef(step);
    const lineAnimation = useRef(new Animated.Value(step)).current;
    const circleAnim = useRef(new Animated.Value(0)).current;

    const [markedCircleStep, markedCircleStepSet] = useState(false);

    useEffect(() => {

        const shouldDelayCircleUpdate = step - previousStep.current > 0;
        if (!shouldDelayCircleUpdate) {
            markedCircleStepSet(step);
        }

        Animated.timing(lineAnimation, {
            toValue: step,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start(() => {


            const isMovingFromStep_0_1 = step === 1 && previousStep.current === 0;
            const isMovingFromStep_1_2 = step === 2 && previousStep.current === 1;

            if (isMovingFromStep_0_1 || isMovingFromStep_1_2) {
                Animated.timing(circleAnim, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true
                }).start(() => {
                    circleAnim.setValue(0);
                });
            }

            if (shouldDelayCircleUpdate) {
                markedCircleStepSet(step);
            }

            previousStep.current = step;
        });
    }, [step]);


    const line1WidthAnim = lineAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, lineWidth, lineWidth],
    });

    const line2WidthAnim = lineAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, lineWidth],
    });

    const circleOpacityAnim = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0],
    });

    const circleScaleAnim = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
    });


    const onLayout = ({ nativeEvent: { layout: { width } } }) => {
        const _lineWidth = (width - (STEP_CIRCLE_WIDTH * 2)) / 2;
        lineWidthSet(_lineWidth);
    };

    return (
        <View style={style.container}>
            <View style={[style.row, { width: '89%' }]} onLayout={onLayout}>
                <View style={[style.stepCircle, style.circleChecked]} />
                <View style={[style.lineView, { width: lineWidth }]}>
                    <View style={style.line} />
                    <Animated.View style={[style.lineMarked, { width: line1WidthAnim }]} />
                </View>
                <View>
                    <View style={[style.stepCircle, markedCircleStep >= CheckoutStepsConst.INFO && style.circleChecked]} />
                    {
                        (markedCircleStep === CheckoutStepsConst.INFO) &&
                        <Animated.View style={[style.stepCircle, style.circleCheckedAnim, {opacity: circleOpacityAnim, transform: [{scaleX: circleScaleAnim}, {scaleY: circleScaleAnim}]}]} />
                    }
                </View>
                <View style={[style.lineView, { width: lineWidth }]}>
                    <View style={style.line} />
                    <Animated.View style={[style.lineMarked, { width: line2WidthAnim }]} />
                </View>
                <View>
                    <View style={[style.stepCircle, markedCircleStep === CheckoutStepsConst.PAYMENT && style.circleChecked]} />
                    {
                        (markedCircleStep === CheckoutStepsConst.PAYMENT) &&
                        <Animated.View style={[style.stepCircle, style.circleCheckedAnim, {opacity: circleOpacityAnim, transform: [{scaleX: circleScaleAnim}, {scaleY: circleScaleAnim}]}]} />
                    }
                </View>
            </View>
            <Space directions={'h'} sizes={'sm'} />
            <View style={style.row}>
                <DzText style={style.stepTitle}>
                    {I19n.t('حقيبة المشتريات')}
                </DzText>
                <View style={LayoutStyle.Flex} />
                <DzText style={style.stepTitle}>
                    {I19n.t('التفاصيل')}
                </DzText>
                <View style={LayoutStyle.Flex} />
                <DzText style={style.stepTitle}>
                    {I19n.t('تفاصيل الدفع')}
                </DzText>
            </View>
        </View>
    );
};

export default CheckoutSteps;
