import { View, TouchableOpacity, Platform, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { shopEditStyle as style } from './shop-edit.component.style';
import { TextField, Select } from 'deelzat/form';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors, authThunks } from 'modules/auth/stores/auth/auth.store';
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import ShopEditInput from 'modules/shop/inputs/shop-edit.input';
import ShopApi from 'modules/shop/apis/shop.api';
import Close from 'assets/icons/Close.svg';
import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import Toast from 'deelzat/toast';
import { validateFields } from './shop-edit.utils';
import { isEmptyValues, shareApiError } from 'modules/main/others/main-utils';
import {
    trackEditShopSuccess,
    trackEditShopFieldFilled,
    trackEditShopFailed,
} from 'modules/analytics/others/analytics.utils';
import I19n, { getLocale } from 'dz-I19n';
import * as Sentry from '@sentry/react-native';
import { DzText } from 'deelzat/v2-ui';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import UsernameAvailabilityConst from 'v2modules/shop/constants/username-availability.const';
import GetAvailableUsernamesInput from 'v2modules/shop/inputs/get-available-usernames.input';
import ShopApiV2 from 'v2modules/shop/apis/shop.api';
import GetShopByUsernameInput from 'v2modules/shop/inputs/get-shop-by-username.input';
import LockIcon from 'assets/icons/LockFilled.svg';
import { AvoidSoftInput } from 'react-native-avoid-softinput';


