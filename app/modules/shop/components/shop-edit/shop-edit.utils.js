import getJoi from "deelzat/joi";
import {EMAIL_REGEX} from "deelzat/validation";
import {isValidMobile} from "modules/main/others/phone.utils";

const getValidationSchema = () => {
    const Joi = getJoi();
    return Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        storeName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().regex(EMAIL_REGEX)
            .required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        street: Joi.string().required(),
    });
}

const validateFields = (fieldValues) => {
    const _fieldsErrors = {};
    const result = getValidationSchema().validate(fieldValues, {abortEarly: false, allowUnknown: true});
    const isValidMobileNum = isValidMobile(fieldValues.mobileNumber)
    const isValidWhatsappNum = isValidMobile(fieldValues.whatsappNumber)
    if (!!result?.error?.details || !isValidMobileNum || !isValidWhatsappNum) {
        if (!!result?.error?.details) {
            const details = result.error.details;
            details.forEach((item) => {
                _fieldsErrors[item.path[0]] = item.message;
            });
        }
        if (!isValidMobileNum) _fieldsErrors.mobileNumber = '~'
        if (!isValidWhatsappNum) _fieldsErrors.whatsappNumber = '~'
        return _fieldsErrors
    } else {
       return {}
    }
}

export {validateFields as validateFields}
