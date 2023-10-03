import {appVersionStyle as style} from './app-version.component.style';
import React, {useState} from 'react';
import {Text, TouchableOpacity} from "react-native";
import DeviceInfo from "react-native-device-info";
import Toast from "deelzat/toast";
import prompt from 'react-native-prompt-android';
import AuthModalService from "modules/auth/modals/auth/auth.modal.service";
import {useSelector} from "react-redux";
import {appSelectors} from "modules/main/stores/app/app.store";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import NavigationService from "v2modules/main/others/navigation.service";
import {LayoutStyle} from "deelzat/style";
import Clipboard from "@react-native-clipboard/clipboard";
import {DzText} from "deelzat/v2-ui";

const numberOfClicks = 10;
const settingsPassword = "1100";

const AppVersion = (props) => {

    const {
        onShowDevOptions = () => {}
    } = props

    const [secretCount, secretCountSet] = useState(0);
    const isStagingApi = useSelector(appSelectors.isStagingAPISelector);

    const onShowPasswordDialog = () => {

        prompt(
            '',
            '',
            [
                {
                    text: 'Cancel', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: password => {
                        if (password === settingsPassword) {
                            AuthModalService.setVisible({
                                show: false,
                            })
                            onShowDevOptions()
                            NavigationService.navigateTo({key: MainStackNavsConst.SECRET_SETTINGS});
                        }
                    }
                },
            ],
            {
                type: 'secure-text',
                cancelable: false,
                defaultValue: 'test',
                placeholder: 'placeholder'
            }
        );

    }

    const onPress = () => {
        secretCountSet(secretCount + 1);

        if (secretCount >= numberOfClicks) {
            secretCountSet(0);
            onShowPasswordDialog();
        }
    };

    const deviceId = DeviceInfo.getUniqueId();
    const onLongPressDeviceId = () => {
        Clipboard.setString(deviceId);
        Toast.info("تم نسخ الرمز");
    }



    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={onPress} style={style.container}>
                <DzText style={[style.appVersion, isStagingApi && style.appVersionStaging]}>
                    {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
                </DzText>
            </TouchableOpacity>
            <TouchableOpacity style={LayoutStyle.AlignItemsCenter} activeOpacity={0.8} onLongPress={onLongPressDeviceId}>
                <DzText style={style.appVersion}>
                    {deviceId}
                </DzText>
            </TouchableOpacity>
        </>
    );
};

export default AppVersion;
