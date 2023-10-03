import axios from 'axios';

const LOG_REQUEST = false;

let client = axios.create();
let defaultHeader = {};

const setEnvClient = (_env) => {
    client = axios.create({
        baseURL: _env.url,
        //baseURL: 'http://192.168.0.5:3000/api', // Your local ip if running local BE server
        //baseURL: 'http://192.168.1.91:3000/api'
    });
};
export { setEnvClient as setEnvClient };

const addToRequestHeader = (key, value) => {
    defaultHeader[key] = value
};

export {addToRequestHeader as addToRequestHeader}

const HaysRequest = async function(_options) {

    const { extraOptions } = _options;

    const options = {
        ..._options,
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
    };

    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        ...defaultHeader
    };

    if (extraOptions.token) {
        options.headers.Authorization  =  'bearer ' + extraOptions.token;
    }

    if (LOG_REQUEST || extraOptions.log) {
        console.log('%c  ' + options.method + ' ==> (' + options.url + ') :','background: gray; color: #fff');
        console.log('request params' , options.params);
        console.log('request payload' , JSON.stringify(options.data));
        console.log('request options', JSON.stringify(options));
    }


    const onSuccess = function(response) {
        const data = response?.data || {};
        // debug
        if (LOG_REQUEST || extraOptions.log) {
            console.log('%c  axios response: ' + response.config.baseURL + response.config.url, 'background: green; color: #fff');
            if (response) {
                console.log(JSON.stringify(data));
            }
            console.log('%c  axios success end', 'background: green; color: #fff');
        }
        return data;
    };

    const onError = function(error) {
        const errorResponse = error?.response || {}
        // debug
        if (LOG_REQUEST || extraOptions.log) {
            console.log('%c  axios error start :', 'background: red; color: #fff');
            if (error.response) {
                console.log(error.response.status, error.response.config.baseURL + error.response.config.url);
                console.log(JSON.stringify(error.response));
            }

            console.log('%c  axios error end', 'background: red; color: #fff');
        }
        return Promise.reject(errorResponse);
    };

    return client(options)
        .then(onSuccess)
        .catch(onError);
};

export const HaysPost = (url, data, query = {}, options = {}) => {
    return HaysRequest({
        method: 'post',
        url: url,
        data: data,
        params: query,
        extraOptions : options
    })
};

export const HaysPut = (url, data, query = {},  options = {}) => {
    return HaysRequest({
        method: 'put',
        url: url,
        data: data,
        params: query,
        extraOptions : options
    })
};

export const HaysGet = (url, query = {}, options = {}) => {
    return HaysRequest({
        method: 'get',
        url: url,
        params: query,
        extraOptions : options
    })
};

export const HaysDelete = (url, query = {}, options = {}) => {
    return HaysRequest({
        method: 'delete',
        url: url,
        params: query,
        extraOptions : options
    })
};



export default HaysRequest;
