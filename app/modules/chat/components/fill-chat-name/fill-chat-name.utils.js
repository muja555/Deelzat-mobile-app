import getJoi from "deelzat/joi";
import ChatInfoFieldConst from "modules/chat/constants/chat-info-field.const";


const getValidationSchema = () => {

    const Joi = getJoi()

    const fieldKeys = {
        [ChatInfoFieldConst.FIRST_NAME]: Joi.string().required().messages({
            'any.required': 'الرجاء تعبئة الإسم الأول',
        }),
        [ChatInfoFieldConst.LAST_NAME]: Joi.string().required().messages({
            'any.required': 'الرجاء تعبئة إسم العائلة'
        }),
    };

    return Joi.object().keys(fieldKeys).options({ allowUnknown: true, abortEarly: false });
}
export {getValidationSchema as getValidationSchema}


const validateFields = (fields) => {

    const fieldsErrors = {}

    const result = getValidationSchema().validate(fields);
    if (result.error && result.error.details) {
        const details = result.error.details;
        details.forEach((item) => {
            fieldsErrors[item.path[0]] = item.message;
        });
    }
    return fieldsErrors
}
export { validateFields as validateFields}
