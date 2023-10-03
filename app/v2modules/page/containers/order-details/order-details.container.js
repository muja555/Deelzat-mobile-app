import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';

import { orderDetailsContainerStyle as style } from './order-details.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout, Spacing} from "deelzat/style";
import {DzText, IconButton, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import BackSvg from "assets/icons/BackIcon.svg";
import DoneOutlineSvg from 'assets/icons/DoneOutline2.svg';
import I19n, {getLocale, isRTL} from "dz-I19n";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import moment from "moment-timezone";
import 'moment/locale/ar';
import RejectedIcon from 'assets/icons/Rejected.svg';
import OrderApi from "modules/order/apis/order.api";
import OrderStatusConst from "modules/order/constants/order-status.const";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import {getVariantLabel} from "modules/cart/others/cart.utils";
import RowTitlePrice from "v2modules/shared/components/row-title-price/row-title-price.component";
import {refactorImageUrl} from "modules/main/others/main-utils";
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";
import {remoteConfig} from "modules/root/components/remote-configs/remote-configs.component";
import Toast from "deelzat/toast";
import * as Sentry from "@sentry/react-native";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';


const OrderDetailsContainer = (props) => {

    const {
        orderId = ''
    } = props.route.params;

    const FullColorsPalette = getFullColorsPalette();
    const insets = useSafeAreaInsets();

    const [order, orderSet] = useState();
    const [isLoading, isLoadingSet] = useState(true);
    const [shouldDisplayCancelBtn, shouldDisplayCancelBtnSet] = useState(false);
    const [enableCancelling] = useState(remoteConfig.getBoolean(RemoteConfigsConst.ENABLE_CANCEL_ORDERS));

    useEffect(() => {

        OrderApi.getOrder(orderId)
            .then((_order) => {
              orderSet(_order);
              isLoadingSet(false);
            })
            .catch(console.warn);

    }, []);


    useEffect(() => {
        shouldDisplayCancelBtnSet(
            order?.items?.filter(item => item.status === OrderStatusConst.PENDING)?.length === order?.items?.length
        );
    }, [order]);


    const onCancelPress = () => {
        isLoadingSet(true);
        OrderApi.cancelOrder(orderId)
            .then((_order) => {
                orderSet(_order);
                isLoadingSet(false);
            })
            .catch((e) => {
                isLoadingSet(false);
                Toast.danger(I19n.t('نعتذر، خطأ ما قد حصل. يرجى المحاولة مرة أخرى في وقت لاحق'));
                console.warn(e);
                Sentry.captureMessage("[CancelApi] error:", JSON.stringify(e))
                Sentry.captureException(e);
            });
    }

    const renderItem = useCallback(({item, index}) => {

        const formatDate = (date) => {
            if (!date) {
                return '';
            }

            moment.locale(getLocale());
            return moment(new Date(date)).format('ddd, DD MMM YYYY');
        }

        const displayCanceled = item.status === OrderStatusConst.REJECTED || item.status === OrderStatusConst.CANCELED;
        const displaySteps = (!shouldDisplayCancelBtn || item.status === OrderStatusConst.CONFIRMED) && !displayCanceled;

        const variantLabel = getVariantLabel({
            option1: item.extra_data?.option1,
            option2: item.extra_data?.option2
        });
        const variantColor = item.extra_data?.option1 &&
            FullColorsPalette.find(color => color.title?.trim() === item.extra_data.option1.trim())?.color;
        const shouldDisplayVariant = variantColor || item.extra_data?.option2;


        return (
            <View style={Spacing.HorizontalPadding}>
                <DzText style={[style.itemNumTxt, LocalizedLayout.TextAlign(isRTL())]}>
                    {I19n.t('رقم القطعة') + ': ' + item.id}
                </DzText>
                <Space directions={'h'} size={['sm', '']} />
                <View style={style.infoView}>
                    <ImageWithBlur key={index + ''}
                                   style={style.productImage}
                                   resizeMode="cover"
                                   resizeMethod="resize"
                                   thumbnailUrl={refactorImageUrl(item.product?.image, 1)}
                                   imageUrl={refactorImageUrl(item.product?.image, style.productImage.width)}/>
                    <Space directions={'v'} size={'md'} />
                    <View style={{flex: 1, justifyContent: 'flex-start'}}>
                        <DzText style={[style.itemName, LocalizedLayout.TextAlignRe()]}>
                            {item.extra_data?.product_title}
                        </DzText>
                        {
                            (variantLabel) &&
                            <DzText style={style.variantLabel}>
                                {variantLabel}
                            </DzText>
                        }
                        {
                            (shouldDisplayVariant) &&
                            <Space directions={'h'} size={'sm'}/>
                        }
                        {
                            (!shouldDisplayVariant) &&
                            <View style={LayoutStyle.Flex} />
                        }
                        <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                            <DzText style={style.itemPrice}>
                                {parseFloat(item.price) + ' ' + item.currency}
                            </DzText>
                            <Space directions={'v'} size={'lg'}/>
                            <DzText style={style.itemQuantity}>
                                {I19n.t('الكمية') + ': ' + item.quantity}
                            </DzText>
                        </View>
                        <Space directions={'h'}/>
                        {
                            (shouldDisplayVariant) &&
                            <View style={style.variantView}>
                                {
                                    (item.extra_data?.option2) &&
                                    <>
                                        <View style={style.sizeView}>
                                            <DzText style={style.sizeLabel}>
                                                {item.extra_data?.option2}
                                            </DzText>
                                        </View>
                                        <Space directions={'v'} size={['md', '']}/>
                                    </>
                                }
                                {
                                    (variantColor) &&
                                    <View style={[style.colorView, {backgroundColor: variantColor}]}/>
                                }
                            </View>
                        }
                    </View>
                </View>
                <View style={{height: 19}} />
                <View style={LayoutStyle.Row}>
                    {
                        (displayCanceled) &&
                        <View style={LayoutStyle.AlignItemsCenter}>
                            <RejectedIcon width={24} height={24}/>
                        </View>
                    }
                    {
                        (displaySteps) &&
                        <View style={LayoutStyle.AlignItemsCenter}>
                            {
                                (item.status === OrderStatusConst.ORDER_PICKED
                                    || item.status === OrderStatusConst.IN_HUB
                                    || item.status === OrderStatusConst.SHIPPED
                                    || item.status === OrderStatusConst.DELIVERED)?
                                    <DoneOutlineSvg width={24} height={24}/> :
                                    <View style={style.unfilledCircle}/>
                            }
                            <View style={style.tallVerticalLine} />
                            {
                                (item.status === OrderStatusConst.IN_HUB
                                    || item.status === OrderStatusConst.SHIPPED
                                    || item.status === OrderStatusConst.DELIVERED)?
                                    <DoneOutlineSvg width={24} height={24}/> :
                                    <View style={style.unfilledCircle}/>
                            }
                            <View style={style.tallVerticalLine} />
                            {
                                (item.status === OrderStatusConst.SHIPPED
                                    || item.status === OrderStatusConst.DELIVERED)?
                                    <DoneOutlineSvg width={24} height={24}/> :
                                    <View style={style.unfilledCircle}/>
                            }
                            <View style={style.tallVerticalLine} />
                            {
                                (item.status === OrderStatusConst.DELIVERED)?
                                    <DoneOutlineSvg width={24} height={24}/> :
                                    <View style={style.unfilledCircle}/>
                            }
                        </View>
                    }
                    <Space directions={'v'} size={['md', '']} />
                    {
                        (displayCanceled) &&
                        <View>
                            <DzText style={[style.statusStepTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {item.status === OrderStatusConst.CANCELED ? I19n.t('تم إلغاء الطلب')
                                    : I19n.t('تم رفض المنتج من البائع')}
                            </DzText>
                            <DzText style={[style.statusStepDateTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {formatDate(item.updatedAt)}
                            </DzText>
                        </View>
                    }
                    {
                        (displaySteps) &&
                        <View>
                            <DzText style={[style.statusStepTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {I19n.t('تم إستلام الطلب')}
                            </DzText>
                            <DzText style={[style.statusStepDateTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {item.status === OrderStatusConst.ORDER_PICKED? formatDate(item.updatedAt): ''}
                            </DzText>
                            <View style={{height: 43}}/>
                            <DzText style={[style.statusStepTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {I19n.t('في مركز ديلزات')}
                            </DzText>
                            <DzText style={[style.statusStepDateTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {item.status === OrderStatusConst.IN_HUB? formatDate(item.updatedAt): ''}
                            </DzText>
                            <View style={{height: isRTL()? 41: 37}}/>
                            <DzText style={[style.statusStepTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {I19n.t('الطلبية في الطريق')}
                            </DzText>
                            <DzText style={style.statusStepDateTxt}>
                                {item.status === OrderStatusConst.SHIPPED? formatDate(item.updatedAt): ''}
                            </DzText>
                            <View style={{height: isRTL()? 44: 40}}/>
                            <DzText style={[style.statusStepTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {I19n.t('تم التوصيل')}
                            </DzText>
                            <DzText style={[style.statusStepDateTxt, LocalizedLayout.TextAlign(isRTL())]}>
                                {item.status === OrderStatusConst.DELIVERED? formatDate(item.updatedAt): ''}
                            </DzText>
                        </View>
                    }
                </View>
            </View>
        )
    }, [shouldDisplayCancelBtn]);


    const ItemSeparatorComponent = useCallback(() => {
        if (!shouldDisplayCancelBtn) {
            return (
                <View style={style.separator} />
            )
        }

        return <></>
    }, [shouldDisplayCancelBtn]);


    const ListFooterComponent = useCallback(() => {

        if (!order) {
            return <></>
        }

        const itemsPrice = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const addonsTotal = order.addons.reduce((total, item) => total + item.cost_value, 0);

        moment.locale(getLocale());
        const formattedDate = moment(new Date(order.created_at)).format('DD MMM YYYY');

        return (
            <View style={{justifyContent: 'flex-start'}}>
                {
                    (shouldDisplayCancelBtn && enableCancelling) &&
                    <Touchable onPress={onCancelPress}
                               style={style.cancelBtn}>
                        <DzText style={style.cancelText}>
                            {I19n.t('إلغاء الطلب')}
                        </DzText>
                    </Touchable>
                }
                <Space directions={'h'} />
                <View style={style.separator} />
                <View style={Spacing.HorizontalPadding}>
                    <Space directions={'h'} size={'md'} />
                    <View style={{...LayoutStyle.Row, textAlign: 'left'}}>
                        <DzText style={style.detailTitle}>
                            {I19n.t('تم الطلب بتاريخ')}
                        </DzText>
                        <DzText style={style.detailTitle}>
                            {' '} {formattedDate}
                        </DzText>
                    </View>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={[style.detailTitle, LocalizedLayout.TextAlignRe()]}>
                        {I19n.t('العنوان')}
                    </DzText>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={[style.detailTextBold, LocalizedLayout.TextAlignRe()]}>
                        {(order?.delivery_details?.first_name + ' ' + order?.delivery_details?.last_name).trim()}
                    </DzText>
                    <Space directions={'h'} />
                    <DzText style={[style.detailText, LocalizedLayout.TextAlignRe()]}>
                        {order?.delivery_details?.street}
                    </DzText>
                    <Space directions={'h'} />
                    <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                        <DzText style={[style.detailTextBold, LocalizedLayout.TextAlignRe()]}>
                            {I19n.t('رقم الهاتف المحمول') + ':'}
                        </DzText>
                        <Space directions={'v'} />
                        <DzText style={[style.detailText, {marginTop: 5}]}>
                            {order?.delivery_details?.phone}
                        </DzText>
                    </View>
                    {
                        (!!order.special_request?.trim() && order.special_request !== 'لا يوجد') &&
                        <>
                            <Space directions={'h'} size={'md'} />
                            <View style={style.detailsSeparator} />
                            <Space directions={'h'} size={'md'} />
                            <DzText style={[style.detailTitle, LocalizedLayout.TextAlignRe()]}>
                                {I19n.t('طلبات خاصة')}
                            </DzText>
                            <Space directions={'h'} size={'md'} />
                            <DzText style={[style.specialRequests, LocalizedLayout.TextAlignRe()]}>
                                {order.special_request}
                            </DzText>
                        </>
                    }
                    <Space directions={'h'} size={'md'} />
                    <View style={style.detailsSeparator} />
                    <Space directions={'h'} size={'md'} />
                    <DzText style={[style.detailTitle, LocalizedLayout.TextAlignRe()]}>
                        {I19n.t('طريقة الدفع')}
                    </DzText>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={[style.detailTextBold, LocalizedLayout.TextAlignRe()]}>
                        {order?.payment_info?.cod? I19n.t('الدفع عند الاستلام'): I19n.t('الدفع ببطاقة إئتمانية')}
                    </DzText>
                    <Space directions={'h'} size={'md'} />
                    <View style={style.detailsSeparator} />
                    {
                        (order.coupon) &&
                        <>
                            <Space directions={'h'} size={'md'} />
                            <DzText style={[style.detailTitle, LocalizedLayout.TextAlignRe()]}>
                                {I19n.t('كود الخصم')}
                            </DzText>
                            <Space directions={'h'} size={'md'} />
                            <DzText style={[style.detailTextBold, LocalizedLayout.TextAlignRe()]}>
                                {order.coupon.code}
                            </DzText>
                            <Space directions={'h'} size={'md'} />
                            <View style={style.detailsSeparator} />
                        </>
                    }
                    <Space directions={'h'} size={'md'}/>
                    <RowTitlePrice title={I19n.t('المجموع الفرعي')}
                                   currencyCode={order?.currency}
                                   value={itemsPrice}/>
                    {
                        order.addons
                            .map((addon, index) => {
                                return (
                                    <RowTitlePrice key={addon.text + "_" + index}
                                                   title={addon[getLocale()]}
                                                   currencyCode={order.currency}
                                                   value={addon.cost_value}/>
                                )
                            })
                    }
                    <RowTitlePrice title={I19n.t('التوصيل')}
                                   currencyCode={order.currency}
                                   value={order.delivery_fees}/>
                    <View style={style.rowView}>
                        <DzText style={style.total}>
                            {I19n.t('المجموع')}
                        </DzText>
                        <DzText style={style.totalPrice}>
                            {parseFloat(
                                addonsTotal + itemsPrice + order.delivery_fees
                            ) + ' ' + order.currency}
                        </DzText>
                    </View>
                    {
                        (order?.discount > 0) &&
                        <View style={style.rowView}>
                            <DzText style={style.totalDiscount}>
                                {I19n.t('المجموع بعد الخصم')}
                            </DzText>
                            <DzText style={style.totalPriceDiscount}>
                                {parseFloat(order.total_price) + ' ' + order.currency}
                            </DzText>
                        </View>
                    }
                    <Space directions={'h'} size={'lg'} />
                </View>
            </View>
        )
    }, [order, isLoading, shouldDisplayCancelBtn, enableCancelling]);


    const keyExtractor = useCallback((item) => `${item.id}`, []);

    return (
        <View style={[style.container, {paddingTop: insets.top}]}>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter, Spacing.HorizontalPadding]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('تفاصيل الطلبية')}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
            <View style={{height: 15}}/>
            {
                (isLoading || !order?.items?.length) &&
                <View style={style.footerLoader}>
                    <ActivityIndicator size="small"
                                       style={style.bigLoader}
                                       color={Colors.MAIN_COLOR}/>
                </View>
            }
            {
                (!isLoading && order?.items?.length > 0) &&
                <FlatList data={order?.items || []}
                          renderItem={renderItem}
                          keyExtractor={keyExtractor}
                          contentContainerStyle={style.contentContainerStyle}
                          showsVerticalScrollIndicator={false}
                          ListFooterComponent={ListFooterComponent}
                          ItemSeparatorComponent={ItemSeparatorComponent}/>
            }
            <View style={{height: 26}} />
        </View>
    )
};

export default OrderDetailsContainer;
