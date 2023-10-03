import MainTabsNavsConst from "v2modules/main/constants/main-tabs-navs.const";
import HomeHighlight from "assets/icons/HomeHighlight.svg";
import ShopsHighlight from "assets/icons/ShopsHighlight.svg";
import FeedHighlight from "assets/icons/FeedHighlight.svg";
import BrowseHighlight from "assets/icons/BrowseHighlight.svg";
import ProfileHighlight from "assets/icons/ProfileHighlight.svg";
import I19n from 'dz-I19n';

const MainTabsNavigatorOptions = {};

MainTabsNavigatorOptions[MainTabsNavsConst.HOME] = {
    icon: HomeHighlight,
    iconColorProps: ['stroke']
};

MainTabsNavigatorOptions[MainTabsNavsConst.DEEL_DAILY] = {
    icon: FeedHighlight,
    iconColorProps: ['stroke']
};

MainTabsNavigatorOptions[MainTabsNavsConst.BROWSE] = {
    icon: BrowseHighlight,
    iconColorProps: ['stroke', 'fill']
};

MainTabsNavigatorOptions[MainTabsNavsConst.SHOPS] = {
    icon: ShopsHighlight,
    iconColorProps: ['fill']
};

MainTabsNavigatorOptions[MainTabsNavsConst.PROFILE] = {
    icon: ProfileHighlight,
    iconColorProps: ['stroke'],
    authRequiredMsg: I19n.t('قم بتسجيل الدخول لتتمكن من تصفح حسابك'),
};


export const getMainTabsNavigatorOptions = () => {
    return MainTabsNavigatorOptions;
};
