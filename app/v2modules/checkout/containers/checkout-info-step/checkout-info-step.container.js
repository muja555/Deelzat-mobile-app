import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';

import { checkoutInfoStepContainerStyle as style } from './checkout-info-step.container.style';
import { Button, ButtonOptions, DashLine, Space } from 'deelzat/ui';
import I19n, { isRTL } from 'dz-I19n';
import { DzText, SelectValueList, Touchable } from 'deelzat/v2-ui';
import AddressFields from 'v2modules/shared/components/address-fields/address-fields.component';
import { useDispatch, useSelector } from 'react-redux';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import AddressFieldNames from 'v2modules/checkout/constants/address-field-names.const';
import omit from 'lodash/omit';
import { isEmptyValues } from 'modules/main/others/main-utils';
import { trackClickOnChooseAddress, trackClickOnCopyBuyerInfo } from 'modules/analytics/others/analytics.utils';
import { Colors, Font } from 'deelzat/style';
import AddressIcon from 'assets/icons/Location1.svg';
import BackSvg from 'assets/icons/PanelHandle.svg';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import * as Actions from 'v2modules/checkout/stores/checkout/checkout.actions';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import {
    formatMobileFieldsFromAddress, mapRemoteAddressObjAsFields,
    validateFields,
} from 'v2modules/checkout/others/checkout.utils';
import {
    AddressesOptionConst,
    getAddressOptions,
} from 'v2modules/checkout/containers/checkout-info-step/checkout-info-step.utils';
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';
import { authSelectors } from 'modules/auth/stores/auth/auth.store';
import UserInfoApi from 'modules/main/apis/user-info.api';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import { checkoutSelectors, checkoutThunks } from 'v2modules/checkout/stores/checkout/checkout.store';
import store from 'modules/root/components/store-provider/store-provider';

