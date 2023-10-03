import I19n from "dz-I19n";
import FollowersListTabBarConst from "./followers-list-tab-bar.const";
import {Colors} from "deelzat/style";

const getTabsOptions = () => {

    const configs = {};

    configs[FollowersListTabBarConst.FOLLOWING] = {
        title: I19n.t('يتابع'),
        titleStyle: {
            color: Colors.N_BLACK
        }
    }
    configs[FollowersListTabBarConst.FOLLOWERS] = {
        title: I19n.t('متابع'),
        titleStyle: {
            color: Colors.N_BLACK
        }
    }

    return configs;
}
export {getTabsOptions as getTabsOptions}
