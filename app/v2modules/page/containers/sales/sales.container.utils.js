import I19n from "dz-I19n";
import {Colors} from "deelzat/style";

const SalesTabConst = {};

SalesTabConst.CONFIRMED = 'CONFIRMED';
SalesTabConst.IN_PROGRESS = 'IN_PROGRESS';

Object.freeze(SalesTabConst);
export {SalesTabConst};

export const getTabsOptions = () => {

    const SalesPageTabsOptions = {};

    SalesPageTabsOptions[SalesTabConst.CONFIRMED] = {
        label: I19n.t('الطلبيات السابقة'),
        focusedLabelColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.N_GREY_4
    };
    SalesPageTabsOptions[SalesTabConst.IN_PROGRESS] = {
        label: I19n.t('الطلبيات الجديدة'),
        focusedLabelColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.N_GREY_4
    };

    return SalesPageTabsOptions;
};

