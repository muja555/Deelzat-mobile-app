import React, { useEffect, useState } from 'react';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import makeRemoteConfig from '@react-native-firebase/remote-config';
import VersionCheck from "react-native-version-check";
import {isAppOutdated, showUpdateAppDialog} from "./remote-configs.component.utils";
import {appThunks} from "modules/main/stores/app/app.store";
import {useDispatch} from "react-redux";
import {chatThunks} from "modules/chat/stores/chat/chat.store";
import FastImage from '@deelzat/react-native-fast-image';
import { isTestBuild, refactorImageUrl } from 'modules/main/others/main-utils';

export const remoteConfig = makeRemoteConfig();

const RemoteConfigs = () => {

    const dispatch = useDispatch();

    const checkUpdateNeeded = async () => {
        const versionCheck = await VersionCheck.needUpdate();
        const thisVersion = versionCheck?.currentVersion;
        const versionOptions = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.UpcomingVersion)?.asString());
        const remoteVersion = versionOptions?.versionNumber;
        const isForceUpdate = versionOptions?.isForceUpdate;

        if (isAppOutdated(thisVersion, remoteVersion)) {
            showUpdateAppDialog(isForceUpdate, versionCheck.storeUrl)
        }
    };

    const onActivateConfigs = (activated) => {
        dispatch(chatThunks.setupSupportAccount(remoteConfig))
        dispatch(appThunks.setupAppBaseUrl(remoteConfig));
        checkUpdateNeeded();

        // PreLoad themes
        const allThemes = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.PROFILE_THEMES).asString());
        FastImage.preload(allThemes.map(theme => ({
            uri: refactorImageUrl(theme.background_url, 0)
        })));

        FastImage.preload(allThemes.map(theme => ({
            uri: refactorImageUrl(theme.preview_url, 0),
        })));
    }

    useEffect(() => {

        remoteConfig
            .setDefaults(RemoteConfigsConst.DefaultValues)
            .then(() => remoteConfig.fetchAndActivate())
            .then(onActivateConfigs)
            .catch((error) => {
                console.warn(error);
                dispatch(appThunks.setupAppBaseUrl(remoteConfig));
            });
        remoteConfig.setConfigSettings({
            minimumFetchIntervalMillis: isTestBuild()? 0 : 3600000,
        });

    }, []);

    return <></>
}

export default RemoteConfigs;
