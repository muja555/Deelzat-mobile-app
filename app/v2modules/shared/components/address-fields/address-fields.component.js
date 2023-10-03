import React, {useCallback, useRef, useState} from 'react';
import { View, Platform, Keyboard } from 'react-native';

import { addressFieldsStyle as style } from './address-fields.component.style';
import {DzText} from "deelzat/v2-ui";
import {LayoutStyle, LocalizedLayout } from 'deelzat/style';
import {Select} from "deelzat/v2-form";
import {TextField} from "deelzat/v2-form";
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import {
    trackAddressFieldFilled,
} from 'modules/analytics/others/analytics.utils';
import {Space} from "deelzat/ui";
import {useSelector} from "react-redux";
import {citiesByCountrySelector} from "modules/main/stores/persistent-data/persistent-data.selectors";
import I19n, {getLocale} from 'dz-I19n';


const ROW_FIELDS_SEPARATOR = 13;
const MobileField = (props) => {
    const {
        countryCode = '',
        localNumber = '',
        fieldErrors = {},
        fieldsRefs,
        onBlurCodeField = () => {},
        onBlurNumberField = () => {},
        onFieldChange = (key, value) => {},
        onSubmitEditing = (fieldName) => {},
        onFocusInput = (event) => {}
    } = props;

    const isCodeFieldError = fieldErrors[AddressFieldNames.MOBILE_COUNTY_CODE];
    const isNumberFieldError = fieldErrors[AddressFieldNames.MOBILE_LOCAL_NUMBER];

    return (
        <View>
            <View style={style.mobileFieldContainer}>
                <TextField
                    placeholder="+970"
                    value={countryCode}
                    textInputRef={ref => fieldsRefs.current[AddressFieldNames.MOBILE_COUNTY_CODE] = ref}
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                    onSubmitEditing={() => onSubmitEditing(AddressFieldNames.MOBILE_COUNTY_CODE)}
                    inputStyle={[style.inputStyle, LocalizedLayout.TextAlignRe()]}
                    viewStyle={[style.mobileFieldCodeViewStyle, isCodeFieldError && style.inputError]}
                    onChangeText={(value) => onFieldChange(AddressFieldNames.MOBILE_COUNTY_CODE, value)}
                    keyboardType={'phone-pad'}
                    blurOnSubmit={false}
                    onBlur={onBlurCodeField}
                    onFocus={onFocusInput}/>
                <View style={{width: ROW_FIELDS_SEPARATOR}} />
                <TextField
                    placeholder='0599000000'
                    value={localNumber}
                    textInputRef={ref => fieldsRefs.current[AddressFieldNames.MOBILE_LOCAL_NUMBER] = ref}
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                    onSubmitEditing={() => onSubmitEditing(AddressFieldNames.MOBILE_LOCAL_NUMBER)}
                    inputStyle={[style.inputStyle, LocalizedLayout.TextAlignRe()]}
                    viewStyle={[style.mobileFieldInputViewStyle, isNumberFieldError && style.inputError]}
                    onChangeText={(value) => onFieldChange(AddressFieldNames.MOBILE_LOCAL_NUMBER, value.replace(/[^0-9]/g, ''))}
                    blurOnSubmit={false}
                    keyboardType={'number-pad'}
                    onBlur={onBlurNumberField}
                    onFocus={onFocusInput}/>
            </View>
            {
                (isCodeFieldError || isNumberFieldError) &&
                <DzText style={style.errorMessage}>
                    {I19n.t('الرجاء التأكد من المقدمة وإدخال رقم صحيح')}
                </DzText>
            }
        </View>
    )
}


