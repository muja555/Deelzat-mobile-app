import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Keyboard, Platform, ScrollView, PanResponder, TouchableWithoutFeedback } from 'react-native';

import { editProfileStyle as style } from './edit-profile.component.style';
import EditProfileField from 'v2modules/shop/components/edit-profile-field/edit-profile-field.component';
import EditProfileSelect from 'v2modules/shop/components/edit-profile-select/edit-profile-select.component';
import { Space } from 'deelzat/ui';
import { DzText } from 'deelzat/v2-ui';
import { LayoutStyle, LocalizedLayout } from 'deelzat/style';
import I19n, { getLocale } from 'dz-I19n';
import { trackEditShopFieldFilled } from 'modules/analytics/others/analytics.utils';
import UsernameAvailabilityConst from 'v2modules/shop/constants/username-availability.const';
import LockIcon from 'assets/icons/LockFilled.svg';
import { useSelector } from 'react-redux';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import GetShopByUsernameInput from 'v2modules/shop/inputs/get-shop-by-username.input';
import ShopApiV2 from 'v2modules/shop/apis/shop.api';
import GetAvailableUsernamesInput from 'v2modules/shop/inputs/get-available-usernames.input';
import EditProfileFieldName from 'v2modules/shop/constants/edit-profile-field-names.const';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

