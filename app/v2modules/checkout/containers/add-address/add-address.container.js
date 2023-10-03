import React, { useCallback, useRef, useState } from 'react';
import { View, TouchableWithoutFeedback, TextInput, ScrollView, Platform } from 'react-native';

import { addAddressContainerStyle as style } from './add-address.container.style';
import WillShowToast from 'deelzat/toast/will-show-toast';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import PageHeader from 'v2modules/shared/components/page-header/page-header.component';
import I19n from 'dz-I19n';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { Colors, LayoutStyle, Spacing } from 'deelzat/style';
import AddressFieldNames from 'v2modules/checkout/constants/address-field-names.const';
import omit from 'lodash/omit';
import { useDispatch, useSelector } from 'react-redux';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import AddressFields from 'v2modules/shared/components/address-fields/address-fields.component';
import { isEmptyValues, shareApiError } from 'modules/main/others/main-utils';
import Toast from 'deelzat/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { validateFields } from 'v2modules/checkout/others/checkout.utils';
import AddressStoreInput from 'v2modules/checkout/inputs/address-store.input';
import AddressesApi from 'v2modules/checkout/apis/addresses.api';
import { trackAddressFieldFilled } from 'modules/analytics/others/analytics.utils';
import * as Sentry from '@sentry/react-native';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import { addressesThunks } from 'v2modules/checkout/stores/addresses/addresses.store';

const AddAddressContainer = (props) => {
    const {
        addressId,
        addressFields,
    } = props.route.params || {};


    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const titleFieldRef = useRef();
    const isEditAddress = useRef(!!addressId);
    const trackSectionTitle = useRef(`${isEditAddress.current ? 'edit_address' : 'add_address'}`).current;

    const allShippableCountries = useSelector(persistentDataSelectors.shippableCountriesSelector);

    const [fieldValues, fieldValuesSet] = useState(addressFields || {});
    const [fieldErrors, fieldErrorsSet] = useState({});
    const [isEditingTitle, isEditingTitleSet] = useState(false);
    const [isSavingAddress, isSavingAddressSet] = useState(false);


    // Setup keyboard avoiding behaviour
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            AvoidSoftInput.setDefaultAppSoftInputMode();
        }
        AvoidSoftInput.setEnabled(true);
        return () => {
            AvoidSoftInput.setEnabled(false);
        };
    }, []);


    const setField = useCallback((key, value) => {
        const newFieldValues = { ...fieldValues };
        newFieldValues[key] = value;

        let _fieldErrors = omit(fieldErrors, key);
        if (key === AddressFieldNames.COUNTRY) {
            newFieldValues[AddressFieldNames.CITY] = {};
            newFieldValues[AddressFieldNames.MOBILE_COUNTY_CODE] = newFieldValues[AddressFieldNames.COUNTRY]?.country_code || '';
            _fieldErrors = omit(fieldErrors, AddressFieldNames.MOBILE_COUNTY_CODE);
        }

        fieldValuesSet(newFieldValues);

        fieldErrorsSet(_fieldErrors);
    }, [fieldValues, fieldErrors]);


    const submitAddress = (fields) => {
        isSavingAddressSet(true);
        (async () => {

            try {

                const input = new AddressStoreInput();
                input.addressFields = fieldValues;

                if (isEditAddress.current) {
                    input.addressId = addressId;
                    await AddressesApi.update(input);
                } else {
                    await AddressesApi.create(input);
                }

                dispatch(addressesThunks.refreshUserAddresses());
                RootNavigation.goBack();

            } catch (e) {

                shareApiError(e, `${trackSectionTitle} error`);

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
                    Sentry.captureMessage(`[api-error] ${trackSectionTitle} error: ` + (errorString || JSON.stringify(e)));
                } catch (x) {
                }
            }
            isSavingAddressSet(false);
        })();
    };

    const validate = () => {

        const fields = { ...fieldValues };
        fields.firstName = fields.firstName?.trim();
        fields.lastName = fields.lastName?.trim();

        const _fieldsErrors = validateFields(fields, {withTitle: true});
        fieldErrorsSet(_fieldsErrors);

        if (isEmptyValues(_fieldsErrors)) {
            submitAddress(fields);
        } else {
            Toast.danger(I19n.t('الرجاء تعبئة جميع الحقول بطريقة صحيحة'));
        }
    };


    const onPressEditTitle = () => {
        isEditingTitleSet(true);
        setTimeout(() => {
            titleFieldRef.current?.focus();
        }, 100);
    };


    const onFocusField = useCallback(() => {
        isEditingTitleSet(false);
    }, []);


    return (
        <TouchableWithoutFeedback onPress={onFocusField}>
            <View style={[style.container, {paddingTop: insets.top}]}>
                <WillShowToast id={'add-addresses'} />
                <View style={[style.saveBtn, { paddingBottom: insets.bottom || 20 }]}>
                    <Button
                        textStyle={style.saveBtnText}
                        loading={isSavingAddress}
                        disabled={isSavingAddress}
                        type={ButtonOptions.Type.PRIMARY}
                        text={I19n.t('حفظ العنوان')}
                        onPress={() => validate()}
                    />
                </View>
                <Space directions={'h'} size={'md'} />
                <PageHeader title={isEditAddress.current ? I19n.t('تعديل عنوان') : I19n.t('إضافة عنوان')}
                            viewStyle={Spacing.HorizontalPadding} />
                <Space directions={'h'} size={'md'} />
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode={'on-drag'}
                    showsVerticalScrollIndicator={false}
                    behavior='padding'>
                    <TouchableWithoutFeedback>
                        <View style={Spacing.HorizontalPadding}>
                            <Space directions={'h'} size={'md'} />
                            <Touchable onPress={onPressEditTitle} disabled={isEditingTitle}
                                       style={Spacing.HorizontalPadding}>
                                {!isEditingTitle && (
                                    <DzText style={[style.titleText,
                                        LayoutStyle.Flex,
                                        !fieldValues[AddressFieldNames.TITLE] && {
                                            textDecorationLine: 'underline',
                                            color: Colors.alpha(Colors.N_BLACK, 0.5),
                                        },
                                        fieldErrors[AddressFieldNames.TITLE] && {color: Colors.ERROR_COLOR_2}
                                    ]}>
                                        {fieldValues[AddressFieldNames.TITLE] ||
                                        I19n.t('إسم العنوان')}
                                    </DzText>
                                )}
                                {isEditingTitle && (
                                    <TextInput
                                        style={[style.titleText, { paddingTop: -5 }]}
                                        multiline={true}
                                        value={fieldValues[AddressFieldNames.TITLE]}
                                        onChangeText={(value) => {
                                            setField(AddressFieldNames.TITLE, value);
                                            trackAddressFieldFilled(AddressFieldNames.TITLE, value, trackSectionTitle);
                                        }}
                                        blurOnSubmit={true}
                                        ref={titleFieldRef}
                                        onBlur={() => isEditingTitleSet(false)}
                                    />
                                )}
                            </Touchable>
                            <View style={{ height: 24 }} />
                            <AddressFields
                                fields={fieldValues}
                                fieldErrors={fieldErrors}
                                trackingLabel={trackSectionTitle}
                                countries={allShippableCountries}
                                isCityCountryInRow={false}
                                isStreetFieldLarge={true}
                                onFieldChange={setField} />
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default AddAddressContainer;
