import DEFAULT_THEMES from 'assets/default_values/default-themes.json';
import DEFAULT_AVATARS from 'assets/default_values/default-avatars.json';
import DEFAULT_COUPON_LIST_BG from 'assets/default_values/coupons-list-backgrounds.json';

const RemoteConfigsConst = {};
RemoteConfigsConst.OnBoardingPages = 'onboarding_pages';
RemoteConfigsConst.SupportChatAccount = 'support_chat_account';
RemoteConfigsConst.UpcomingVersion = 'mantadory_version';
RemoteConfigsConst.EndPoints = 'EndPoints';
RemoteConfigsConst.API_PROD = 'API_PROD';
RemoteConfigsConst.API_DEV = 'API_DEV';
RemoteConfigsConst.API_TEST = 'API_TEST';
RemoteConfigsConst.ENABLE_MULTI_MARKETS = 'enable_multi_markets';
RemoteConfigsConst.PERSISTENT_DATA_CACHE_DURATION = 'persistent_data_cache_duration';
RemoteConfigsConst.PASSWORDLESS_LOCK_SECONDS = 'passwordless_lock_seconds';
RemoteConfigsConst.PASSWORDLESS_LIMIT_PER_LOCK = 'passwordless_limit_per_lock';
RemoteConfigsConst.ENABLE_CANCEL_ORDERS = 'enable_cancel_orders';
RemoteConfigsConst.ENABLE_COUPONS_FEATURE = 'enable_coupons_feature';
RemoteConfigsConst.PROFILE_THEMES = 'profile_themes';
RemoteConfigsConst.DEFAULT_AVATARS = 'default_avatars';
RemoteConfigsConst.DEFAULT_AVATAR = 'default_avatar';
RemoteConfigsConst.COUPONS_LIST_BACKGROUNDS = 'coupons_list_backgrounds';
RemoteConfigsConst.SHOW_DELETE_ACCOUNT = 'show_delete_account';


RemoteConfigsConst.DefaultValues = {};


RemoteConfigsConst.DefaultValues.EndPoints = [];

RemoteConfigsConst.DefaultValues.EndPoints[0] = {
    name: RemoteConfigsConst.API_PROD,
    value: 'https://192.168.1.17/api'
};
RemoteConfigsConst.DefaultValues.EndPoints[1] = {
    name: RemoteConfigsConst.API_DEV,
    value: 'https://wj4kbkqp95.execute-api.eu-west-1.amazonaws.com/dev/api'
};
RemoteConfigsConst.DefaultValues.EndPoints[2] = {
    name: RemoteConfigsConst.API_TEST,
    value: 'https://59f6eaqih0.execute-api.eu-west-1.amazonaws.com/test/api'
};


RemoteConfigsConst.DefaultValues[RemoteConfigsConst.SupportChatAccount] = {"userId":"email|60c208341febfddccc8a197c","avatar":"https://i.ibb.co/jrx235d/faaaaaaaace-full-icon-min.png","name":"فريق ديلزات","isSupportAccount":true}
RemoteConfigsConst.DefaultValues[RemoteConfigsConst.PERSISTENT_DATA_CACHE_DURATION] = 7200000;


RemoteConfigsConst.DefaultValues[RemoteConfigsConst.PASSWORDLESS_LOCK_SECONDS] = 300;
RemoteConfigsConst.DefaultValues[RemoteConfigsConst.PASSWORDLESS_LIMIT_PER_LOCK] = 3;


RemoteConfigsConst.DefaultValues[RemoteConfigsConst.PROFILE_THEMES] = JSON.stringify(DEFAULT_THEMES);
RemoteConfigsConst.DefaultValues[RemoteConfigsConst.DEFAULT_AVATARS] = JSON.stringify(DEFAULT_AVATARS);
RemoteConfigsConst.DefaultValues[RemoteConfigsConst.COUPONS_LIST_BACKGROUNDS] = JSON.stringify(DEFAULT_COUPON_LIST_BG);
RemoteConfigsConst.DefaultValues[RemoteConfigsConst.DEFAULT_AVATAR] = 'https://firebasestorage.googleapis.com/v0/b/deelzat-76871.appspot.com/o/avatars%2F14-min.jpg?alt=media&token=b2463e6a-d985-41eb-afd4-13ba72a36ca2';


Object.freeze(RemoteConfigsConst);
export default RemoteConfigsConst;


