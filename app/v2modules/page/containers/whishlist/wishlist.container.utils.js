import I19n from "dz-I19n";
import {Colors} from "deelzat/style";

const SavedTabConst = {};

SavedTabConst.ALL_ITEMS = 'ALL_ITEMS';
SavedTabConst.BOARDS = 'BOARDS';

Object.freeze(SavedTabConst);
export {SavedTabConst};


export const getTabsOptions = () => {

    const SavedPageTabsOptions = {};

    SavedPageTabsOptions[SavedTabConst.ALL_ITEMS] = {
        label: I19n.t('جميع المنتجات'),
        focusedLabelColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.N_GREY_4
    };
    SavedPageTabsOptions[SavedTabConst.BOARDS] = {
        label: I19n.t('المجموعات'),
        focusedLabelColor: '#fff',
        backgroundColor: Colors.CERULEAN_BLUE_3
    };

    return SavedPageTabsOptions;
};

