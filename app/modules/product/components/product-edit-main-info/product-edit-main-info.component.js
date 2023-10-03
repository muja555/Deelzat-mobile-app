import React, {useState, useEffect, useRef} from 'react';
import { View, Keyboard } from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

import { productEditMainInfoStyle as style } from './product-edit-main-info.component.style';
import {useDispatch, useSelector} from "react-redux";
import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import { valueOfField, createJoiValidationSchemaFromFields, getValidationErrors } from "modules/product/components/product-add/product-add.utils";

import { TextField, Select, Radio } from "deelzat/form";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import ProductFieldTypeConst from "modules/product/constants/product-field-type.const";
import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import BackSvg from "assets/icons/ArrowRight.svg";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import {LayoutStyle, LocalizedLayout} from "deelzat/style";
import I19n, {getLocale} from "dz-I19n";

const ProductEditMainInfo = (props) => {

    const {
        onNext = () => {},
    } = props;

    const dispatch = useDispatch();

    const allFields = useSelector(persistentDataSelectors.fieldsSelector);
    const productState = useSelector(productSelectors.productStateSelector);
    const [validationSchema, validationSchemaSet] = useState(null);
    const [fieldsErrors, fieldsErrorsSet] = useState({});

    const [fields, fieldsSet] = useState([]);
    const fieldRefs = useRef({})

    const getFieldError = (key) => {
        const error = fieldsErrors[key]
        if (error?.type === 'string.min' ||
            error?.type === 'string.max') {
            return error.message
        }
        else if (error) return I19n.t('هذا الحقل إلزامي');
        return '';
    };

    const focusOnNextField = (currentIndex) => {
        const nextField = fields[currentIndex + 1]

        if (!nextField)
            return
        else if (nextField.type === ProductFieldTypeConst.SELECT || nextField.type === ProductFieldTypeConst.SELECT_MULTI) {
            Keyboard.dismiss();
            if (!fieldRefs.current[currentIndex]?.isVisibleByAutoFocus || fieldRefs.current[currentIndex]?.isVisibleByAutoFocus()) {
                setTimeout(() => fieldRefs.current[currentIndex + 1]?.focus(), 800)
            }

        } else {
            fieldRefs.current[currentIndex + 1]?.focus()
        }
    }

    const fieldsContent = fields.map((item, index) => {
        const fieldValue = valueOfField(productState.fields, item.name)
        return (
            <View key={item.objectID}>
                {
                    (item.type === ProductFieldTypeConst.TEXT_FIELD) &&
                    <TextField
                        errorMessage={getFieldError(item.name)}
                        label={item[getLocale()]}
                        value={fieldValue}
                        onChangeText={(text) => setFieldValue(item.name, text)}
                        textInputRef={ref => fieldRefs.current[index] = ref}
                        returnKeyType="next"
                        inputStyle={style.inputStyle}
                        onSubmitEditing={() => focusOnNextField(index)}
                        onBlur={() =>  trackAddProductFieldFilled(item.name, fieldValue)}
                    />
                }

                {
                    (item.type === ProductFieldTypeConst.TEXT_AREA) &&
                    <TextField
                        errorMessage={getFieldError(item.name)}
                        label={item[getLocale()]}
                        value={fieldValue}
                        onChangeText={(text) => setFieldValue(item.name, text)}
                        textArea={true}
                        multiline={true}
                        numberOfLines={4}
                        textInputRef={ref => fieldRefs.current[index] = ref}
                        returnKeyType={index < fields.length - 1? 'next': 'done'}
                        inputStyle={style.inputStyle}
                        onSubmitEditing={() => focusOnNextField(index)}
                        onBlur={() =>  trackAddProductFieldFilled(item.name, fieldValue)}
                    />
                }

                {
                    (item.type === ProductFieldTypeConst.SELECT) &&
                    <Select
                        errorMessage={getFieldError(item.name)}
                        keyBy={'value'}
                        labelBy={getLocale()}
                        label={item[getLocale()]}
                        options={item.options}
                        value={fieldValue}
                        componentRef={ref => fieldRefs.current[index] = ref}
                        onChange={(text) => {
                            setFieldValue(item.name, text);
                            focusOnNextField(index);
                            trackAddProductFieldFilled(item.name, text.title)
                        }}
                    />
                }

                {
                    (item.type === ProductFieldTypeConst.SELECT_MULTI) &&
                    <Select
                        errorMessage={getFieldError(item.name)}
                        multi={true}
                        keyBy={'value'}
                        labelBy={getLocale()}
                        label={item[getLocale()]}
                        options={item.options}
                        value={fieldValue}
                        componentRef={ref => fieldRefs.current[index] = ref}
                        onChange={(text) => {
                            setFieldValue(item.name, text)
                            trackAddProductFieldFilled(item.name, text.title);
                        }}
                    />
                }

                {
                    (item.type === ProductFieldTypeConst.RADIO) &&
                    <Radio
                        errorMessage={getFieldError(item.name)}
                        keyBy={'value'}
                        labelBy={getLocale()}
                        descriptionBy={`description_${getLocale()}`}
                        label={item[getLocale()]}
                        options={item.options}
                        value={fieldValue}
                        onChange={(text) => {
                            setFieldValue(item.name, text)
                            trackAddProductFieldFilled(item.name, text.title);
                        }}
                    />
                }

                <Space size={'md'} directions={'h'} />
            </View>
        )
    });

    const setFieldValue = (key, value) => {
        const _fieldsErrors = { ...fieldsErrors };
        delete _fieldsErrors[key];
        fieldsErrorsSet(_fieldsErrors);
        dispatch(productActions.SetField({
            key: key,
            value: value
        }));
    };


    useEffect(() => {
        if (productState.referenceCategory) {
            const _fields = (productState?.referenceCategory?.fields || [])
                .map((item) => allFields[item]);
            fieldsSet(_fields);
            validationSchemaSet(createJoiValidationSchemaFromFields(_fields));
        }

    }, [allFields, productState.referenceCategory]);

    const onLocalNext = () => {

        const _fieldsErrors = getValidationErrors(validationSchema, productState.fields);
        fieldsErrorsSet(_fieldsErrors);

        if (Object.keys(_fieldsErrors).length > 0) {
            focusOnFirstErrorField(_fieldsErrors)
            return;
        }
        else {
            onNext(ProductAddStepConst.VARIANTS);
        }

    };

    const focusOnFirstErrorField = (_fieldsErrors) => {
        const firstFieldName = Object.keys(_fieldsErrors)[0]
        const firstFieldIndex = fields.findIndex(field => field.name === firstFieldName
            && (field.type === ProductFieldTypeConst.TEXT_FIELD || field.type === ProductFieldTypeConst.TEXT_AREA))

        if (firstFieldIndex !== -1) {
            fieldRefs.current[firstFieldIndex]?.focus();
        }
    }

    return (
        <View style={style.container}>
            <KeyboardAwareScrollView extraScrollHeight={50} keyboardDismissMode={'on-drag'}>
                {fieldsContent}
            </KeyboardAwareScrollView>
            <Space directions={'h'} size={'md'}/>
            <Button
                onPress={onLocalNext}
                type={ButtonOptions.Type.PRIMARY}
                separated={true}
                icon={
                    <View style={LocalizedLayout.ScaleX()}>
                        <BackSvg fill={'#fff'} width={15} height={15}/>
                    </View>
                }
                text={I19n.t('التالي')}/>
            <Space directions={'h'} size={'lg'}/>
        </View>
    );
};

export default ProductEditMainInfo;