const DEFAULT_INFO = { [AddressFieldNames.CITY]: {}, [AddressFieldNames.COUNTRY]: {} };
const CheckoutInfoStepContainer = (props) => {

    const {
        isFocused = false,
        onNext = () => {
        },
    } = props;

    const dispatch = useDispatch();
    const auth0User = useSelector(authSelectors.auth0UserSelector);
    const geoCountryCode = useSelector(geoSelectors.geoCountryCodeSelector);
    const countries = useSelector(persistentDataSelectors.countriesListSelector);
    const cities = useSelector(persistentDataSelectors.citiesListSelector);
    const allAddons = useSelector(persistentDataSelectors.addonsListSelector);
    const allShippableCountries = useSelector(persistentDataSelectors.shippableCountriesSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);
    const selectedSavedAddress = useSelector(checkoutSelectors.selectedSavedAddressSelector);

    const [shippableCountries, shippableCountriesSet] = useState(allShippableCountries);

    const [buyerInfo, buyerInfoSet] = useState(DEFAULT_INFO);
    const [shippingInfo, shippingInfoSet] = useState(DEFAULT_INFO);
    const [buyerInfoErrors, buyerInfoErrorsSet] = useState({});
    const [shippingInfoErrors, shippingInfoErrorsSet] = useState({});

    const [selectedShippingAddressOption, selectedShippingAddressOptionSet] = useState();
    const [isCopyButtonDisabled, isCopyButtonDisabledSet] = useState(true);

    const scrollViewRef = useRef();
    const shippingInfoOpacity = useRef(new Animated.Value(0)).current;
    const [buyerViewY, buyerViewYSet] = useState(0);
    const [shippingInfoY, shippingInfoYSet] = useState(0);


    const addressOptions = useMemo(() => {
        return getAddressOptions(isCopyButtonDisabled);
    }, [isCopyButtonDisabled]);


    // Setup keyboard avoiding behaviour
    React.useEffect(() => {

        if (isFocused) {
            if (Platform.OS === 'android') {
                AvoidSoftInput.setDefaultAppSoftInputMode();
            }
        }

        AvoidSoftInput.setEnabled(isFocused);
        return () => {
            AvoidSoftInput.setEnabled(false);
        };
    }, [isFocused]);



    useEffect(() => {
        dispatch(Actions.SetAddonsList(allAddons));
    }, [allAddons]);


    useEffect(() => {
        return () => {
            dispatch(Actions.ResetData());
        };
    }, []);


    // Get default buyer info
    useEffect(() => {

        if (shopState?.shop) {
            const defaultCountry = allShippableCountries.find((c) => c.code === geoCountryCode);
            const countryVal = shopState.shop.address?.country || defaultCountry?.['ar'];
            const cityVal = shopState.shop.address?.city;
            const selectedCountry = countries.find((cObj) => cObj['ar'] === countryVal);
            const selectedCity = cities.find((cObj) => cObj['ar'] === cityVal);

            buyerInfoSet(formatMobileFieldsFromAddress({
                [AddressFieldNames.FIRST_NAME]: shopState.shop.user?.firstName?.trim(),
                [AddressFieldNames.LAST_NAME]: shopState.shop.user?.lastName?.trim(),
                [AddressFieldNames.EMAIL]: shopState.shop.user?.email,
                [AddressFieldNames.MOBILE_NUMBER]: shopState.shop.user?.mobileNumber,
                [AddressFieldNames.ADDRESS]: shopState.shop.address?.street?.trim(),
                [AddressFieldNames.CITY]: selectedCity,
                [AddressFieldNames.COUNTRY]: selectedCountry || defaultCountry,
            }));
        } else if (auth0User) {

            UserInfoApi.getUserInfo()
                .then((res) => {

                    buyerInfoSet(formatMobileFieldsFromAddress({
                        [AddressFieldNames.FIRST_NAME]: res.metadata.firstName?.trim(),
                        [AddressFieldNames.LAST_NAME]: res.metadata.lastName?.trim(),
                        [AddressFieldNames.EMAIL]: res.metadata.email || auth0User?.email,
                        [AddressFieldNames.MOBILE_NUMBER]: res.metadata.mobileNumber || auth0User?.phone_number,
                        [AddressFieldNames.ADDRESS]: res.metadata.street,
                    }));

                })
                .catch(console.warn);
        }

    }, []);


    // on select saved address, uncheck address options
    useEffect(() => {
        if (selectedSavedAddress) {
            selectedShippingAddressOptionSet();
            shippingInfoSet(mapRemoteAddressObjAsFields(selectedSavedAddress));
        }
    }, [selectedSavedAddress]);


    // Remove selected address if any option is checked
    useEffect(() => {
        if (selectedShippingAddressOption) {
            dispatch(Actions.SetSavedAddress());
        }
    }, [selectedShippingAddressOption]);


    // Reflect change in shippableCountries to set shipping country
    useEffect(() => {
        onShippingInfoFieldsChange(shippingInfo);
    }, [shippableCountries]);


    // Duplicate buyer info if option "copy" is selected
    // Decide whatever to enable or disable "copy" option
    useEffect(() => {
        const disableCopyOption = !shippableCountries.find(shippable => shippable.objectID === buyerInfo[AddressFieldNames.COUNTRY]?.objectID);

        if (!disableCopyOption && selectedShippingAddressOption === AddressesOptionConst.COPY_BUYER_INFO) {
            onShippingInfoFieldsChange(buyerInfo);
        }

        isCopyButtonDisabledSet(disableCopyOption);

    }, [selectedShippingAddressOption, buyerInfo]);


    // If copy address option is not available and this option is selected, remove this option
    useEffect(() => {
        if (isCopyButtonDisabled && selectedShippingAddressOption === AddressesOptionConst.COPY_BUYER_INFO) {
            selectedShippingAddressOptionSet();
        }
    }, [isCopyButtonDisabled, selectedShippingAddressOption]);


    // Animate shipping field opacity depending on selectedShippingAddressOption
    useEffect(() => {
        const addNewAddress = selectedShippingAddressOption === AddressesOptionConst.ADD_NEW_ADDRESS;
        Animated.timing(
            shippingInfoOpacity,
            {
                toValue: addNewAddress ? 1 : 0,
                duration: 350,
                useNativeDriver: true,
            })
            .start();

    }, [selectedShippingAddressOption]);

    const onBuyerInfoFieldChange = useCallback((key, value) => {

        let _buyerInfoErrors = omit(buyerInfoErrors, key);
        const newFieldValues = { ...buyerInfo };
        newFieldValues[key] = value;

        if (key === AddressFieldNames.COUNTRY) {
            newFieldValues[AddressFieldNames.CITY] = {};
            const newMobileCountryCode = newFieldValues[key]?.country_code || '';
            if (newMobileCountryCode) {
                newFieldValues[AddressFieldNames.MOBILE_COUNTY_CODE] = newMobileCountryCode;
                _buyerInfoErrors = omit(_buyerInfoErrors, AddressFieldNames.MOBILE_COUNTY_CODE);
            }

            const filteredCountries = allShippableCountries.filter(shCountry => shCountry.code === newFieldValues[key]?.code);
            shippableCountriesSet(filteredCountries.length > 0 ? filteredCountries : allShippableCountries);
            shippingInfoSet(_current => ({
                ..._current,
                [AddressFieldNames.COUNTRY]: {},
                [AddressFieldNames.CITY]: {},
                [AddressFieldNames.MOBILE_COUNTY_CODE]: newMobileCountryCode,
            }));
        }

        buyerInfoSet(newFieldValues);
        buyerInfoErrorsSet(_buyerInfoErrors);

    }, [buyerInfo, buyerInfoErrors]);


    const onShippingInfoFieldChange = useCallback((key, value) => {
        const newFieldValues = { ...shippingInfo };
        newFieldValues[key] = value;

        let _shippingInfoErrors = omit(shippingInfoErrors, key);
        if (key === AddressFieldNames.COUNTRY) {
            newFieldValues[AddressFieldNames.CITY] = {};
            newFieldValues[AddressFieldNames.MOBILE_COUNTY_CODE] = newFieldValues[AddressFieldNames.COUNTRY]?.country_code || '';
            _shippingInfoErrors = omit(shippingInfoErrors, AddressFieldNames.MOBILE_COUNTY_CODE);
        }

        shippingInfoSet(newFieldValues);
        shippingInfoErrorsSet(_shippingInfoErrors);
    }, [shippingInfo, shippingInfoErrors]);


    const onShippingInfoFieldsChange = useCallback((newFieldValues) => {
        const _newFieldValues = { ...newFieldValues };

        if (isEmptyValues(_newFieldValues) && selectedShippingAddressOption) {
            selectedShippingAddressOptionSet();
        }

        _newFieldValues[AddressFieldNames.COUNTRY] = shippableCountries[0];
        _newFieldValues[AddressFieldNames.MOBILE_COUNTY_CODE] = _newFieldValues[AddressFieldNames.COUNTRY]?.country_code || '';
        shippingInfoSet(_newFieldValues);
        shippingInfoErrorsSet({});
    }, [selectedShippingAddressOption, shippableCountries]);


    const onSelectAddressOption = (values) => {

        const val = values.length > 0 ? values[0].key : null;
        selectedShippingAddressOptionSet(val);

        if (val === AddressesOptionConst.COPY_BUYER_INFO) {
            onShippingInfoFieldsChange(buyerInfo);
        } else if (val === AddressesOptionConst.ADD_NEW_ADDRESS) {
            shippingInfoSet({});
            scrollViewRef.current?.scrollTo({ y: shippingInfoY - 60 });
        }
        trackClickOnCopyBuyerInfo(val === AddressesOptionConst.COPY_BUYER_INFO);
    };


    const onPressChooseFromAddresses = () => {
        trackClickOnChooseAddress();
        RootNavigation.push(MainStackNavsConst.SAVED_ADDRESSES, { isSelectingCheckoutMode: true });
    };


    const onLayoutBuyerInfoView = useCallback(({ nativeEvent: { layout: { y } } }) => {
        buyerViewYSet(y);
    }, []);


    const onLayoutShippingInfoView = useCallback(({ nativeEvent: { layout: { y } } }) => {
        shippingInfoYSet(y);
    }, []);


    const onPressProceed = () => {

        const _buyerInfoErrors = validateFields(buyerInfo, { withEmailField: true });
        const _shippingInfoErrors = validateFields(shippingInfo);
        const isValidBuyerInfo = isEmptyValues(_buyerInfoErrors);
        const isValidShippingInfo = isEmptyValues(_shippingInfoErrors);

        if (!isValidBuyerInfo) {
            scrollViewRef.current?.scrollTo({ y: buyerViewY - 60 });
        } else if (!isValidShippingInfo) {
            scrollViewRef.current?.scrollTo({ y: shippingInfoY - 60 });
        }

        buyerInfoErrorsSet(_buyerInfoErrors);
        shippingInfoErrorsSet(_shippingInfoErrors);


        if (isValidBuyerInfo && isValidShippingInfo) {
            dispatch(checkoutThunks.refreshSessionData({ buyerInfo, shippingInfo }));
            onNext();
        }
    };


    return (
        <View style={style.container}>
            <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode={'on-drag'}
                showsVerticalScrollIndicator={false}
                behavior='padding'>
                <TouchableWithoutFeedback>
                    <View>
                        <Space directions={'h'} size={'lg'} />
                        <DzText
                            style={[style.sectionTitle, !isEmptyValues(buyerInfoErrors) && style.sectionTitleError]}>
                            {I19n.t('تفاصيل المشتري')}
                        </DzText>
                        <View style={{ height: 24 }} />
                        <View onLayout={onLayoutBuyerInfoView}>
                            <AddressFields
                                fields={buyerInfo}
                                fieldErrors={buyerInfoErrors}
                                trackingLabel={'buyer_info'}
                                isFirstNameLastNameInRow={true}
                                withEmailField={true}
                                countries={countries}
                                onFieldChange={onBuyerInfoFieldChange} />
                        </View>
                        <View style={{ height: 30 }} />
                        <DashLine dashLength={4}
                                  dashGap={2}
                                  dashColor={Colors.alpha(Colors.N_BLACK, 0.1)}
                                  dashStyle={{ borderRadius: 5 }} />
                        <View style={{ height: 27 }} />
                        <DzText
                            style={[style.sectionTitle, !isEmptyValues(shippingInfoErrors) && style.sectionTitleError]}>
                            {I19n.t('تفاصيل التوصيل')}
                        </DzText>
                        <Space directions={'h'} size={'md'} />
                        <Touchable style={style.chooseFromAddrBtn}
                                   onPress={onPressChooseFromAddresses}>
                            <AddressIcon width={24} height={24} />
                            <Space directions={'v'} />
                            <DzText style={style.chooseFromAddrTxt}>
                                {selectedSavedAddress?.title || I19n.t('إختر عنوان التوصيل من العنوانين المحفوظة')}
                            </DzText>
                            <BackSvg style={[style.arrowSaveBtn, !isRTL() && { transform: [{ rotate: '270deg' }] }]}
                                     strokeWidth={1.5} width={12} height={12} />
                        </Touchable>
                        <Space directions={'h'} size={'md'} />
                        <DzText style={style.orTxt}>
                            {I19n.t('أو')}
                        </DzText>
                        <Space directions={'h'} size={'md'} />
                        <SelectValueList
                            options={addressOptions}
                            onChange={onSelectAddressOption}
                            value={selectedShippingAddressOption ? [{ key: selectedShippingAddressOption }] : []}
                            labelBy={'label'}
                            keyBy={'key'}
                            withSeparator={false}
                            multi={false}
                            radioStyle={style.radio}
                            radioMark={<View style={style.selectedMark} />}
                            rowStyle={style.copyAddressRow}
                            labelStyle={Font.Bold} />
                        <View style={{ height: 21 }} />
                        <Animated.View onLayout={onLayoutShippingInfoView}
                                       style={{ opacity: shippingInfoOpacity }}>
                            {
                                (selectedShippingAddressOption === AddressesOptionConst.ADD_NEW_ADDRESS) &&
                                <AddressFields
                                    fields={shippingInfo}
                                    fieldErrors={shippingInfoErrors}
                                    trackingLabel={'delivery_info'}
                                    isFirstNameLastNameInRow={true}
                                    withEmailField={false}
                                    countries={shippableCountries}
                                    onFieldChange={onShippingInfoFieldChange} />
                            }

                        </Animated.View>
                        <Space directions={'h'} size={'lg'} />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            <View>
                <Button
                    type={ButtonOptions.Type.PRIMARY}
                    textStyle={style.checkoutBtnText}
                    btnStyle={style.checkoutBtn}
                    text={I19n.t('المتابعة للدفع')}
                    onPress={onPressProceed} />
                <Space directions={'h'} size={'md'} />
            </View>
        </View>
    );
};

export default CheckoutInfoStepContainer;
