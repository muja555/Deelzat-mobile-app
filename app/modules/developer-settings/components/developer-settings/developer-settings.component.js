import {KeyboardAwareScrollView} from "@codler/react-native-keyboard-aware-scroll-view";
import {TouchableOpacity, View, Text} from "react-native";
import React, {useState, useEffect} from 'react';
import {developerSettingsStyle as style} from "./developer-settings.component.style";
import {Select} from "deelzat/form";
import {useNavigation} from "@react-navigation/native";
import BackSvg from "assets/icons/BackIcon.svg";
import {Colors, LocalizedLayout} from "deelzat/style";
import {getSelectedApiName, saveSelectedApiName} from "modules/main/others/app.localstore";
import {Button, Space} from 'deelzat/ui';
import {authSelectors, authThunks} from "modules/auth/stores/auth/auth.store";
import RNRestart from "react-native-restart";
import {useDispatch, useSelector} from "react-redux";
import {shareText} from "modules/main/others/main-utils";
import Toast from "deelzat/toast";
import Spinner from "react-native-loading-spinner-overlay";
import messaging from "@react-native-firebase/messaging";
import {shopSelectors} from "modules/shop/stores/shop/shop.store";
import Clipboard from "@react-native-clipboard/clipboard";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import {DzText} from "deelzat/v2-ui";

const DeveloperSettings = (props) => {

    const {
        endPoints = [],
    } = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);
    const [isLoadingShare, isLoadingShareSet] = useState(false);

    let authSate;
    if (isAuthenticated) {
        authSate = useSelector(authSelectors.authStateSelector);
    }
    const [selectedEndPointName, selectedEndPointNameSet] = useState({});

    const onBackPressed = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }

    const onPressSaveApi = () => {
        (async () => {
            await saveSelectedApiName(selectedEndPointName);
            dispatch(authThunks.logout());
            RNRestart.Restart();
        })();
    };

    const onPressCopyAuthToken = () => {

        if (authSate) {
            Clipboard.setString(authSate.auth0?.idToken);
            Toast.info("\"auth token\" is copied");
        } else {
            Toast.info("You are not logged in!");
        }
    }

    const onPressCopyAuthId = () => {

        if (authSate) {
            Clipboard.setString(authSate.auth0User?.userId);
            Toast.info("\"auth0 user id\" is copied");
        } else {
            Toast.info("You are not logged in!");
        }
    }

    const onPressCopyFCMtoken = () => {
        (async () => {
            const fcmToken = await messaging().getToken();
            Clipboard.setString(fcmToken);
            Toast.info("\"FCM token\" is copied");
        })();
    }

    const onPressCopyShopId = () => {
        (async () => {
            if (shopState?.shop) {
                Clipboard.setString(shopState?.shop.id);
                Toast.info("\"shop id\" is copied");
            } else {
                Toast.info("There's no shop for this user or it's not logged in");
            }
        })();
    }

    const onPressCopyAllAuth0UserState = () => {
        (async () => {
            if (authSate) {
                isLoadingShareSet(true);
                await shareText(JSON.stringify(authSate.auth0User));
                isLoadingShareSet(false);
            } else {
                Toast.info("You are not logged in!");
            }
        })();
    }


    useEffect(() => {
        (async () => {
            const selectedApiName = await getSelectedApiName();
            selectedEndPointNameSet(selectedApiName);
        })();

        AuthRequiredModalService.setVisible();
    }, []);

    return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <Spinner visible={isLoadingShare} textContent={''}/>
                <View
                    style={style.container}>
                    <View
                        style={style.header}>
                        <TouchableOpacity
                            style={[style.btnView, LocalizedLayout.ScaleX()]}
                            onPress={onBackPressed}
                            hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
                            activeOpacity={0.1}>
                            <BackSvg fill={"#fff"} width={20} height={20} stroke={Colors.N_BLACK} strokeWidth={33}/>
                        </TouchableOpacity>
                    </View>
                    <View style={style.fieldContainer}>
                        <Select
                            value={endPoints.find(endPoint => endPoint.name === selectedEndPointName)}
                            keyBy={"value"}
                            labelBy={"name"}
                            options={endPoints}
                            onChange={(value) => {
                                selectedEndPointNameSet(value.name);
                            }}
                            label={'BE api\'s'}
                        />
                    </View>
                    <Space directions={'h'} sizes={'md'} />
                    {
                        endPoints?.map((item, index) => (
                            <View style={{marginTop: 5, flex: 1}} key={"" + index}>
                                <DzText>
                                    {item.name} {"\n"}
                                    {item.value} {"\n"}
                                    {'---------------'}
                                </DzText>
                            </View>
                        ))
                    }
                    <Space size={'md'} directions={'h'}/>
                    <DzText>
                        ** saving api will logout the current user and restart the app **
                    </DzText>
                    <Button
                        style={style.settingsButton}
                        text={"save selected api"}
                        onPress={onPressSaveApi}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Button
                        style={style.settingsButton}
                        text={"copy auth0 user token"}
                        onPress={onPressCopyAuthToken}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Button
                        style={style.settingsButton}
                        text={"copy auth0 user id"}
                        onPress={onPressCopyAuthId}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Button
                        style={style.settingsButton}
                        text={"copy fcm (push notification) token"}
                        onPress={onPressCopyFCMtoken}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Button
                        style={style.settingsButton}
                        text={"copy shop id"}
                        onPress={onPressCopyShopId}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Button
                        style={style.settingsButton}
                        text={"copy all auth0 user state"}
                        onPress={onPressCopyAllAuth0UserState}/>
                    <Space size={'lg'} directions={'h'}/>
                    <Space size={'lg'} directions={'h'}/>
                </View>
            </KeyboardAwareScrollView>
    );
}

export default DeveloperSettings;
