import ProfileTabConst from "v2modules/shop/constants/profile-tab.const";
import I19n from "dz-I19n";
import ShopProducts from "v2modules/shop/components/shop-products/shop-products.component";
import MyMenu from "v2modules/page/components/my-menu/my-menu.component";
import StartSelling from "v2modules/shop/components/start-selling/start-selling.component";
import ProfileLoader from "../profile-loader/profile-loader.component";

export const getProfileTabOptions = () => {

    const MyProfileTabOptions = {};

    MyProfileTabOptions[ProfileTabConst.NEW_PRODUCTS] = {
        key: ProfileTabConst.NEW_PRODUCTS,
        label: I19n.t('المنتجات الجديدة'),
        screen: ShopProducts
    };

    MyProfileTabOptions[ProfileTabConst.USED_PRODUCTS] = {
        key: ProfileTabConst.USED_PRODUCTS,
        label: I19n.t('المنتجات المستعملة'),
        screen: ShopProducts
    };

    MyProfileTabOptions[ProfileTabConst.START_SELLING] = {
        key: ProfileTabConst.START_SELLING,
        label: I19n.t('المنتجات الجديدة'),
        screen: StartSelling
    };

    MyProfileTabOptions[ProfileTabConst.MENU] = {
        key: ProfileTabConst.MENU,
        label: I19n.t('القائمة'),
        screen: MyMenu
    };

    MyProfileTabOptions[ProfileTabConst.LOADER] = {
        key: ProfileTabConst.LOADER,
        label: '',
        screen: ProfileLoader
    };


    return MyProfileTabOptions;
};
