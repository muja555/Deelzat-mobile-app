import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors } from 'modules/auth/stores/auth/auth.store';
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';
import {
    generateChatProfile,
    getChatProfileFromFirestore,
    updateChatProfileOnFirestore,
} from '../../others/chat.utils';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import * as Actions from 'modules/chat/stores/chat/chat.actions';
import UserInfoUpdateInput from 'modules/main/inputs/user-info-update.input';
import UserInfoApi from 'modules/main/apis/user-info.api';
import { setUserProperty } from 'modules/analytics/others/analytics.utils';
import USER_PROP from 'modules/analytics/constants/analytics-user-propery.const';

/**
 *  Setup Chat Profile
 */
const SyncChatProfile = () => {

    const auth0User = useSelector(authSelectors.auth0UserSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);

    const dispatch = useDispatch();

    const splitName = (name) => {

        const index = name.indexOf(' ');
        return [name.slice(0, index), name.slice(index + 1)];
    };

    const syncChatName = async (profile) => {

        // Should refresh user info first/last names
        let isMissingUserInfoNames = true;
        try {
            const userInfo = await UserInfoApi.getUserInfo();
            if (userInfo?.metadata?.firstName?.trim()
                && userInfo?.metadata?.lastName?.trim()) {
                isMissingUserInfoNames = false;
            }
        } catch (e) {
            console.warn(e);
        }

        if (profile.name && isMissingUserInfoNames) {
            try {

                const [firstName, lastName] = splitName(profile.name);

                const inputs = new UserInfoUpdateInput();
                inputs.firstName = firstName;
                inputs.lastName = lastName;
                const res = await UserInfoApi.updateUserInfo(inputs);

                setUserProperty(USER_PROP.USERNAME, profile.name);
            } catch (e) {

                console.log(e);
            }
        }
    };

    const updateChatProfile = (shop, auth0User) => {

        (async () => {

            const chatProfile = generateChatProfile(shop, auth0User);
            let newProfile;

            if (chatProfile?.userId) {

                const remoteProfile = await getChatProfileFromFirestore(chatProfile.userId);
                const supportAccount = remoteConfig.getString(RemoteConfigsConst.SupportChatAccount);
                const isSupportAccount = !!supportAccount && chatProfile.userId === supportAccount?.userId;

                newProfile = {
                    ...chatProfile,
                    ...remoteProfile,
                    isSupportAccount,
                    avatar: chatProfile.avatar || remoteProfile?.avatar,
                    name: chatProfile.name || remoteProfile?.name,
                };

                if (newProfile?.avatar !== remoteProfile?.avatar
                    || newProfile?.name !== remoteProfile?.name
                    || newProfile?.isSupportAccount !== remoteProfile?.isSupportAccount
                ) {

                    updateChatProfileOnFirestore(newProfile);
                    syncChatName(newProfile);
                }
            }

            dispatch(Actions.SetChatProfile(newProfile));
        })();
    };

    useEffect(() => {

        // Get shop id from auth0
        const appMetaData = auth0User?.appMetadata || {};
        const shopIds = appMetaData.shops_ids || [];
        const shopId = shopIds.length ? shopIds[0] : null;

        if (auth0User && !shopId) {
            UserInfoApi.getUserInfo()
                .then((res) => {
                    const updateInfo = res?.metadata || {};
                    updateChatProfile(null, {...updateInfo, userId: auth0User?.userId});
                })
                .catch(e => {
                    console.warn(e);
                    updateChatProfile(null, auth0User);
                });

        } else if (shopState?.shop?.id) {
            updateChatProfile(shopState?.shop);
        }

    }, [auth0User, shopState?.shop]);

    return <></>;
};

export default SyncChatProfile;