const AddressFields = (props) => {

    const {
        trackingLabel = '',
        fields = {},
        fieldErrors = {},
        countries = [],
        onFieldChange = (key, value) => {},
        withEmailField = false,
        isFirstNameLastNameInRow = false,
        isCityCountryInRow = true,
        isStreetFieldLarge = false,
    } = props;

    const cities = useSelector(citiesByCountrySelector(fields[AddressFieldNames.COUNTRY]?.objectID));
    const fieldsRefs = useRef({});
    const [rowFieldWidth, rowFieldWidthSet] = useState(0);


    const onFieldSubmitEditing = useCallback((fromField) => {

        switch (fromField) {

            case AddressFieldNames.FIRST_NAME:
                fieldsRefs.current[AddressFieldNames.LAST_NAME]?.focus();
                break;

            case AddressFieldNames.LAST_NAME:
                if (withEmailField) {
                    fieldsRefs.current[AddressFieldNames.EMAIL]?.focus();
                }
                else if (countries.length > 1) {
                    fieldsRefs.current[AddressFieldNames.COUNTRY]?.focus();
                }
                else if (isCityCountryInRow) {
                    fieldsRefs.current[AddressFieldNames.CITY]?.focus();
                }
                else {
                    fieldsRefs.current[AddressFieldNames.MOBILE_COUNTY_CODE]?.focus();
                }
                break;

            case AddressFieldNames.EMAIL:
                if (countries.length > 1) {
                    fieldsRefs.current[AddressFieldNames.COUNTRY]?.focus();
                }
                else if (isCityCountryInRow) {
                    Keyboard.dismiss();
                    setTimeout(() => {
                        fieldsRefs.current[AddressFieldNames.COUNTRY]?.focus();
                    }, 100);
                }
                else {
                    fieldsRefs.current[AddressFieldNames.MOBILE_COUNTY_CODE]?.focus();
                }
                break;

            case AddressFieldNames.COUNTRY:
                Keyboard.dismiss();
                if (isCityCountryInRow) {
                    setTimeout(() => {
                        fieldsRefs.current[AddressFieldNames.CITY]?.focus();
                    }, 500);
                }
                else {
                    setTimeout(() => {
                        fieldsRefs.current[AddressFieldNames.MOBILE_COUNTY_CODE]?.focus();
                    }, 500);
                }
                break;

            case AddressFieldNames.MOBILE_COUNTY_CODE:
                fieldsRefs.current[AddressFieldNames.MOBILE_LOCAL_NUMBER]?.focus();
                break;

            case AddressFieldNames.MOBILE_LOCAL_NUMBER:
                if (isCityCountryInRow) {
                    fieldsRefs.current[AddressFieldNames.ADDRESS]?.focus();
                }
                else {
                    fieldsRefs.current[AddressFieldNames.CITY]?.focus();
                }
                break;

            case AddressFieldNames.CITY:
                if (isCityCountryInRow) {
                    setTimeout(() => {
                        fieldsRefs.current[AddressFieldNames.MOBILE_COUNTY_CODE]?.focus();
                    }, 500);
                }
                else {
                    fieldsRefs.current[AddressFieldNames.ADDRESS]?.focus();
                }
                break;
        }
    }, [countries.length]);


    const onLayout = useCallback(({ nativeEvent: { layout: { width } } }) => {
        rowFieldWidthSet((width - ROW_FIELDS_SEPARATOR) / 2);
    }, []);


    const firstNameField = (
        <TextField
            placeholder={I19n.t('الإسم الأول')}
            value={fields[AddressFieldNames.FIRST_NAME]}
            textInputRef={ref => fieldsRefs.current[AddressFieldNames.FIRST_NAME] = ref}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => onFieldSubmitEditing(AddressFieldNames.FIRST_NAME)}
            inputStyle={[
                style.inputStyle,
                fieldErrors[AddressFieldNames.FIRST_NAME] && style.inputError
            ]}
            onChangeText={(value) => onFieldChange(AddressFieldNames.FIRST_NAME, value)}
            onBlur={() => trackAddressFieldFilled(AddressFieldNames.FIRST_NAME, fields[AddressFieldNames.FIRST_NAME], trackingLabel)}
            errorMessage={fieldErrors[AddressFieldNames.FIRST_NAME] && I19n.t('الرجاء تعبئة الإسم الأول')} />
    );

    const lastNameField = (
        <TextField
            placeholder={I19n.t('الإسم الأخير')}
            value={fields[AddressFieldNames.LAST_NAME]}
            textInputRef={ref => fieldsRefs.current[AddressFieldNames.LAST_NAME] = ref}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => onFieldSubmitEditing(AddressFieldNames.LAST_NAME)}
            inputStyle={[
                style.inputStyle,
                fieldErrors[AddressFieldNames.LAST_NAME] && style.inputError
            ]}
            onChangeText={(value) => onFieldChange(AddressFieldNames.LAST_NAME, value)}
            onBlur={() => trackAddressFieldFilled(AddressFieldNames.LAST_NAME, fields[AddressFieldNames.LAST_NAME], trackingLabel)}
            errorMessage={fieldErrors[AddressFieldNames.LAST_NAME] && I19n.t('الرجاء تعبئة الإسم الأخير')} />
    );

    const emailField = (
        <TextField
            placeholder={I19n.t('البريد الإلكتروني')}
            value={fields[AddressFieldNames.EMAIL]}
            textInputRef={ref => fieldsRefs.current[AddressFieldNames.EMAIL] = ref}
            returnKeyType={'next'}
            autoCapitalize="none"
            onSubmitEditing={() => onFieldSubmitEditing(AddressFieldNames.EMAIL)}
            inputStyle={[style.inputStyle, fieldErrors[AddressFieldNames.EMAIL] && style.inputError]}
            onChangeText={(value) => onFieldChange(AddressFieldNames.EMAIL, value?.trim())}
            onBlur={() => trackAddressFieldFilled(AddressFieldNames.EMAIL, fields[AddressFieldNames.EMAIL], trackingLabel)}
            errorMessage={fieldErrors[AddressFieldNames.EMAIL] && I19n.t('الرجاء تعبئة بريد الكتروني صحيح وفعال')} />
    );

    const countryField = (
        <Select
            label={I19n.t('اختيار الدولة')}
            placeholder={I19n.t('الدولة')}
            value={fields[AddressFieldNames.COUNTRY]}
            ref={ref => fieldsRefs.current[AddressFieldNames.COUNTRY] = ref}
            keyBy={"objectID"}
            errorColorOnError={true}
            labelBy={getLocale()}
            options={countries}
            onChange={(value) => {
                onFieldChange(AddressFieldNames.COUNTRY, value);
                trackAddressFieldFilled(AddressFieldNames.COUNTRY, value?.title, trackingLabel);
                if (fieldsRefs.current[AddressFieldNames.COUNTRY].isVisibleByAutoFocus()) {
                    onFieldSubmitEditing(AddressFieldNames.COUNTRY);
                }
            }}
            errorMessage={fieldErrors[AddressFieldNames.COUNTRY] && I19n.t('الرجاء إدخال الدولة')}/>
    );


    const mobileField = (
        <MobileField
            countryCode={fields[AddressFieldNames.MOBILE_COUNTY_CODE]}
            localNumber={fields[AddressFieldNames.MOBILE_LOCAL_NUMBER]}
            fieldsRefs={fieldsRefs}
            fieldErrors={fieldErrors}
            onFieldChange={onFieldChange}
            onSubmitEditing={onFieldSubmitEditing}
            onBlurCodeField={() => trackAddressFieldFilled(AddressFieldNames.MOBILE_COUNTY_CODE, fields[AddressFieldNames.MOBILE_COUNTY_CODE], trackingLabel)}
            onBlurNumberField={() => trackAddressFieldFilled(AddressFieldNames.MOBILE_LOCAL_NUMBER, fields[AddressFieldNames.MOBILE_LOCAL_NUMBER], trackingLabel)} />
    );


    const cityField = (
        <>
            {
                (cities.length > 1) &&
                <Select
                    label={I19n.t('اختيار المدينة')}
                    placeholder={I19n.t('المدينة')}
                    value={cities.find(cityObj => cityObj.name === fields[AddressFieldNames.CITY]?.name)}
                    ref={ref => fieldsRefs.current[AddressFieldNames.CITY] = ref}
                    keyBy={"objectID"}
                    errorColorOnError={true}
                    labelBy={getLocale()}
                    options={cities}
                    onChange={(value) => {
                        onFieldChange(AddressFieldNames.CITY, value);
                        trackAddressFieldFilled(AddressFieldNames.CITY, value?.name, trackingLabel);
                        if (fieldsRefs.current[AddressFieldNames.CITY].isVisibleByAutoFocus())
                            onFieldSubmitEditing(AddressFieldNames.CITY);
                    }}
                    errorMessage={fieldErrors[AddressFieldNames.CITY] && I19n.t('الرجاء إدخال المدينة')}/>
            }
            {
                (cities.length <= 1) &&
                <TextField
                    label={I19n.t('المدينة')}
                    placeholder={I19n.t('المدينة')}
                    value={fields[AddressFieldNames.CITY]?.name}
                    textInputRef={ref => fieldsRefs.current[AddressFieldNames.CITY] = ref}
                    blurOnSubmit={false}
                    onBlur={() => trackAddressFieldFilled(AddressFieldNames.CITY, fields[AddressFieldNames.CITY]?.name, trackingLabel)}
                    returnKeyType="next"
                    onSubmitEditing={() => onFieldSubmitEditing(AddressFieldNames.CITY)}
                    inputStyle={[style.inputStyle, fieldErrors[AddressFieldNames.CITY] && style.inputError]}
                    onChangeText={(value) => onFieldChange(AddressFieldNames.CITY, {name: value})}
                    errorMessage={fieldErrors[AddressFieldNames.CITY] && I19n.t('الرجاء تعبئة المدينة')} />
            }
        </>
    );


    const addressField = (
        <TextField
            placeholder={I19n.t('العنوان')}
            value={fields[AddressFieldNames.ADDRESS]}
            textInputRef={ref => fieldsRefs.current[AddressFieldNames.ADDRESS] = ref}
            blurOnSubmit={false}
            keyboardType="default"
            inputStyle={[
                style.inputStyle,
                !isStreetFieldLarge && style.inputAreaStyle,
                fieldErrors[AddressFieldNames.ADDRESS] && style.inputError]}
            onChangeText={(text) => onFieldChange(AddressFieldNames.ADDRESS, text)}
            textArea={true}
            viewStyle={{height: isStreetFieldLarge? 97: 65}}
            multiline={true}
            numberOfLines={10}
            onBlur={() => trackAddressFieldFilled(AddressFieldNames.ADDRESS, fields[AddressFieldNames.ADDRESS], trackingLabel)}
            errorMessage={fieldErrors[AddressFieldNames.ADDRESS] && I19n.t('الرجاء تعبئة عنوان يتكون من ١٠ أحرف على الأقل')} />
    );


    return (
        <View onLayout={onLayout}>
            {/* first & last name */}
            {
                (isFirstNameLastNameInRow) &&
                <View style={LayoutStyle.Row}>
                    <View style={isFirstNameLastNameInRow && {width: rowFieldWidth}}>
                        {firstNameField}
                    </View>
                    <View style={{width: ROW_FIELDS_SEPARATOR}} />
                    <View style={isFirstNameLastNameInRow && {width: rowFieldWidth}}>
                        {lastNameField}
                    </View>
                </View>
            }
            {
                (!isFirstNameLastNameInRow) &&
                    <>
                        {firstNameField}
                        <Space directions={'h'} size={'md'}/>
                        {lastNameField}
                    </>
            }

            {/* email */}
            {
                (withEmailField) &&
                <>
                    <Space directions={'h'} size={'md'}/>
                    {emailField}
                </>
            }

            {/* country city mobile address */}
            {
                (isCityCountryInRow) &&
                    <>
                        <Space directions={'h'} size={'md'}/>
                        <View style={LayoutStyle.Row}>
                            <View style={{width: rowFieldWidth}}>
                                {countryField}
                            </View>
                            <View style={{width: ROW_FIELDS_SEPARATOR}} />
                            <View style={{width: rowFieldWidth}}>
                                {cityField}
                            </View>
                        </View>
                        <Space directions={'h'} size={'md'}/>
                        {mobileField}
                        <Space directions={'h'} size={'md'}/>
                        {addressField}
                    </>
            }
            {
                (!isCityCountryInRow) &&
                    <>
                        <Space directions={'h'} size={'md'}/>
                        {countryField}
                        <Space directions={'h'} size={'md'}/>
                        {mobileField}
                        <Space directions={'h'} size={'md'}/>
                        {cityField}
                        <Space directions={'h'} size={'md'}/>
                        {addressField}
                    </>
            }
        </View>
    );
};

export default AddressFields;
