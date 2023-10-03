import React, { useState } from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';
import Modal from "react-native-modal";

import { createOrderModalStyle as style } from './create-order.modal.style';
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {Colors} from "deelzat/style";
import CloseIcon from "assets/icons/Close.svg";
import {LayoutStyle} from "deelzat/style/layout";
import I19n from "dz-I19n";
import OrderFailedIcon from "assets/icons/OrderFailed.svg";
import OrderCreateInput from "modules/order/inputs/order-create.input";
import OrderApi from "modules/order/apis/order.api";
import {trackCheckoutComplete} from "modules/analytics/others/analytics.utils";
import * as Sentry from "@sentry/react-native";
import { useDispatch, useSelector } from 'react-redux';
import LottieView from "lottie-react-native";
import {shareApiError} from "modules/main/others/main-utils";
import {DzText, Touchable} from "deelzat/v2-ui";
import {cartThunks} from "modules/cart/stores/cart/cart.store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import DeepLinkingService from "modules/root/others/deeplinking.service";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import { checkoutSelectors } from 'v2modules/checkout/stores/checkout/checkout.store';
import store from 'modules/root/components/store-provider/store-provider';

const SubmissionStateConst = {};
SubmissionStateConst.SUBMITTING = 'SUBMITTING';
SubmissionStateConst.SUCCESS = 'SUCCESS';
SubmissionStateConst.ERROR = 'ERROR';
Object.freeze(SubmissionStateConst);

