import {Alert, Linking} from "react-native";
import RNExitApp from 'react-native-exit-app';
import I19n from 'dz-I19n';

const showUpdateAppDialog = (isForceUpdate, appStoreUrl) => {

    const alertButtons = [{
        text: isForceUpdate ? I19n.t('خروج') : I19n.t('إلغاء'),
        onPress: () => {
            if (isForceUpdate) {
                RNExitApp.exitApp();
            }
        },
        style: 'cancel'

    }, {
        text: I19n.t('تحديث'),
        onPress: async () => {
            const supported = await Linking.canOpenURL(appStoreUrl);
            if (supported) {
                await Linking.openURL(appStoreUrl);
            }

            if (isForceUpdate) {
                RNExitApp.exitApp();
            }
        },
    },
    ];

    const title = I19n.t('نسخة جديدة متاحة من ديلزات') + " 🎉";

    Alert.alert(title,
        I19n.t('يرجى تحديث التطبيق إلى الإصدار الجديد')
        + "\n"
        + I19n.t('لتكتشف التحديثات')
        + "  🤗",
        alertButtons);
}

export { showUpdateAppDialog as showUpdateAppDialog }



const isAppOutdated = (thisVersion, liveVersion) => {

    if (!thisVersion || !liveVersion)
        return false;

    const [currentMajor, currentMinor, currentPatch] = thisVersion.split('.').map((item) => parseInt(item));
    const [remoteMajor, remoteMinor, remotePatch] = liveVersion.split('.').map((item) => parseInt(item));

    if (remoteMajor > currentMajor) {
        return true;
    }
    else if (remoteMajor === currentMajor && remoteMinor > currentMinor) {
        return true;
    }
    else if (remoteMajor === currentMajor && remoteMinor === currentMinor && remotePatch > currentPatch) {
        return true;
    }

    return false;

};

export { isAppOutdated as isAppOutdated }
