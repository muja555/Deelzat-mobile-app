import I19n from "dz-I19n";
import {Colors} from "deelzat/style";

const InboxRoutesConst = {};

InboxRoutesConst.MESSAGES = 'INBOX.MESSAGES';
InboxRoutesConst.STARRED_MESSAGES = 'INBOX.STARRED_MESSAGES';

Object.freeze(InboxRoutesConst);
export default InboxRoutesConst;

export const getTabsOptions = () => {

    const SalesPageTabsOptions = {};

    SalesPageTabsOptions[InboxRoutesConst.MESSAGES] = {
        label: I19n.t('كل المحادثات'),
        focusedLabelColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.N_GREY_4
    };
    SalesPageTabsOptions[InboxRoutesConst.STARRED_MESSAGES] = {
        label: I19n.t('المحادثات المفضلة'),
        focusedLabelColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.N_GREY_4
    };

    return SalesPageTabsOptions;
};

