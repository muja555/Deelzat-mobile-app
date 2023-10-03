import 'text-encoding-polyfill'
let _Joi
const getJoi = () => {
    if (!_Joi) {
        _Joi = require('@hapi/joi')
    }
    return _Joi
}
export default getJoi
