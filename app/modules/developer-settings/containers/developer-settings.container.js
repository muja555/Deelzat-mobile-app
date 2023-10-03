import React, {useEffect, useState} from 'react';
import {remoteConfig} from 'modules/root/components/remote-configs/remote-configs.component';

import RemoteConfigsConst from "modules/root/constants/remote-configs.const";
import {SafeAreaView} from "react-native";
import {developerSettingsContainerStyle as style} from './developer-settings.container.style'
import DeveloperSettings from "modules/developer-settings/components/developer-settings/developer-settings.component";
import WillShowToast from "deelzat/toast/will-show-toast";


const DeveloperSettingsContainer = () => {

    const [endPoints, endPointsSet] = useState([]);

    useEffect(() => {
        const endPointsList = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.EndPoints).asString());
        endPointsSet(endPointsList);
    }, []);

    return (
        <SafeAreaView style={style.container}>
            <WillShowToast id={'developer'}/>
            <DeveloperSettings endPoints={endPoints}/>
        </SafeAreaView>
    )
}

export default DeveloperSettingsContainer;
