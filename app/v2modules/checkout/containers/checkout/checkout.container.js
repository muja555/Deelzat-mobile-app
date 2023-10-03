import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, BackHandler } from 'react-native';

import { checkoutContainerStyle as style } from './checkout.container.style';
import CheckoutStepsConst from 'v2modules/checkout/constants/checkout-steps.const';
import WillShowToast from 'deelzat/toast/will-show-toast';
import { Space } from 'deelzat/ui';
import PageHeader from 'v2modules/shared/components/page-header/page-header.component';
import I19n from 'dz-I19n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CheckoutSteps from 'v2modules/checkout/components/checkout-steps/checkout-steps.component';
import PagerView from '@deelzat/react-native-pager-view';
import { LayoutStyle, Spacing } from 'deelzat/style';
import BagContainer from 'v2modules/page/containers/bag/bag.container';
import CheckoutPaymentStepContainer
    from 'v2modules/checkout/containers/checkout-payment-step/checkout-payment-step.container';
import CheckoutInfoStepContainer from 'v2modules/checkout/containers/checkout-info-step/checkout-info-step.container';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import store from 'modules/root/components/store-provider/store-provider';

const CheckoutContainer = (props) => {
    const {
        initialStep = CheckoutStepsConst.BAG,
    } = props.route?.params || {};

    const insets = useSafeAreaInsets();
    const tabsPagerRef = useRef();

    const [currentStep, currentStepSet] = useState(initialStep);

    const onNextBag = useCallback(() => {
        currentStepSet(CheckoutStepsConst.INFO);
        tabsPagerRef?.current?.setPage(CheckoutStepsConst.INFO);
    }, []);

    const onNextInfo = useCallback(() => {
        currentStepSet(CheckoutStepsConst.PAYMENT)
        tabsPagerRef?.current?.setPage(CheckoutStepsConst.PAYMENT);
    }, []);

    useEffect(() => {

        const hardwareBackPressHandler = () => {
            const clearCartOnSuccess = store?.getState()?.checkout?.clearCartOnSuccess;
            if (currentStep === CheckoutStepsConst.BAG
                || (currentStep === CheckoutStepsConst.INFO && !clearCartOnSuccess)
            ) {
                return false;
            }
            else {
                currentStepSet(currentStep - 1);
                tabsPagerRef?.current?.setPage(currentStep - 1);
            }
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', hardwareBackPressHandler);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', hardwareBackPressHandler);
        }
    }, [currentStep]);

    const onPressHeaderBack = () => {
        const clearCartOnSuccess = store?.getState()?.checkout?.clearCartOnSuccess;
        if (currentStep === CheckoutStepsConst.BAG
            || (currentStep === CheckoutStepsConst.INFO && !clearCartOnSuccess)
        ) {
            RootNavigation.goBack();
        } else {
            currentStepSet(currentStep - 1);
            tabsPagerRef?.current?.setPage(currentStep - 1);
        }
    };


    return (
        <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <WillShowToast id={'checkout-info'} />
            <View style={Spacing.HorizontalPadding}>
                <Space directions={'h'} size={'md'} />
                <PageHeader title={I19n.t('حقيبة المشتريات')} onPressBack={onPressHeaderBack} />
                <Space directions={'h'} size={'lg'} />
                <CheckoutSteps step={currentStep} />
            </View>
            <PagerView
                style={style.navigator}
                scrollEnabled={false}
                ref={tabsPagerRef}
                collapsable={false}
                initialPage={currentStep}>
                <View style={LayoutStyle.Flex} key={CheckoutStepsConst.BAG}>
                    <BagContainer onNext={onNextBag}
                                  isFocused={currentStep === CheckoutStepsConst.BAG}/>
                </View>
                <View style={LayoutStyle.Flex} key={CheckoutStepsConst.INFO}>
                    <CheckoutInfoStepContainer isFocused={currentStep === CheckoutStepsConst.INFO}
                                               onNext={onNextInfo}/>
                </View>
                <View style={LayoutStyle.Flex} key={CheckoutStepsConst.PAYMENT}>
                    <CheckoutPaymentStepContainer
                        isFocused={currentStep === CheckoutStepsConst.PAYMENT}/>
                </View>
            </PagerView>
        </View>
    );
};

export default CheckoutContainer;