let SuccessTruck;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const AINM_HEIGHT = SCREEN_HEIGHT * 0.5;
function CreateOrderModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const insets = useSafeAreaInsets();

        const sessionInfo = useSelector(checkoutSelectors.sessionDataSelector);
        const trackSource = useSelector(checkoutSelectors.trackSourceSelector);
        const [isVisible, isVisibleSet] = useState(false);
        const [order, orderSet] = useState({});
        const [requestState, requestStateSet] = useState(SubmissionStateConst.SUBMITTING);
        const [errorMessage, errorMessageSet] = useState('');
        const [showOptions, showOptionsSet] = useState();


        const dispatch = useDispatch();

        this.show = (show = true, showOptions = {}) => {
            isVisibleSet(show);
            showOptionsSet(showOptions);
            submitOrder(showOptions);
        };

        const onHide = () => {
            if (requestState !== SubmissionStateConst.SUBMITTING) {
                isVisibleSet(false);
                requestStateSet(SubmissionStateConst.SUBMITTING);
            }
        };


        const submitOrder = (orderOptions) => {
            (async () => {
                try {

                    const paymentIntent = await orderOptions.submitPayment;

                    const inputs = new OrderCreateInput();
                    inputs.checkoutId = sessionInfo.id;
                    inputs.totalPrice = sessionInfo.total_price;
                    inputs.paymentIntent = paymentIntent;
                    inputs.paymentMethod = orderOptions.paymentMethod;

                    let result = await OrderApi.createOrder(inputs);
                    orderSet(result);
                    requestStateSet(SubmissionStateConst.SUCCESS);

                    try {
                        const checkoutState = store?.getState()?.checkout || {};
                        const trackedInputs = {
                            buyerInfo: checkoutState.buyerInfo,
                            shippingInfo: checkoutState.shippingInfo,
                            checkoutItems: checkoutState.checkoutItems,
                            addonsList: checkoutState.addonsList,
                            paymentMethod: orderOptions.paymentMethod
                        };

                        trackCheckoutComplete(trackedInputs, result.id, trackSource)
                    } catch (w) {
                        console.log(w);
                        Sentry.captureMessage("[Analytics] create order, " + JSON.stringify(inputs.payload()))
                        Sentry.captureException(w);
                    }

                    const clearCartOnSuccess = store?.getState()?.checkout?.clearCartOnSuccess;

                    if (clearCartOnSuccess) {
                        dispatch(cartThunks.deleteCurrentCart());
                     }
                } catch (e) {

                    shareApiError(e, "checkout error");

                    console.warn("create order error:", JSON.stringify(e));
                    try {Sentry.captureException(e)} catch (x){}
                    try {Sentry.captureMessage("[api-error] create order error: " + JSON.stringify(e) )} catch (y){}

                    requestStateSet(SubmissionStateConst.ERROR);


                    // default error from this side of stripe will be:
                    // {"nativeStackAndroid":[],"userInfo":null,"message":"Your card number is incorrect.","code":"api","line":13009,"column":45,"sourceURL":"http://192.168.0.102:8081/index.bundle?platform=android&dev=true&minify=false"}
                    let _errorMessage = I19n.t('نرجو المحاولة مجدداً والتأكد من تعبأة الطلب كامل بشكل صحيح')
                    if (e?.localizedMessage) {
                        _errorMessage = I19n.t('يرجى التأكد من رقم البطاقة الإئتمانية') + "\n" + e?.localizedMessage;
                    }
                    errorMessageSet(_errorMessage);

                    try {
                        const checkoutState = store?.getState()?.checkout || {};

                        const trackedInputs = {
                            buyerInfo: checkoutState.buyerInfo,
                            shippingInfo: checkoutState.shippingInfo,
                            checkoutItems: checkoutState.checkoutItems,
                            addonsList: checkoutState.addonsList,
                            paymentMethod: orderOptions.paymentMethod,
                        };

                        const detailedMsg = e?.localizedMessage ? e?.localizedMessage
                            : e?.data?.full_messages?.length > 0 ? e?.data?.full_messages[0] : '';

                        trackCheckoutComplete(trackedInputs, '', trackSource, detailedMsg);

                    } catch (w) {
                        console.log(w);
                        Sentry.captureMessage('[Analytics] create order, ' + JSON.stringify(inputs.payload()));
                        Sentry.captureException(w);
                    }
                }
            })();
        }


        const onPressCloseBtn = () => {
            if (requestState === SubmissionStateConst.SUCCESS) {
                RootNavigation.popToTop();
            }
            else {
                onHide();
            }
        }


        const onPressRetry = () => {
            requestStateSet(SubmissionStateConst.SUBMITTING);
            submitOrder(showOptions);
        }


        if (!isVisible) {
            return <></>
        }


        const onPressTrackOrder = () => {
            onPressCloseBtn();
            setTimeout(() => {
                DeepLinkingService.navigateToLink({type: 'orders', id: order.id});
            }, 500);

        }

        const getSuccessMsgSpan = () => {
            const phone = I19n.t('SEND_THROUGH_SMS');
            const successMsg = I19n.t('سيتم إرسال رسالة نصية بتأكيد الطلبية');

            const span = successMsg.split(phone)[0];
            const span1 = phone;
            const span2 = successMsg.split(phone)[1].replace(span + span1, '');

            return [span, span1, span2];
        }


        const successMsgSpan = getSuccessMsgSpan();

        if (!SuccessTruck) {
            SuccessTruck = require('assets/anim/truck');
        }


        return (
            <Modal
                onBackButtonPress={onPressCloseBtn}
                onBackdropPress={onPressCloseBtn}
                useNativeDriver={true}
                animationInTiming={1}
                animationOutTiming={1}
                isVisible={isVisible}
                style={style.container}>
                <View style={style.content}>
                    <Space directions={'h'} size={'md'}/>
                    <Space directions={'h'} size={'lg'}/>
                    <View style={[LayoutStyle.Flex, LayoutStyle.JustifyContentCenter, LayoutStyle.AlignItemsCenter]}>
                        {
                            (requestState === SubmissionStateConst.SUBMITTING) &&
                            <ActivityIndicator style={style.loadingView} size="small" color={Colors.MAIN_COLOR}/>
                        }
                        {
                            (requestState === SubmissionStateConst.SUCCESS) &&
                            <View style={[LayoutStyle.AlignItemsCenter, {marginTop: "-50%", zIndex: -10}]}>
                                <LottieView source={SuccessTruck}
                                            autoPlay={true}
                                            speed={0.5}
                                            style={{width: SCREEN_WIDTH,  height: AINM_HEIGHT}}
                                            loop={false} />
                                <View style={{height: 44}}/>
                                <DzText style={style.bigTitle}>
                                    {I19n.t('تم تأكيد الطلبية')}
                                </DzText>
                                <Space directions={'h'} />
                                <Space directions={'h'} size={'md'}/>
                                <DzText style={style.successMsg}>
                                    <DzText style={style.orderNumGrey}>
                                        {I19n.t('رقم الطلبية')}
                                    </DzText>
                                    <DzText style={style.orderNumBlack}>
                                        {' : ' + order?.id}
                                    </DzText>
                                </DzText>
                                <Space directions={'h'} size={'md'}/>
                                <DzText style={style.message}>
                                    <DzText>
                                        {successMsgSpan[0]}
                                    </DzText>
                                    <DzText style={style.messageDark}>
                                        {successMsgSpan[1]}
                                    </DzText>
                                    <DzText>
                                        {successMsgSpan[2]}
                                    </DzText>
                                </DzText>
                                <View style={{height: 26}}/>
                                <Touchable onPress={onPressTrackOrder}>
                                    <DzText style={style.textLink}>
                                        {I19n.t('تتبع الطلبية')}
                                    </DzText>
                                </Touchable>
                            </View>
                        }
                        {
                            (requestState === SubmissionStateConst.ERROR) &&
                            <View style={LayoutStyle.AlignItemsCenter}>
                                <OrderFailedIcon width={94} height={168}/>
                                <View style={{height: 44}}/>
                                <DzText style={style.bigTitle}>
                                    {I19n.t('الطلبية لم تتم بنجاح')}
                                </DzText>
                                <Space directions={'h'} />
                                <Space directions={'h'} size={'md'}/>
                                <DzText style={style.message}>
                                    {I19n.t(errorMessage)}
                                </DzText>
                            </View>
                        }
                    </View>
                    {
                        (requestState === SubmissionStateConst.SUCCESS) &&
                        <Button
                            type={ButtonOptions.Type.PRIMARY}
                            btnStyle={style.actionBtn}
                            text={I19n.t('العودة للرئيسية')}
                            onPress={RootNavigation.popToTop}/>
                    }
                    {
                        (requestState === SubmissionStateConst.ERROR) &&
                        <Button
                            type={ButtonOptions.Type.PRIMARY_OUTLINE}
                            btnStyle={style.actionBtn}
                            text={I19n.t('حاول مرة أخرى')}
                            onPress={onPressRetry}/>
                    }
                    <Space directions={'h'} size={'lg'} />
                    <Space directions={'h'} size={'md'} />
                    {
                        (requestState !== SubmissionStateConst.SUBMITTING) &&
                        <View style={[style.closeBtnContainer, {top: insets.top + 30}]}>
                            <View style={{flex: 1}}/>
                            <Touchable onPress={onPressCloseBtn}
                                       style={style.closeBtn}
                                       hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}>
                                <CloseIcon
                                    fill={Colors.N_BLACK}
                                    width={16}
                                    height={16}/>
                            </Touchable>
                        </View>
                    }
                </View>
            </Modal>
        );
    };
};


const useCreateOrderModal = () => {
    return new CreateOrderModal();
};
export default useCreateOrderModal;
