import I19n from "dz-I19n";
import {Colors} from "deelzat/style";
import NetworkStateConst from "./network-state.component.const";

export const getNetworkOptions = () => {

    const options = {};

    options[NetworkStateConst.CONNECTED] = {
        label: I19n.t('نجح الإتصال بالإنترنت!'),
        color: Colors.MAIN_COLOR,
    };

    options[NetworkStateConst.POOR] = {
        label: I19n.t('الإتصال بالإنترنت بطيء أو معدوم'),
        color: Colors.LIGHT_ORANGE,
    };

    options[NetworkStateConst.DISCONNECTED] = {
        label: I19n.t('لا يوجد إتصال بالإتنرنت'),
        color: Colors.RED_2,
    };

    return options;
};
