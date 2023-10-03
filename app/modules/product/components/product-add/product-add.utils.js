import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import ProductFieldTypeConst from "modules/product/constants/product-field-type.const";
import ProductPriceConst from "modules/product/constants/product-price.const";
import getJoi from "deelzat/joi";
import I19n from 'dz-I19n';

const getValidationErrors = (validationSchema, fields) => {

    const _fieldsErrors = {};

    if (validationSchema) {
        const result = validationSchema.validate(fields);
        if (result.error && result.error.details) {
            const details = result.error.details;
            details.forEach((item) => {
                _fieldsErrors[item.path[0]] = item;
            });
        }
    }

    return _fieldsErrors;
};
export { getValidationErrors as getValidationErrors }

const createJoiValidationSchemaFromFields = (fields) => {

    const Joi = getJoi();

    const schemaKeys = {};

    for (let fieldKey in fields ) {
        const field = fields[fieldKey];

        if (field.optional) {
            continue;
        }

        if (field.type === ProductFieldTypeConst.TEXT_FIELD) {
            schemaKeys[field.name] = Joi.object().keys({
                value: Joi.string().required().min(10).max(50)
            }).required()
                .messages({
                    'string.min': I19n.t('على إسم المنتج أن يكون  ١٠ أحرف على الأقل'),
                    'string.max': I19n.t('على إسم المنتج أن يكون ٥٠ حرف على الأكثر')
                })
                .options({ allowUnknown: true })
        } else if (field.type === ProductFieldTypeConst.TEXT_AREA) {
            schemaKeys[field.name] = Joi.object().keys({
                value: Joi.string().required().min(25).max(3000)
            }).required()
                .messages({
                    'string.min': I19n.t('على الوصف أن يكون  ٢٥ حرف على الأقل'),
                    'string.max': I19n.t('على إسم المنتج أن يكون ٦٠٠ حرف على الأكثر')
                })
                .options({ allowUnknown: true })
        }
        else if (field.type === ProductFieldTypeConst.RADIO || field.type === ProductFieldTypeConst.SELECT) {
            const validValues = field.options.map((item) => item.value);
            schemaKeys[field.name] = Joi.object().keys({
                value : Joi.object().keys({
                    value: Joi.string().valid(...validValues).required()
                }).required().options({ allowUnknown: true })
            }).required().options({ allowUnknown: true })
        }
        else if (field.type === ProductFieldTypeConst.SELECT_MULTI) {
            const validValues = field.options.map((item) => item.value);

            schemaKeys[field.name] = Joi.object().keys({
                value: Joi.array()
                    .items({
                        value: Joi.string().valid(...validValues).required()
                    }).min(1).required()
            }).required().options({ allowUnknown: true })
        }
    }

    return Joi.object().keys(schemaKeys).options({ allowUnknown: true, abortEarly: false });
};

export { createJoiValidationSchemaFromFields as createJoiValidationSchemaFromFields }

const getProductAddSteps = () => {
  return [
      ProductAddStepConst.SELECT_CATEGORY,
      ProductAddStepConst.IMAGES_EDIT,
      ProductAddStepConst.EDIT_SUB_CATEGORY,
      ProductAddStepConst.MAIN_INFO,
      ProductAddStepConst.VARIANTS,
      ProductAddStepConst.PRICES,
  ]
};
export { getProductAddSteps as getProductAddSteps };


const getProductTargets = () => {
    return [
        {
            value: 1,
            key: 1,
            nickName: I19n.t('الأطفال'),
            label: 'الأطفال'
        },
        {
            value: 2,
            key: 2,
            nickName: I19n.t('الرجال'),
            label: 'الرجال'
        },
        {
            value: 3,
            key: 3,
            nickName: I19n.t('النساء'),
            label: 'النساء'
        },
        {
            value: 4,
            key: 4,
            nickName: I19n.t('الجنسين'),
            label: 'الجنسين'
        },
    ];
};
export { getProductTargets as getProductTargets };

const getProductPriceOptions = (withSoldOutOption = false) => {
    const options = [
        {
            value: ProductPriceConst.FULL_PRICE,
            label: I19n.t('السعر الكامل'),
            icon: '💰',
        },
        {
            value: ProductPriceConst.SALE,
            label: I19n.t('خصم'),
            icon: '🔥',
        },
        {
            value: ProductPriceConst.FREE,
            label: I19n.t('مجاني'),
            icon: '🎁',
        },
    ];

    if (withSoldOutOption) {
        options.push({
            value: ProductPriceConst.SOLD_OUT,
            label: I19n.t('نفذت الكمية'),
            icon: '📛',
        })
    }

    return options;
};
export { getProductPriceOptions as getProductPriceOptions };


const valueOfField = (fields, key, defaultValue = '') => {
    return fields[key] ? fields[key].value : defaultValue;

};
export { valueOfField as valueOfField };



const getVariantPriceQuantity = (variants, option1, option2) => {

    const value = variants.find((item) => {
        return item.option1 === option1 && (item.option2 === option2 || (!item.option2 && !option2));
    });

    if (value) {
        return  { ...value }
    }

    return {
        option1: option1,
        option2: option2,
        quantity: '0',
        price: '0',
        price_sale: '0',
        _status: 'NEW'
    };
};
export { getVariantPriceQuantity as getVariantPriceQuantity };
