import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator, ScrollView} from 'react-native';

import { salesTabPendingStyle as style } from './sales-tab-pending.component.style';
import I19n, {getLocale} from "dz-I19n";
import {Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import RejectIcon from "assets/icons/XCircle.svg";
import ConfirmIcon from "assets/icons/CheckCircle.svg";
import SalesListInput from "modules/order/inputs/sales-list.input";
import OrderApi from "modules/order/apis/order.api";
import OrderStatusConst from "modules/order/constants/order-status.const";
import useMidViewModal from "v2modules/shared/modals/mid-view/mid-view.modal";
import EmptyOrdersIcon from "assets/icons/EmptyOrders.svg";
import {getOrderPickupDayOptions, getOrderPickupTimeOptions} from "modules/order/others/order.utils";
import CloseIcon from "assets/icons/Close.svg";
import findIndex from "lodash/findIndex";
import OrderStatusUpdateInput from "modules/order/inputs/order-status-update.input";
import {trackConfirmShopOrder, trackRejectShopOrder} from "modules/analytics/others/analytics.utils";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import moment from "moment-timezone";
import {refactorImageUrl} from "modules/main/others/main-utils";
import * as Sentry from "@sentry/react-native";

const OrderAction = {};
OrderAction.CONFIRM = 'CONFIRMED';
OrderAction.REJECT = 'REJECTED';
Object.freeze(OrderAction);

const MidViewModal = useMidViewModal();
const orderPickupTimeOptions = getOrderPickupTimeOptions();
const SalesTabPending = (props) => {
    const {
        shop = {},
        currencyCode = '',
        onPressProduct = (productId, orderId) => {},
        onLongPressItem = (image) => {},
        onPressOutItem = () => {},
    } = props;

    const FullColorsPalette = getFullColorsPalette();

    const [ordersList, ordersListSet] = useState([]);
    const [ordersPagination, ordersPaginationSet]  = useState({});
    const [isLoading, isLoadingSet] = useState(true);
    const [selectedOrder, selectedOrderSet] = useState();
    const [selectedOrderAction, selectedOrderActionSet] = useState();

    const [pickUpDay, pickUpDaySet] = useState(null);
    const [pickUpDayVisible, pickUpDayVisibleSet] = useState(false);

    const [pickUpTime, pickUpTimeSet] = useState([...orderPickupTimeOptions]);
    const [pickUpTimeVisible, pickUpTimeVisibleSet] = useState(false);
    const [highlightPickUpTimeIsMissing, highlightPickUpTimeIsMissingSet] = useState(false);

    const [isUpdatingOrder, isUpdatingOrderSet] = useState(false);

    useEffect(() => {
        if (shop.id) {
            fetchOrders();
        }
        else {
            isLoadingSet(false);
        }
    }, [shop?.id]);


    const fetchOrders = (page = 1) => {
        (async () => {
            isLoadingSet(true);
            try {
                const inputs = new SalesListInput();
                inputs.shopId = shop.id;
                inputs.page = page;
                inputs.page_size = 15;
                const result = await OrderApi.listSales(inputs);
                const newItems = result.items.filter(item => item.status === OrderStatusConst.PENDING)
                let finalOrders;
                if (page === 1) {
                    finalOrders = [...newItems];
                } else {
                    finalOrders = [...ordersList, ...newItems];
                }
                ordersListSet(finalOrders);
                ordersPaginationSet(result.page_meta);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                isLoadingSet(false);
            }
        })();
    }


    const updateOrderInList = (order, payload) => {
        const orderIndex = findIndex(ordersList, (item) => order.id === item.id);
        const _orders = [...ordersList];
        _orders[orderIndex] = {
            ..._orders[orderIndex],
            ...payload
        };
        ordersListSet(_orders);
    };


    const renderItem = useCallback(({item}) => {

        const onRejectPress = () => {
            selectedOrderSet(item);
            selectedOrderActionSet(OrderAction.REJECT);
            MidViewModal.show(true);
        }

        const onConfirmPress = () => {
            selectedOrderSet(item);
            selectedOrderActionSet(OrderAction.CONFIRM);
            MidViewModal.show(true);
        }


        if (item.hidden) {
            return <View style={{marginBottom: -16}}/>
        }

        const variantColor = item.variant?.option1 &&
            FullColorsPalette.find(color => color.title?.trim() === item.variant.option1.trim())?.color;

        const onPress = () => {
            onPressProduct(item.product_id, item.id);
        }

        const onLongPress = () => {
            onLongPressItem(item.image);
        }

        const onPressOut = () => {
            onPressOutItem();
        }

        moment.locale(getLocale());
        const formattedDate = moment(new Date(item.created_at)).format('DD MMM YYYY');

        return (
            <View style={style.itemView}>
                {
                    (item.loading) &&
                        <View style={style.itemLoadingView}>
                            <ActivityIndicator size={14} color={''}/>
                        </View>
                }
                <Touchable style={style.itemInfoView}
                           onLongPress={onLongPress}
                           onPressOut={onPressOut}
                           onPress={onPress}>
                    <DzText style={{textAlign: 'left'}}>
                        <DzText style={style.orderNumGrey}>
                            {I19n.t('رقم الطلبية')}
                        </DzText>
                        <DzText style={style.orderNumBlack}>
                            {' : ' + item?.id}
                        </DzText>
                    </DzText>
                    <DzText style={[style.itemName, LocalizedLayout.TextAlignRe()]}>
                        {item.name}
                    </DzText>
                    <View style={LayoutStyle.Row}>
                        <DzText style={style.itemDate}>
                            {I19n.t('تم الطلب بتاريخ')}
                        </DzText>
                        <DzText style={style.itemDate}>
                            {' '}{formattedDate}
                        </DzText>
                    </View>
                    <Space directions={'h'} />
                    <View style={LayoutStyle.Row}>
                        <ImageWithBlur
                            style={style.itemImage}
                            resizeMode="cover"
                            resizeMethod="resize"
                            thumbnailUrl={refactorImageUrl(item.image, 1)}
                            imageUrl={refactorImageUrl(item.image, style.itemImage.width)}/>
                        <Space directions={'v'}/>
                        <View style={{flex: 1, justifyContent: 'flex-start',}}>
                            <DzText style={[style.itemName, LocalizedLayout.TextAlignRe()]}>
                                {item.name}
                            </DzText>
                            <Space directions={'h'} size={'md'}/>
                            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                                <DzText style={style.itemPrice}>
                                    {parseFloat(item.price) + ' ' + currencyCode}
                                </DzText>
                                <Space directions={'v'} size={'lg'}/>
                                <DzText style={style.itemQuantity}>
                                    {I19n.t('الكمية') + ': ' + item.quantity}
                                </DzText>
                            </View>
                            <Space directions={'h'}/>
                            {
                                (item.variant) &&
                                <View style={style.variantView}>
                                    {
                                        (item.variant.option2) &&
                                        <>
                                            <View style={style.sizeView}>
                                                <DzText style={style.sizeLabel}>
                                                    {item.variant.option2}
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
                </Touchable>
                <View style={{width: 20}}/>
                <Touchable onPress={onRejectPress} disabled={isUpdatingOrder} style={isUpdatingOrder && {opacity: 0.5}}>
                    <RejectIcon/>
                </Touchable>
                <Space directions={'v'} size={'md'} />
                <Space directions={'v'} size={'xd'} />
                <Touchable onPress={onConfirmPress} disabled={isUpdatingOrder} style={[{paddingEnd: 18}, isUpdatingOrder && {opacity: 0.5}]}>
                    <ConfirmIcon />
                </Touchable>
            </View>
        )
    }, [isUpdatingOrder, currencyCode]);

    const keyExtractor = useCallback((item) => `${item.id}`, []);

    const ListFooterComponent = useCallback(() => (
        <ActivityIndicator style={style.footerLoader}
                           size="small"
                           color={(isLoading && ordersList.length > 0)? Colors.MAIN_COLOR : 'transparent'} />
    ), [isLoading, ordersList]);

    const onEndReached = (d) => {
        if (!isLoading && ordersPagination.has_next_page) {
            fetchOrders(ordersPagination.current_page_number + 1);
        }
    };

    const Separator = useCallback(() => {
        return (
            <Space directions={'h'} size={'md'}/>
        )
    }, []);


    const onPressCloseCurrentStep = () => {
        if (pickUpTimeVisible) {
            pickUpDayVisibleSet(true);
            pickUpTimeVisibleSet(false);
        }
        else if (pickUpDayVisible) {
            pickUpDayVisibleSet(false);
            pickUpDaySet();
        }
        highlightPickUpTimeIsMissingSet(false);
    }


    const onPressMidConfirm = () => {
        MidViewModal.show(false);

        pickUpDaySet();
        pickUpTimeSet();
        highlightPickUpTimeIsMissingSet(false);

        pickUpDayVisibleSet(true);
    }

    const onPressMidReject = () => {
        MidViewModal.show(false);
        pickUpTimeSet();
        pickUpDaySet();
        highlightPickUpTimeIsMissingSet(false);

        updateOrderInList(selectedOrder, {
            loading: true,
        });
        updateOrder();
    }

    const onPressFinalConfirm = () => {

        if (!pickUpTime?.length) {
            highlightPickUpTimeIsMissingSet(true);
        }
        else {
            pickUpTimeVisibleSet(false);
            updateOrderInList(selectedOrder, {
                loading: true,
            });
            updateOrder();
        }
    }


    const updateOrder = () => {
        isUpdatingOrderSet(true);
        (async () => {
            let result = {};
            try {
                const inputs = new OrderStatusUpdateInput();
                inputs.shopId = shop.id;
                inputs.orderId = selectedOrder.id;
                inputs.status =  selectedOrderAction;
                inputs.pickUpDay = pickUpDay;
                inputs.pickUpTime = pickUpTime;
                result = await OrderApi.statusUpdate(inputs);
                if (selectedOrderAction === OrderAction.REJECT) {
                    trackRejectShopOrder(selectedOrder)
                } else if (selectedOrderAction === OrderAction.CONFIRM) {
                    trackConfirmShopOrder(selectedOrder, pickUpDay, pickUpTime)
                }
            }
            catch (e) {
                Sentry.captureMessage("[Sales-UpdateOrder] " + e?.data?.full_messages)
                Sentry.captureException(e);
                console.error(e);
            }

            updateOrderInList(selectedOrder, {
                loading: false,
                ...result
            });

            selectedOrderActionSet();
            selectedOrderSet();
            isUpdatingOrderSet(false);
        })();
    }


    return (
        <View style={style.container}>
            <MidViewModal.Modal>
                {
                    (selectedOrderAction === OrderAction.CONFIRM) &&
                    <Touchable onPress={onPressMidConfirm}
                               style={style.midBigConfirmBtn}>
                        <DzText style={style.midBigConfirmText}>
                            {I19n.t('تأكيد الطلبية')}
                        </DzText>
                    </Touchable>
                }
                {
                    (selectedOrderAction === OrderAction.REJECT) &&
                    <Touchable onPress={onPressMidReject}
                               style={style.midBigRejectBtn}>
                        <DzText style={style.midBigRejectText}>
                            {I19n.t('إلغاء الطلبية')}
                        </DzText>
                    </Touchable>
                }
            </MidViewModal.Modal>
            {
                (isLoading && ordersList.length === 0) &&
                <ActivityIndicator style={LayoutStyle.Flex} size="small" color={Colors.MAIN_COLOR}/>
            }
            {
                (!isLoading && ordersList.length === 0) &&
                    <View style={[LayoutStyle.AlignItemsCenter, LayoutStyle.JustifyContentCenter, LayoutStyle.Flex]}>
                        <View style={LayoutStyle.AlignItemsCenter}>
                            <DzText style={style.noOrderText}>
                                {I19n.t('ابقى على اطلاع هنا، ستتلقى طلباتك في هذه الصفحة')}
                            </DzText>
                            <View style={{height: 30}} />
                            <EmptyOrdersIcon />
                        </View>
                    </View>
            }
            {
                (ordersList.length > 0) &&
                <FlatList data={ordersList}
                          renderItem={renderItem}
                          bounces={false}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={style.contentContainerStyle}
                          ItemSeparatorComponent={Separator}
                          ListFooterComponent={ListFooterComponent}
                          onEndReached={onEndReached}
                          keyExtractor={keyExtractor}/>
            }
            {
                (pickUpDayVisible) &&
                <View style={style.pickUpValueContainer}>
                    <View style={{height: 40}}/>
                    <DzText style={style.readyToPickUp}>
                        {I19n.t('جاهز لتسليم الطلبية خلال')} {': '}
                    </DzText>
                    <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                               onPress={onPressCloseCurrentStep}
                               style={style.closeBtn}>
                        <CloseIcon
                            stroke={Colors.N_BLACK}
                            width={16}
                            height={16}/>
                    </Touchable>
                    <ScrollView showsVerticalScrollIndicator={false}
                                style={style.pickUpScrollView}>
                        <View style={{height: 40}}/>
                        {getOrderPickupDayOptions().map((dayOption) => {

                            const onPress = () => {
                                pickUpDaySet(dayOption);
                                pickUpDayVisibleSet(false);
                                pickUpTimeVisibleSet(true);
                            }

                            return (
                                <Touchable key={dayOption.key} onPress={onPress}>
                                    <DzText style={style.dayPickUp}>
                                        {dayOption.label}
                                    </DzText>
                                    <Space directions={'h'} />
                                    <Space directions={'h'} size={'xs'}/>
                                </Touchable>
                            )
                        })}
                        <View style={{height: 40}}/>
                    </ScrollView>
                </View>
            }
            {
                (pickUpTimeVisible) &&
                <View style={style.pickUpValueContainer}>
                    <View style={{height: 40}}/>
                    <DzText style={[style.readyToPickUp, highlightPickUpTimeIsMissing && {color: Colors.ERROR_COLOR_2}]}>
                        {I19n.t('وقت تسليم الطلبية')} {': '}
                    </DzText>
                    <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                               onPress={onPressCloseCurrentStep}
                               style={style.closeBtn}>
                        <CloseIcon
                            stroke={Colors.N_BLACK}
                            width={16}
                            height={16}/>
                    </Touchable>
                    <ScrollView showsVerticalScrollIndicator={false}
                                style={style.pickUpScrollView}>
                        <View style={{height: 40}}/>
                        {getOrderPickupTimeOptions().map(timeOption => {

                            const onPressOption = () => {
                                highlightPickUpTimeIsMissingSet(false);
                                pickUpTimeSet(selected => {
                                    let newSelected = [];
                                    if (selected) {
                                        const exist = selected.find((i) => i.key === timeOption.key);
                                        newSelected = selected.filter((i) => i.key !== timeOption.key);
                                        if(!exist) {
                                            newSelected.push(timeOption);
                                        }
                                    }
                                    else {
                                        newSelected.push(timeOption);
                                    }

                                    return newSelected;
                                });
                            }

                            const isSelected = !!(pickUpTime || []).find((i) => i.key === timeOption.key);

                            return (
                                <View key={timeOption.key}>
                                    <Touchable style={[style.timeOptionBtn, isSelected && style.timeOptionBtnSelected]}
                                               onPress={onPressOption}>
                                        <DzText style-={style.timeOptionText}>
                                            {timeOption.value}
                                        </DzText>
                                    </Touchable>
                                    <Space directions={'h'} />
                                </View>
                            )
                        })}
                        <View style={{height: 28}}/>
                        <Touchable style={style.confirmTimeBtn}
                                   onPress={onPressFinalConfirm}>
                            <DzText style={style.confirmTimeText}>
                                {I19n.t('تأكيد الطلبية')}
                            </DzText>
                        </Touchable>
                        <Space directions={'h'} size={'md'} />
                    </ScrollView>
                </View>
            }
        </View>
    );
};

export default SalesTabPending;
