import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

const CACHE = {};

const fetchCached = (url, isJSON = true) => {

    if (!url) {
        return Promise.resolve();
    }

    const key = `@FetchCache:${url}`;

    if (!!CACHE[key]) {
        return Promise.resolve(CACHE[key]);
    }

    return AsyncStorage.getItem(key)
        .then(data => {
            if (!data) {
                return Promise.reject("no data found in async storage");
            }
            const _res = isJSON? JSON.parse(data): data;
            CACHE[key] = _res;
            return _res;
        })
        .catch((e) => {
            return fetch(url).then(response => {
                if (response.ok) {
                    return (isJSON? response.json(): response.text()).then(data => {
                        const _res = isJSON? JSON.stringify(data): data;
                        CACHE[key] = _res;
                        AsyncStorage.setItem(key, _res);
                        return _res;
                    });
                }
                return Promise.reject("unable to load data");
            });
        });
};

export {fetchCached as fetchCached}


const useFetch = (url, isJSON = true) => {
    const [data, dataSet] = useState();

    useEffect(() => {
        if (url) {
            fetchCached(url, isJSON)
                .then(dataSet)
                .catch(console.warn);
        }
    }, [url]);

    return data;
};

export {useFetch as useFetch}
