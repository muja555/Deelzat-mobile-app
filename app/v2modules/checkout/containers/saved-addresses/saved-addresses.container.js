import React, { useCallback, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';

import { savedAddressesContainerStyle as style } from './saved-addresses.container.style';
import WillShowToast from 'deelzat/toast/will-show-toast';
import { Space } from 'deelzat/ui';
import PageHeader from 'v2modules/shared/components/page-header/page-header.component';
import I19n, { getLocale, isRTL } from 'dz-I19n';
import { Colors, Font, LayoutStyle, LocalizedLayout, Spacing } from 'deelzat/style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { useDispatch, useSelector } from 'react-redux';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { addressesSelectors, addressesThunks } from 'v2modules/checkout/stores/addresses/addresses.store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mapRemoteAddressObjAsFields } from 'v2modules/checkout/others/checkout.utils';
import AddressesApi from 'v2modules/checkout/apis/addresses.api';
import AddressStoreInput from 'v2modules/checkout/inputs/address-store.input';
import { shareApiError } from 'modules/main/others/main-utils';
import Toast from 'deelzat/toast';
import * as Sentry from '@sentry/react-native';
import * as Actions from 'v2modules/checkout/stores/checkout/checkout.actions';
import {
    trackClickOnAddAddress,
    trackClickOnDeleteAddress,
    trackClickOnEditAddress,
} from 'modules/analytics/others/analytics.utils';

