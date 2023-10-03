import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, FlatList} from 'react-native';

import { salesTabConfirmedStyle as style } from './sales-tab-confirmed.component.style';
import SalesListInput from "modules/order/inputs/sales-list.input";
import OrderApi from "modules/order/apis/order.api";
import OrderStatusConst from "modules/order/constants/order-status.const";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import I19n, {getLocale, isRTL} from "dz-I19n";
import EmptyOrdersIcon from "assets/icons/EmptyOrders.svg";
import {Space} from "deelzat/ui";
import PackageIcon from "assets/icons/Package.svg";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import moment from "moment-timezone";
import {getFullColorsPalette} from "modules/main/others/colors.utils";
import {refactorImageUrl} from "modules/main/others/main-utils";


const SalesTabConfirmed = (props) => {

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
                const newItems = result.items.filter(item => item.status !== OrderStatusConst.PENDING)
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

    const renderItem = useCallback(({item}) => {

        const isConfirmed = !(item.status === OrderStatusConst.REJECTED || item.status === OrderStatusConst.CANCELED);
        moment.locale(getLocale());
        const formattedDate = moment(new Date(item.created_at)).format('DD MMM YYYY');
        const onPress = () => {
            onPressProduct(item.product_id, item.id);
        }

        const onLongPress = () => {
            onLongPressItem(item.image);
        }

        const onPressOut = () => {
            onPressOutItem();
        }

        const variantColor = item.variant?.option1 &&
            FullColorsPalette.find(color => color.title?.trim() === item.variant.option1.trim())?.color;

        return (
            <View>
                <DzText style={{textAlign: 'left'}}>
                    <DzText style={style.orderNumGrey}>
                        {I19n.t('رقم الطلبية')}
                    </DzText>
                    <DzText style={style.orderNumBlack}>
                        {' : ' + item?.id}
                    </DzText>
                </DzText>
                <Space directions={'h'} size={'sm'} />
                <Space directions={'h'}/>
                <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                    <PackageIcon />
                    <View style={{width: 12}}/>
                    <View>
                        <DzText style={isConfirmed? style.confirmed: style.rejected}>
                            {isConfirmed? I19n.t('تم تأكيد الطلبية'): I19n.t('تم رفض الطلبية')}
                        </DzText>
                        <View style={{flexDirection: 'row-reverse'}}>
                            <DzText style={style.itemDate}>
                                {formattedDate} {' '}
                            </DzText>
                            <DzText style={style.itemDate}>
                                {I19n.t('تم الطلب بتاريخ')}{' '}
                            </DzText>
                        </View>
                    </View>
                </View>
                <Space directions={'h'} size={'md'} />
                <Touchable style={style.itemInfo}
                           onLongPress={onLongPress}
                           onPressOut={onPressOut}
                           onPres={onPress}>
                    <ImageWithBlur
                        style={style.itemImage}
                        resizeMode="cover"
                        resizeMethod="resize"
                        thumbnailUrl={refactorImageUrl(item.image, 1)}
                        imageUrl={refactorImageUrl(item.image, style.itemImage.width)}/>
                    <Space directions={'v'}/>
                    <View style={{   flex: 1,
                        justifyContent: 'flex-start',}}>
                        <DzText style={[style.itemName, LocalizedLayout.TextAlignRe()]}>
                            {item.name}
                        </DzText>
                        <Space directions={'h'}/>
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
                </Touchable>
            </View>
        )
    }, [currencyCode]);

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
            <View style={style.listSeparator}/>
        )
    }, []);

    return (
        <View style={style.container}>
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
        </View>
    );
};

export default SalesTabConfirmed;