const EditProfile = React.forwardRef((props, ref) => {
    const {
        userId,
        fieldValues = {},
        fieldErrors = {},
        showShopNameField = false,
        onFocusField = () => {
        },
        setField = () => {
        },
    } = props;


    useImperativeHandle(ref, () => ({
        getDefaultCountry: () => defaultCountry,
        getSelectedCountry: () => selectedCountry,
        getUsernameFieldStatus: () => usernameFieldStatus,
        checkUserNameIfAvailable: checkUserNameIfAvailable,
    }));


    const geoCountryCode = useSelector(geoSelectors.geoCountryCodeSelector);
    const allCountries = useSelector(persistentDataSelectors.shippableCountriesSelector);

    const [isValidatingUsername, isValidatingUsernameSet] = useState(false);
    const [usernameSuggestions, usernameSuggestionsSet] = useState([]);
    const [usernameFieldStatus, usernameFieldStatusSet] = useState(UsernameAvailabilityConst.NONE);

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
        const fieldKeys = Object.keys(fieldErrors || {});
        if (fieldKeys?.length > 0) {
            fieldsRefs.current[fieldKeys[0]]?.focus();
        }
    }, [fieldErrors]);


    const defaultCountry = useMemo(() => {
        return allCountries.find((c) => c.code === geoCountryCode);
    }, [allCountries, geoCountryCode]);


    const [selectedCountry, phonePlaceholder] = useMemo(() => {
        const _selectedCountry = allCountries.find((cObj) => cObj['ar'] === fieldValues[EditProfileFieldName.COUNTRY]) || defaultCountry;
        const _phonePlaceholder =
            '00' +
            ((_selectedCountry || allCountries[0])?.country_code.replace('+', '') || 'XXX') +
            'XXXXXXXXX';
        return [_selectedCountry, _phonePlaceholder];
    }, [allCountries, fieldValues[EditProfileFieldName.COUNTRY], defaultCountry]);


    const cities = useSelector(
        selectedCountry
            ? persistentDataSelectors.citiesByCountrySelector(selectedCountry.objectID)
            : () => [],
    );


    const countryOptions = useMemo(() => {
        // Generate country options
        const list = allCountries.filter((country) => country.code === geoCountryCode);

        let _countryOptions = list.length > 0 ? list : allCountries;

        // If user is not in any supported markets, display all of them instead
        let _options = list.length > 0 ? list : allCountries;
        if (selectedCountry && !_countryOptions.find((c) => c.objectID === selectedCountry.objectID)) {
            // If selected country is not from the options, make it the only options
            // It means: shop has been created in different geo location than current. thus it will never change
            _options = [selectedCountry];
        }

        return _options;
    }, [allCountries, geoCountryCode, selectedCountry]);


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
        const username = fieldValues[EditProfileFieldName.USERNAME];
        isValidatingUsernameSet(true);
        usernameSuggestionsSet([]);

        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const inputs = new GetShopByUsernameInput();
                    inputs.username = username;
                    const result = await ShopApiV2.getShopByUsername(inputs);

                    if (
                        result?.users_ids?.length > 0 &&
                        result?.users_ids[0] === userId
                    ) {
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
        if (fieldErrors[EditProfileFieldName.USERNAME]) {
            return I19n.t('الرجاء تعبئة إسم المستخدم');
        } else if (usernameFieldStatus === UsernameAvailabilityConst.TAKEN) {
            return I19n.t('إسم المستخدم مأخوذ');
        }

        return '';
    }, [usernameFieldStatus, fieldErrors[EditProfileFieldName.USERNAME]]);


    const disableCheckingUserName = useRef(false);

    const onBlurUsernameField = () => {
        if (!disableCheckingUserName.current
            && !!fieldValues[EditProfileFieldName.USERNAME]) {
            checkUserNameIfAvailable();
        }
        trackEditShopFieldFilled(EditProfileFieldName.USERNAME, fieldValues[EditProfileFieldName.USERNAME]);
    };


    const onSubmitEditingUsernameField = () => {
        if (!!fieldValues[EditProfileFieldName.USERNAME]) {
            fieldsRefs.current[EditProfileFieldName.EMAIL]?.focus();
            disableCheckingUserName.current = true;

            checkUserNameIfAvailable()
                .then((isAvailable) => {
                    if (isAvailable) {
                        fieldsRefs.current[EditProfileFieldName.EMAIL]?.focus();
                    }
                })
                .finally(() => {
                    disableCheckingUserName.current = false;
                });
        }
    };



    return (
        <ScrollView
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode={'on-drag'}
            showsVerticalScrollIndicator={false}
            behavior='padding'>
            <TouchableWithoutFeedback>
                <View>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={[style.privacyHeader, LocalizedLayout.TextAlignRe(), { paddingStart: 5 }]}>
                        {I19n.t('بيانات عامة')}
                    </DzText>
                    <Space directions={'h'} size={'md'} />
                    <EditProfileField
                        label={I19n.t('الإسم الأول')}
                        value={fieldValues[EditProfileFieldName.FIRST_NAME]}
                        errorMessage={fieldErrors[EditProfileFieldName.FIRST_NAME] && I19n.t('الرجاء تعبئة الإسم الأول')}
                        onChangeText={(value) => setField(EditProfileFieldName.FIRST_NAME, value)}
                        placeholder={'Deel Deel'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.FIRST_NAME] = _ref)}
                        onBlur={() => trackEditShopFieldFilled(EditProfileFieldName.FIRST_NAME, fieldValues[EditProfileFieldName.FIRST_NAME])}
                        onSubmitEditing={() => {
                            fieldsRefs.current[EditProfileFieldName.LAST_NAME]?.focus();
                        }}
                    />
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('الإسم الأخير')}
                        value={fieldValues[EditProfileFieldName.LAST_NAME]}
                        errorMessage={fieldErrors[EditProfileFieldName.LAST_NAME] && I19n.t('الرجاء تعبئة الإسم الأخير')}
                        onChangeText={(value) => setField(EditProfileFieldName.LAST_NAME, value)}
                        placeholder={'Deel Deel'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.LAST_NAME] = _ref)}
                        onBlur={() => trackEditShopFieldFilled(EditProfileFieldName.LAST_NAME, fieldValues[EditProfileFieldName.LAST_NAME])}
                        onSubmitEditing={() => {
                            if (showShopNameField) {
                                fieldsRefs.current[EditProfileFieldName.STORE_NAME]?.focus();
                            } else {
                                fieldsRefs.current[EditProfileFieldName.USERNAME]?.focus();
                            }
                        }}
                    />
                    {showShopNameField && (
                        <>
                            <Space directions={'h'} size={['xs', '']} />
                            <EditProfileField
                                label={I19n.t('إسم المتجر')}
                                value={fieldValues[EditProfileFieldName.STORE_NAME]}
                                errorMessage={fieldErrors[EditProfileFieldName.STORE_NAME] && I19n.t('الرجاء تعبئة اسم متجرك')}
                                onChangeText={(value) => setField(EditProfileFieldName.STORE_NAME, value)}
                                placeholder={'Deel Shop'}
                                returnKeyType='next'
                                blurOnSubmit={false}
                                onFocus={onFocusField}
                                textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.STORE_NAME] = _ref)}
                                onBlur={() =>
                                    trackEditShopFieldFilled(EditProfileFieldName.STORE_NAME, fieldValues[EditProfileFieldName.STORE_NAME])
                                }
                                onSubmitEditing={() => {
                                    fieldsRefs.current[EditProfileFieldName.USERNAME]?.focus();
                                }}
                            />
                        </>
                    )}
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('إسم المستخدم')}
                        value={fieldValues[EditProfileFieldName.USERNAME]?.trim()}
                        errorMessage={usernameFieldErrorMsg}
                        onChangeText={(value) => {
                            usernameFieldStatusSet(UsernameAvailabilityConst.NONE);
                            setField(
                                EditProfileFieldName.USERNAME,
                                value
                                    ?.trim()
                                    ?.replace(/[^a-zA-Z0-9]/g, '')
                                    ?.toLowerCase(),
                            );
                        }}
                        isLoading={isValidatingUsername}
                        editable={!isValidatingUsername}
                        validMessage={
                            usernameFieldStatus === UsernameAvailabilityConst.AVAILABLE &&
                            I19n.t('إسم المستخدم متاح')
                        }
                        placeholder={'example123'}
                        autoCapitalize='none'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.USERNAME] = _ref)}
                        onBlur={onBlurUsernameField}
                        onSubmitEditing={onSubmitEditingUsernameField}
                    />
                    {usernameSuggestions?.length > 0 && (
                        <View>
                            <DzText style={style.suggestionsTitle}>{I19n.t('أسماء مقترحة') + ':'}</DzText>
                            {usernameSuggestions.map((item, index) => {
                                return (
                                    <DzText
                                        key={'' + index}
                                        style={[style.suggestionsTitle, LocalizedLayout.TextAlignRe()]}
                                    >
                                        {item}
                                    </DzText>
                                );
                            })}
                        </View>
                    )}
                    <Space directions={'h'} size={['xs', '']} />
                    <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter, { paddingStart: 5 }]}>
                        <LockIcon />
                        <Space directions={'v'} size={'sm'} />
                        <DzText style={style.privacyHeader}>{I19n.t('بيانات خاصة')}</DzText>
                    </View>
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('البريد الإلكتروني')}
                        value={fieldValues[EditProfileFieldName.EMAIL]}
                        errorMessage={
                            fieldErrors[EditProfileFieldName.EMAIL] && I19n.t('الرجاء تعبئة بريد الكتروني صحيح وفعال')
                        }
                        onChangeText={(value) => setField(EditProfileFieldName.EMAIL, value)}
                        placeholder={'Deelzat@customer.com'}
                        autoCapitalize='none'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.EMAIL] = _ref)}
                        onBlur={() => trackEditShopFieldFilled(EditProfileFieldName.EMAIL, fieldValues[EditProfileFieldName.EMAIL])}
                        onSubmitEditing={() => {
                            Keyboard.dismiss();
                            setTimeout(() => {
                                fieldsRefs.current[EditProfileFieldName.COUNTRY]?.focus();
                            }, 1000);
                        }}
                    />
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileSelect
                        label={I19n.t('الدولة')}
                        placeholder={I19n.t('اختيار الدولة')}
                        value={countryOptions.find((cObj) => cObj['ar'] === fieldValues[EditProfileFieldName.COUNTRY])}
                        errorMessage={fieldErrors[EditProfileFieldName.COUNTRY] && I19n.t('الرجاء إدخال الدولة')}
                        keyBy={'objectID'}
                        labelBy={getLocale()}
                        ref={(_ref) => (fieldsRefs.current[EditProfileFieldName.COUNTRY] = _ref)}
                        onChange={(value) => {
                            onFocusField();
                            setField('country', value['ar']);
                            trackEditShopFieldFilled('country', value[getLocale()]);
                            if (fieldsRefs.current[EditProfileFieldName.COUNTRY].isVisibleByAutoFocus()) {
                                setTimeout(() => {
                                    fieldsRefs.current[EditProfileFieldName.CITY]?.focus();
                                }, 1000);
                            }
                        }}
                        options={countryOptions}
                    />
                    {cities.length > 0 && (
                        <>
                            <Space directions={'h'} size={['xs', '']} />
                            <EditProfileSelect
                                label={I19n.t('المدينة')}
                                placeholder={I19n.t('اختيار المدينة')}
                                value={cities.find((cityObj) => cityObj['ar'] === fieldValues[EditProfileFieldName.CITY])}
                                errorMessage={fieldErrors[EditProfileFieldName.CITY] && I19n.t('الرجاء إدخال المدينة')}
                                keyBy={'objectID'}
                                labelBy={getLocale()}
                                ref={(_ref) => (fieldsRefs.current[EditProfileFieldName.CITY] = _ref)}
                                onChange={(value) => {
                                    onFocusField();
                                    setField('city', value['ar']);
                                    trackEditShopFieldFilled('city', value[getLocale()]);
                                    if (fieldsRefs.current[EditProfileFieldName.CITY].isVisibleByAutoFocus()) {
                                        setTimeout(() => {
                                            fieldsRefs.current[EditProfileFieldName.STREET]?.focus();
                                        }, 1000);
                                    }
                                }}
                                options={cities}
                            />
                        </>
                    )}
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('العنوان')}
                        textArea={true}
                        value={fieldValues[EditProfileFieldName.STREET]}
                        errorMessage={fieldErrors[EditProfileFieldName.STREET] && I19n.t('الرجاء إدخال عنوان صحيح')}
                        onChangeText={(value) => setField(EditProfileFieldName.STREET, value)}
                        placeholder={I19n.t('اكتب عنوانك')}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.STREET] = _ref)}
                        onBlur={() => trackEditShopFieldFilled(EditProfileFieldName.STREET, fieldValues[EditProfileFieldName.STREET])}
                        onSubmitEditing={() => {
                            fieldsRefs.current[EditProfileFieldName.MOBILE_NUM]?.focus();
                        }}
                    />
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('رقم الهاتف المحمول')}
                        value={fieldValues[EditProfileFieldName.MOBILE_NUM]}
                        keyboardType={'numeric'}
                        errorMessage={
                            fieldErrors[EditProfileFieldName.MOBILE_NUM] && I19n.t('الرجاء التأكد من المقدمة وإدخال رقم صحيح')
                        }
                        onChangeText={(value) => setField(EditProfileFieldName.MOBILE_NUM, value)}
                        placeholder={phonePlaceholder}
                        returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                        blurOnSubmit={false}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.MOBILE_NUM] = _ref)}
                        onBlur={() => trackEditShopFieldFilled(EditProfileFieldName.MOBILE_NUM, fieldValues[EditProfileFieldName.MOBILE_NUM])}
                        onSubmitEditing={() => {
                            fieldsRefs.current[EditProfileFieldName.WHATSAPP_NUM]?.focus();
                        }}
                    />
                    <Space directions={'h'} size={['xs', '']} />
                    <EditProfileField
                        label={I19n.t('واتساب')}
                        value={fieldValues[EditProfileFieldName.WHATSAPP_NUM]}
                        keyboardType={'numeric'}
                        errorMessage={
                            fieldErrors[EditProfileFieldName.WHATSAPP_NUM] &&
                            I19n.t('الرجاء إدخال رقم واتساب صحيح يتكون من احرف انجليزية فقط')
                        }
                        onChangeText={(value) => setField(EditProfileFieldName.WHATSAPP_NUM, value)}
                        placeholder={phonePlaceholder}
                        returnKeyType='done'
                        blurOnSubmit={true}
                        onFocus={onFocusField}
                        textInputRef={(_ref) => (fieldsRefs.current[EditProfileFieldName.WHATSAPP_NUM] = _ref)}
                        onBlur={() =>
                            trackEditShopFieldFilled(EditProfileFieldName.WHATSAPP_NUM, fieldValues[EditProfileFieldName.WHATSAPP_NUM])
                        }
                    />
                    <Space directions={'h'} size={'lg'} />
                    <Space directions={'h'} size={'lg'} />
                    <Space directions={'h'} size={'lg'} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
});

export default EditProfile;