const SavedAddressesContainer = (props) => {

    const {
        isSelectingCheckoutMode = false,
    } = props.route?.params || {};

    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const addressesList = useSelector(addressesSelectors.userAddressesSelector);
    const [currentItemDeletingId, currentItemDeletingIdSet] = useState();

    const renderItem = useCallback(({ item, index }) => {

        const cityName = item[`city_name_${getLocale()}`];
        const countryName = item[`country_name_${getLocale()}`];

        const firstLastName = `${item?.first_name ?? ''} ${item?.last_name ?? ''}`.trim();
        const formattedPhone = item.phone;


        const onPressDelete = () => {

            trackClickOnDeleteAddress();
            currentItemDeletingIdSet(item.id);
            (async () => {
                try {

                    const inputs = new AddressStoreInput();
                    inputs.addressId = item.id;
                    await AddressesApi.delete(inputs);
                    dispatch(addressesThunks.refreshUserAddresses());

                } catch (e) {

                    shareApiError(e, `delete address error`);

                    let errorString;
                    if (e?.data?.full_messages?.length > 0) {
                        errorString = e?.data?.full_messages;
                    }

                    Toast.danger(errorString || I19n.t('حصل خطأ ما'));
                    console.error(JSON.stringify(e));

                    try {
                        Sentry.captureException(e);
                    } catch (x) {
                    }

                    try {
                        Sentry.captureMessage(`[api-error] delete address error: ` + (errorString || JSON.stringify(e)));
                    } catch (x) {
                    }

                    console.warn(e);
                }
            })();
        };

        const onPressEdit = () => {
            trackClickOnEditAddress();
            RootNavigation.push(MainStackNavsConst.ADD_ADDRESS, {
                addressId: item.id,
                addressFields: mapRemoteAddressObjAsFields(item),
            });
        };

        const onChooseAddress = () => {
            dispatch(Actions.SetSavedAddress(item));
            RootNavigation.goBack();
        }

        const isDeletingThis = !!item.id && currentItemDeletingId === item.id;

        return (
            <Touchable disabled={!isSelectingCheckoutMode}
                       onPress={onChooseAddress}>
                <DzText style={[style.addressTitle, LocalizedLayout.TextAlignRe()]}>
                    {item.title}
                </DzText>
                <View style={{ height: 12 }} />
                <DzText style={[style.firstNameLastName, LocalizedLayout.TextAlignRe()]}>
                    {firstLastName}
                </DzText>
                <View style={{ height: 5 }} />
                <DzText style={[style.infoText, LocalizedLayout.TextAlignRe()]}>
                    {[countryName, ' ' + cityName].join(',')}
                </DzText>
                <Space directions={'h'} size={'md'} />
                <DzText style={[style.infoText, LocalizedLayout.TextAlignRe()]}>
                    {item.street}
                </DzText>
                <View style={{ height: 12 }} />
                <View>
                    <DzText style={[style.infoText, Font.Bold, LocalizedLayout.TextAlignRe()]}>
                        {I19n.t('رقم الهاتف المحمول') + ':'}
                    </DzText>
                    <DzText style={[style.infoText, LocalizedLayout.TextAlignRe()]}>
                        {' ' + formattedPhone}
                    </DzText>
                </View>
                <Space directions={'h'} size={'md'} />
                {
                    (!isSelectingCheckoutMode) &&
                        <>
                            <View style={LayoutStyle.Row}>
                                <Touchable disabled={isDeletingThis} onPress={onPressEdit}>
                                    <DzText style={style.actionText}>
                                        {I19n.t('تعديل')}
                                    </DzText>
                                </Touchable>
                                <Space directions={'v'} size={'md'} />
                                <Touchable onPress={onPressDelete}>
                                    {
                                        (isDeletingThis) &&
                                        <ActivityIndicator style={style.deleteLoader}
                                                           size="small"
                                                           color={Colors.MAIN_COLOR} />
                                    }
                                    <DzText style={[style.actionText, isDeletingThis && {opacity: 0}]}>
                                        {I19n.t('حذف')}
                                    </DzText>
                                </Touchable>
                            </View>
                            <Space directions={'h'} size={'md'}/>
                        </>
                }
            </Touchable>
        );
    }, [currentItemDeletingId]);


    const ListSeparator = useCallback(() => {
        return (
            <View>
                <View style={style.separator} />
                <View style={{height: 24}}/>
            </View>
        );
    }, []);


    const ListFooter = useCallback(() => {
        return (
            <View style={{ height: 70 }} />
        );
    }, []);


    const keyExtractor = useCallback((item, index) => `_${index.id}_${index}`, []);


    const AddNewAddressButton = (
        <Touchable onPress={() => {
            trackClickOnAddAddress();
            RootNavigation.push(MainStackNavsConst.ADD_ADDRESS);
        }} style={style.addBtn}>
            <DzText style={style.addBtnText}>
                {I19n.t('إضافة عنوان جديد')}
            </DzText>
        </Touchable>
    );


    return (
        <View style={[style.container, { paddingTop: insets.top }]}>
            <WillShowToast id={'saved-addresses'} />
            <Space directions={'h'} size={'md'} />
            <PageHeader title={I19n.t('العناوين المحفوظة')}
                        viewStyle={Spacing.HorizontalPadding} />
            {
                (!addressesList.length) &&
                <View style={style.emptyView}>
                    <View style={style.emptyViewTextView}>
                        <DzText style={style.emptyViewText}>
                            {I19n.t('إحفظ عناوين التوصيل التي تعتمدها ووفر عحالك وقت عند إتمام عملية الشراء')}
                        </DzText>
                    </View>
                    {
                        (!isSelectingCheckoutMode) &&
                        <>
                            {AddNewAddressButton}
                        </>
                    }
                </View>
            }
            {
                (addressesList.length > 0) &&
                <FlatList data={addressesList}
                          renderItem={renderItem}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={style.contentContainerStyle}
                          ItemSeparatorComponent={ListSeparator}
                          ListFooterComponent={ListFooter}
                          keyExtractor={keyExtractor}
                />
            }
            {
                (addressesList.length > 0 && !isSelectingCheckoutMode) &&
                <View style={[style.stickyAddBtnView, { bottom: insets.bottom || 20 }]}>
                    {AddNewAddressButton}
                </View>
            }
        </View>
    );
};

export default SavedAddressesContainer;
