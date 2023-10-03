import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, ScrollView, Image} from 'react-native';

import { ordersContainerStyle as style } from './orders.container.style';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import WillShowToast from "deelzat/toast/will-show-toast";
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import {IconButton, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import BackSvg from "assets/icons/BackIcon.svg";
import {DzText} from "deelzat/v2-ui";
import EmptyBoxIcon from "assets/icons/EmptyBox.svg";
import I19n, {getLocale} from "dz-I19n";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import OrderApi from "modules/order/apis/order.api";
import OrderStatusConst from "modules/order/constants/order-status.const";
import OrdersListInput from "modules/order/inputs/orders-list-input";
import {refactorImageUrl} from "modules/main/others/main-utils";
import moment from "moment-timezone";

let DeliveredIcon, ProgressIcon, RejectedIcon;

const OrdersContainer = () => {

    const insets = useSafeAreaInsets();

    const [page, pageSet] = useState(1);
    const [orders, ordersSet] = useState([]);
    const [isLoading, isLoadingSet] = useState(true);
    const [fetchMore, fetchMoreSet] = useState(true);


    if (!DeliveredIcon) {
        DeliveredIcon = require('assets/icons/led_green.png');
        ProgressIcon = require('assets/icons/led_yellow.png');
        RejectedIcon = require('assets/icons/led_red.png');
    }

    const getStatusIcon = (status) => {
        if (status === OrderStatusConst.DELIVERED) {
            return DeliveredIcon;
        }
        else if (status === OrderStatusConst.REJECTED || status === OrderStatusConst.CANCELED) {
            return RejectedIcon;
        }

        return ProgressIcon;
    }

    useEffect(() => {

        const input = new OrdersListInput();
        input.page = page;
        input.page_size = 10;

        OrderApi.listOrders(input)
            .then((result) => {
                ordersSet(prev => [...prev, ...result]);
                isLoadingSet(false);

                fetchMoreSet(result.length > 0);

            })
            .catch(console.warn);

    }, [page])

    const renderItem = useCallback(({item, index}) => {

        const renderImages = item.images?.map((_item, _index) => {
            return (
                <ImageWithBlur key={_index + ''}
                               style={style.productImage}
                               resizeMode="cover"
                               resizeMethod="resize"
                               thumbnailUrl={refactorImageUrl(_item.image, 1)}
                               imageUrl={refactorImageUrl(_item.image, style.productImage.width)}/>
            );
        });

        const onPressDetails = () => {
            RootNavigation.push(MainStackNavsConst.ORDER_DETAILS, {orderId: item.id})
        }


        moment.locale(getLocale());
        const formattedDate = moment(new Date(item.created_at)).format('DD MMM YYYY');


        // <!-- RESIZE resizeProductImageUrl(product.image, [ImageSize.MEDIUM, 250]) -->

        return (
            <Touchable onPress={onPressDetails}>
                <DzText style={{textAlign: 'left'}}>
                    <DzText style={style.orderNumGrey}>
                        {I19n.t('رقم الطلبية')}
                    </DzText>
                    <DzText style={style.orderNumBlack}>
                        {' : ' + item.id}
                    </DzText>
                </DzText>
                <Space directions={'h'} size={['sm', '']} />
                <View style={style.info}>
                    <Space directions={'h'} size={['sm', '']} />
                    <ScrollView horizontal={true}
                                contentContainerStyle={style.imagesContainer}>
                        {renderImages}
                    </ScrollView>
                    <Space directions={'h'} size={['sm', '']} />
                    <View style={{paddingStart: 12, paddingEnd: 12}}>
                        <View style={style.separator} />
                        <Space directions={'h'} />
                        <View style={LayoutStyle.Row}>
                            <View>
                                <View style={LayoutStyle.Row}>
                                    <DzText style={style.orderStatusTxt}>
                                        {I19n.t('حالة الطلب') + ': '}
                                    </DzText>
                                    <Image source={getStatusIcon(item.status)}
                                           resizeMode={'stretch'}
                                           style={style.statusImage}/>
                                </View>
                                <View style={LayoutStyle.Row}>
                                    <DzText style={style.itemDate}>
                                        {I19n.t('تم الطلب بتاريخ')}
                                    </DzText>
                                    <DzText style={style.itemDate}>
                                        {' '} {formattedDate}
                                    </DzText>
                                </View>
                            </View>
                            <View style={LayoutStyle.Flex}/>
                            <View>
                                <DzText style={style.orderPrice}>
                                    {item.total_price?.toFixed(2) + ' ' + item.currency}
                                </DzText>
                                <Space />
                                <View style={style.viewDetailsBtn}>
                                    <DzText style={style.viewDetailsTxt}>
                                        {I19n.t('تفاصيل الطلب')}
                                    </DzText>
                                    <BackSvg width={12}
                                             height={12}
                                             style={LocalizedLayout.ScaleX(true)}
                                             stroke={Colors.MAIN_COLOR}/>
                                </View>
                            </View>
                        </View>
                        <Space directions={'h'} size={['sm', '']} />
                    </View>
                </View>
            </Touchable>
        )
    }, []);


    const ListFooterComponent = useCallback(() => (
        <ActivityIndicator style={style.footerLoader}
                           size="small"
                           color={(isLoading && orders.length > 0)? Colors.MAIN_COLOR : 'transparent'} />
    ), [isLoading, orders]);


    const ListEmptyComponent = useCallback(() => {
        if (isLoading && !orders.length) {
            return (
                <View style={LayoutStyle.Flex}>
                    <ActivityIndicator size="small"
                                       style={style.bigLoader}
                                       color={Colors.MAIN_COLOR}/>
                </View>
            )
        }

        return (
            <View style={style.emptyView}>
                <View style={LayoutStyle.AlignItemsCenter}>
                    <EmptyBoxIcon />
                    <View style={{height: 45}}/>
                    <DzText style={style.emptyOrdersTitle}>
                        {I19n.t('لا يوجد طلبات') + '!'}
                    </DzText>
                    <View style={{height: 26}}/>
                    <DzText style={style.emptyOrdersDesc}>
                        {I19n.t('ما تبحث عنه على بعد كبسة واحدة')}
                    </DzText>
                    <View style={{height: 60}}/>
                    <Touchable style={style.browseBtn}>
                        <DzText style={style.browseBtnText}>
                            {I19n.t('إبدأ بالتسوق')}
                        </DzText>
                    </Touchable>
                </View>
            </View>
        )
    }, [isLoading]);


    const ItemSeparatorComponent = useCallback(() => {
        return (
            <View style={{height: 36}} />
        )
    }, []);

    const onEndReached = useCallback(() => {
        if (fetchMore) {
            pageSet(page + 1);
        }
    }, [fetchMore, page]);


    const keyExtractor = useCallback((item) => `${item.id}`, []);

    return (
        <View style={[style.container, {paddingTop: insets.top}]}>
            <WillShowToast id={'orders'}/>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('الطلبات')}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
            <View style={{height: 15}}/>
            <FlatList data={orders}
                      renderItem={renderItem}
                      keyExtractor={keyExtractor}
                      contentContainerStyle={style.contentContainerStyle}
                      showsVerticalScrollIndicator={false}
                      ListFooterComponent={ListFooterComponent}
                      ItemSeparatorComponent={ItemSeparatorComponent}
                      onEndReached={onEndReached}
                      onEndReachedThreshold={70}
                      ListEmptyComponent={ListEmptyComponent}/>
        </View>
    );
};

export default OrdersContainer;
