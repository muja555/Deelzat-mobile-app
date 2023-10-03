import {getSelectedApiName, saveSelectedApiName} from "modules/main/others/app.localstore";
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";
import {setEnvClient} from "deelzat/http";
// import {DEFAULT_API_NAME} from '@env';
import * as Actions from "modules/main/stores/app/app.actions";
import { isTestBuild } from 'modules/main/others/main-utils';

export const testThunk = (payload) => {
    return (dispatch, getState) => {
        return Promise.resolve();
    }
};


export const setupAppBaseUrl = (remoteConfig) => {
    return async (dispatch, getState) => {

        const selectedApiName = (await getSelectedApiName()) || RemoteConfigsConst.API_PROD;

        let url;
        try {
            const configEndPointsStr = remoteConfig.getString(RemoteConfigsConst.EndPoints);
            const endPoints = JSON.parse(configEndPointsStr);
            url = endPoints.find(endPoint => endPoint.name === selectedApiName).value;
        } catch (e) {
            // this the first time it runs, and hadn't reached yet the point to store the urls in remoteconfigs, manual get url
            url = RemoteConfigsConst.DefaultValues.EndPoints.find(endPoint => endPoint.name === selectedApiName).value;
        }

        setEnvClient({url});
        saveSelectedApiName(selectedApiName);

        dispatch(Actions.SetIsStagingAPI(selectedApiName !== RemoteConfigsConst.API_PROD))
        dispatch(Actions.SetIsRemoteConfigsReady(true));

        return Promise.resolve();

    }
}