const ShopEdit = (props) => {
    const {
        pageTitle = '',
        onHide = () => {
        },
        trackSource,
    } = props;

    const scrollViewRef = useRef();
    const scrollViewProps = scrollViewRef.current?._internalFiberInstanceHandleDEV?.memoizedProps;

    const dispatch = useDispatch();
    const authState = useSelector(authSelectors.authStateSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);
    const [fieldValues, fieldValuesSet] = useState({});
    const [fieldErrors, fieldErrorsSet] = useState({});
    const [submitting, submittingSet] = useState(false);

    const [isValidatingUsername, isValidatingUsernameSet] = useState(false);
    const [usernameFieldStatus, usernameFieldStatusSet] = useState(UsernameAvailabilityConst.NONE);
    const [usernameSuggestions, usernameSuggestionsSet] = useState([]);

    const geoCountryCode = useSelector(geoSelectors.geoCountryCodeSelector);
    const allCountries = useSelector(persistentDataSelectors.shippableCountriesSelector);

    const defaultCountry = allCountries.find(c => c.code === geoCountryCode);
    const selectedCountry = allCountries.find(cObj => cObj['ar'] === fieldValues['country']) || defaultCountry;
    const cities = useSelector(selectedCountry ? persistentDataSelectors.citiesByCountrySelector(selectedCountry.objectID) : () => []);

    // Generate country options
    const list = allCountries.filter(country => (country.code === geoCountryCode));
    // If user is not in any supported markets, display all of them instead
    let countryOptions = list.length > 0 ? list : allCountries;
    if (selectedCountry && !countryOptions.find(c => c.objectID === selectedCountry.objectID)) {
        // If selected country is not from the options, make it the only options
        // It means: shop has been created in different geo location than current. thus it will never change
        countryOptions = [selectedCountry];
    }


    const fieldsRefs = useRef({});


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

    useEffect(() => {
        const shop = shopState.shop;
        const _fieldValues = {
            firstName: shop?.user?.firstName,
            lastName: shop?.user?.lastName,
            storeName: shop?.name,
            username: shop?.username,
            mobileNumber: shop?.user?.mobileNumber || authState?.auth0User?.phone_number,
            whatsappNumber: shop?.extra_data?.whatsapp_number,
            email: shop?.user?.email || authState?.auth0User?.email,
            city: shop?.address?.city,
            country: shop?.address?.country || defaultCountry?.['ar'],
            street: shop?.address?.street,
            picture: shop?.user?.picture || authState?.auth0User?.userMetadata?.picture,
        };
        fieldValuesSet(_fieldValues);
    }, [shopState.shop]);


    const setField = (key, value) => {
        const newFieldValues = { ...fieldValues };
        newFieldValues[key] = value;
        if (key === 'country') {
            newFieldValues['city'] = undefined;
        }

        fieldValuesSet(newFieldValues);
    };


    const getUsernameSuggestions = async (forUsername) => {
        try {
            const inputs = new GetAvailableUsernamesInput();
            inputs.name = forUsername;
            const result = await ShopApiV2.getSuggestionsForUsername(inputs);
            usernameSuggestionsSet(result.suggestions);
        } catch (e) {
            console.warn(e);
        }
    };


    const checkUserNameIfAvailable = () => {
        const username = fieldValues.username;
        isValidatingUsernameSet(true);
        usernameSuggestionsSet([]);

        return new Promise((resolve, reject) => {
            (async () => {

                try {
                    const inputs = new GetShopByUsernameInput();
                    inputs.username = username;
                    const result = await ShopApiV2.getShopByUsername(inputs);

                    if (result?.users_ids?.length > 0 && result?.users_ids[0] === authState?.auth0User?.userId) {
                        // Username is available
                        usernameFieldStatusSet(UsernameAvailabilityConst.AVAILABLE);
                        resolve(true);
                    } else {
                        // Username is taken
                        usernameFieldStatusSet(UsernameAvailabilityConst.TAKEN);
                        getUsernameSuggestions(username);
                        resolve(false);
                    }

                } catch (e) {

                    // Username is available
                    if (e.data?.error_code === 404) {
                        usernameFieldStatusSet(UsernameAvailabilityConst.AVAILABLE);
                        resolve(true);
                    } else {
                        usernameFieldStatusSet(UsernameAvailabilityConst.NONE);
                        console.warn(e);
                        resolve(false);
                    }
                }

                isValidatingUsernameSet(false);
            })();
        });
    };

    const usernameFieldErrorMsg = useMemo(() => {
        if (fieldErrors.username) {
            return I19n.t('الرجاء تعبئة إسم المستخدم');
        } else if (usernameFieldStatus === UsernameAvailabilityConst.TAKEN) {
            return I19n.t('إسم المستخدم مأخوذ');
        }

        return '';
    }, [usernameFieldStatus, fieldErrors.username]);


    const onBlurUsernameField = () => {
        if (!!fieldValues.username && fieldValues.username !== '') {
            checkUserNameIfAvailable();
        }
        trackEditShopFieldFilled('username', fieldValues.username);
    };

    const onSubmitEditingUsernameField = () => {
        if (!!fieldValues.username && fieldValues.username !== '') {
            checkUserNameIfAvailable();
        }
    };

    const validate = () => {

        const fields = { ...fieldValues };
        fields.firstName = fields.firstName?.trim();
        fields.lastName = fields.lastName?.trim();

        const _fieldsErrors = validateFields(fields);
        fieldErrorsSet(_fieldsErrors);

        if (isEmptyValues(_fieldsErrors) && usernameFieldStatus === UsernameAvailabilityConst.AVAILABLE) {
            submitShop(fields);
        } else if (isEmptyValues(_fieldsErrors) && usernameFieldStatus !== UsernameAvailabilityConst.AVAILABLE) {
            checkUserNameIfAvailable()
                .then(isAvailable => {
                    if (isAvailable) {
                        submitShop(fields);
                    }
                });
        } else {
            Toast.danger(I19n.t('الرجاء تعبئة جميع الحقول بطريقة صحيحة'));
        }
    };


    const submitShop = (fields) => {
        submittingSet(true);
        (async () => {
            try {
                const inputs = new ShopEditInput();
                inputs.countryCode = selectedCountry.code;
                inputs.fields = fields;
                const result = await ShopApi.edit(inputs);
                await dispatch(authThunks.loadAuth0User());
                submittingSet(false);
                trackEditShopSuccess(trackSource);
                onHide('DONE', result);
            } catch (e) {

                shareApiError(e, 'edit profile error');

                submittingSet(false);
                (e?.data?.message) && Toast.danger(e.data.message);
                console.error(e);
                trackEditShopFailed(e?.data?.message, trackSource);

                try {
                    Sentry.captureException(e);
                } catch (x) {
                }
                try {
                    Sentry.captureMessage('[api-error] create shop from add product: ' + JSON.stringify(e));
                } catch (x) {
                }
            }
        })();
    };

    const phonePlaceholder = '00'
        + ((selectedCountry || allCountries[0])?.country_code.replace('+', '') || 'XXX')
        + 'XXXXXXXXX';

    return (
        <ScrollView
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode={'on-drag'}
            showsVerticalScrollIndicator={false}
            behavior='padding'>
            <TouchableWithoutFeedback>
                <View
                    style={style.container}>
                    <View style={style.btnView}>
                        <TouchableOpacity
                            onPress={() => onHide('CANCEL')}
                            hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
                            style={style.closeBtn}
                            activeOpacity={1}>
                            <Close fill={Colors.GREY} width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    <DzText style={style.title}>
                        {pageTitle}
                    </DzText>
                    <View style={style.fieldContainer}>
                        <Space directions={'h'} size={'lg'} />
                        <DzText style={[style.privacyHeader, LocalizedLayout.TextAlignRe(), { paddingStart: 2 }]}>
                            {I19n.t('بيانات عامة')}
                        </DzText>
                        <Space directions={'h'} size={'md'} />
                        <TextField
                            label={I19n.t('الإسم الأول')}
                            value={fieldValues.firstName}
                            onChangeText={(value) => setField('firstName', value)}
                            errorMessage={fieldErrors.firstName && I19n.t('الرجاء تعبئة الإسم الأول')}
                            textInputRef={ref => fieldsRefs.current.firstName = ref}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            inputStyle={style.textField}
                            onSubmitEditing={() => fieldsRefs.current.lastName?.focus()}
                            onBlur={() => trackEditShopFieldFilled('firstName', fieldValues.firstName)}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('الإسم الأخير')}
                            value={fieldValues.lastName}
                            onChangeText={(value) => setField('lastName', value)}
                            errorMessage={fieldErrors.lastName && I19n.t('الرجاء تعبئة الإسم الأخير')}
                            textInputRef={ref => fieldsRefs.current.lastName = ref}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            inputStyle={style.textField}
                            onSubmitEditing={() => fieldsRefs.current.storeName?.focus()}
                            onBlur={() => trackEditShopFieldFilled('lastName', fieldValues.lastName)}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('إسم المتجر')}
                            value={fieldValues.storeName?.trim()}
                            onChangeText={(value) => setField('storeName', value)}
                            errorMessage={fieldErrors.storeName && I19n.t('الرجاء تعبئة اسم متجرك')}
                            textInputRef={ref => fieldsRefs.current.storeName = ref}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            inputStyle={style.textField}
                            onSubmitEditing={() => fieldsRefs.current.username?.focus()}
                            onBlur={() => trackEditShopFieldFilled('storeName', fieldValues.storeName)}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('إسم المستخدم')}
                            value={fieldValues.username?.trim()}
                            isLoading={isValidatingUsername}
                            editable={!isValidatingUsername}
                            autoCapitalize='none'
                            onChangeText={(value) => {
                                usernameFieldStatusSet(UsernameAvailabilityConst.NONE);
                                setField('username', value?.trim().replace(/[^a-zA-Z0-9]/g, '')?.toLowerCase());
                            }}
                            errorMessage={usernameFieldErrorMsg}
                            validMessage={usernameFieldStatus === UsernameAvailabilityConst.AVAILABLE && I19n.t('إسم المستخدم متاح')}
                            textInputRef={ref => fieldsRefs.current.username = ref}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            inputStyle={style.textField}
                            onSubmitEditing={onSubmitEditingUsernameField}
                            onBlur={onBlurUsernameField}
                        />
                    </View>
                    {
                        (usernameSuggestions?.length > 0) &&
                        <View>
                            <DzText style={style.suggestionsTitle}>
                                {I19n.t('أسماء مقترحة') + ':'}
                            </DzText>
                            {
                                usernameSuggestions.map((item, index) => {
                                    return (
                                        <DzText key={'' + index}
                                                style={[style.suggestionsTitle, LocalizedLayout.TextAlignRe()]}>
                                            {item}
                                        </DzText>
                                    );
                                })
                            }
                        </View>
                    }
                    <Space directions={'h'} size={'lg'} />
                    <Space directions={'h'} size={'sm'} />
                    <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter, { paddingStart: 2 }]}>
                        <LockIcon />
                        <Space directions={'v'} size={'sm'} />
                        <DzText style={style.privacyHeader}>
                            {I19n.t('بيانات خاصة')}
                        </DzText>
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('البريد الإلكتروني')}
                            value={fieldValues.email}
                            autoCapitalize='none'
                            onChangeText={(value) => setField('email', value?.trim())}
                            errorMessage={fieldErrors.email && I19n.t('الرجاء تعبئة بريد الكتروني صحيح وفعال')}
                            textInputRef={ref => fieldsRefs.current.email = ref}
                            blurOnSubmit={false}
                            returnKeyType='next'
                            inputStyle={style.textField}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                                setTimeout(() => {
                                    fieldsRefs.current.country?.focus();
                                }, 500);
                            }}
                            onBlur={() => trackEditShopFieldFilled('email', fieldValues.email)}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <Select
                            label={I19n.t('الدولة')}
                            value={countryOptions.find(cObj => cObj['ar'] === fieldValues['country'])}
                            keyBy={'objectID'}
                            labelBy={getLocale()}
                            options={countryOptions}
                            onChange={(value) => {
                                setField('country', value['ar']);
                                trackEditShopFieldFilled('country', value[getLocale()]);
                                if (fieldsRefs.current.country.isVisibleByAutoFocus()) {
                                    setTimeout(() => {
                                        fieldsRefs.current.city?.focus();
                                    }, 500);
                                }
                            }}
                            errorMessage={fieldErrors.city && I19n.t('الرجاء إدخال الدولة')}
                            componentRef={ref => fieldsRefs.current.country = ref}
                        />
                    </View>
                    {
                        (cities.length > 0) &&
                        <View style={style.fieldContainer}>
                            <Select
                                label={I19n.t('المدينة')}
                                value={cities.find(cityObj => cityObj.name === fieldValues.city)}
                                keyBy={'objectID'}
                                labelBy={getLocale()}
                                options={cities}
                                onChange={(value) => {
                                    setField('city', value.name);
                                    trackEditShopFieldFilled('city', value.name);
                                    if (fieldsRefs.current.city.isVisibleByAutoFocus()) {
                                        setTimeout(() => {
                                            fieldsRefs.current.street?.focus();
                                            scrollViewProps?.scrollToFocusedInput(fieldsRefs.current.street, 120, 1000);
                                        }, 800);
                                    }
                                }}
                                errorMessage={fieldErrors.city && I19n.t('الرجاء إدخال المدينة')}
                                componentRef={ref => fieldsRefs.current.city = ref}
                            />
                        </View>
                    }
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('العنوان')}
                            value={fieldValues.street}
                            onChangeText={(value) => setField('street', value)}
                            textArea={true}
                            errorMessage={fieldErrors.street && I19n.t('الرجاء إدخال عنوان صحيح')}
                            textInputRef={ref => fieldsRefs.current.street = ref}
                            onBlur={() => trackEditShopFieldFilled('street', fieldValues.street)}
                            inputStyle={style.textField}
                            returnKeyType='next'
                            onSubmitEditing={() => fieldsRefs.current.mobileNumber?.focus()}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('رقم الهاتف المحمول')}
                            value={fieldValues.mobileNumber}
                            keyboardType={'numeric'}
                            onChangeText={(value) => setField('mobileNumber', value)}
                            errorMessage={fieldErrors.mobileNumber && I19n.t('الرجاء التأكد من المقدمة وإدخال رقم صحيح')}
                            textInputRef={ref => fieldsRefs.current.mobileNumber = ref}
                            blurOnSubmit={false}
                            placeholder={phonePlaceholder}
                            inputStyle={style.textField}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onSubmitEditing={() => fieldsRefs.current.whatsappNumber?.focus()}
                            onBlur={() => trackEditShopFieldFilled('mobileNumber', fieldValues.mobileNumber)}
                        />
                    </View>
                    <View style={style.fieldContainer}>
                        <TextField
                            label={I19n.t('واتساب')}
                            value={fieldValues.whatsappNumber}
                            keyboardType={'phone-pad'}
                            onChangeText={(value) => setField('whatsappNumber', value)}
                            errorMessage={fieldErrors.whatsappNumber && I19n.t('الرجاء إدخال رقم واتساب صحيح يتكون من احرف انجليزية فقط')}
                            textInputRef={ref => fieldsRefs.current.whatsappNumber = ref}
                            blurOnSubmit={false}
                            placeholder={phonePlaceholder}
                            inputStyle={style.textField}
                            onSubmitEditing={Keyboard.dismiss}
                            onBlur={() => trackEditShopFieldFilled('whatsappNumber', fieldValues.whatsappNumber)}
                        />
                    </View>
                    <Space directions={'h'} size={'md'} />
                    <Button
                        loading={submitting}
                        disabled={submitting}
                        type={ButtonOptions.Type.PRIMARY}
                        text={I19n.t('حفظ')}
                        onPress={() => validate()}
                    />
                    <Space directions={'h'} size={'lg'} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default ShopEdit;
