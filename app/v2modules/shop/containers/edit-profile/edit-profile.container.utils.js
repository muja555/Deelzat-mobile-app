import I19n from 'dz-I19n';
import EditProfileTabConst from 'v2modules/shop/constants/edit-profile-tab.const';

export const getEditProfileTabsOptions = () => {

    const TabsOptions = {};

    TabsOptions[EditProfileTabConst.CUSTOMIZATION] = {
        key: EditProfileTabConst.CUSTOMIZATION,
        label: I19n.t('مزايا خاصة')
    };

    TabsOptions[EditProfileTabConst.EDIT_INFO] = {
        key: EditProfileTabConst.EDIT_INFO,
        label: I19n.t('تفاصيل الحساب')
    };

    return TabsOptions;
};
