import React, {useRef, useState} from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import {fillChatNameStyle as style} from './fill-chat-name.component.style'
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {chatActions} from 'modules/chat/stores/chat/chat.store'
import {TextField} from "deelzat/form";
import ChatInfoFieldConst from "modules/chat/constants/chat-info-field.const";
import {validateFields} from "modules/chat/components/fill-chat-name/fill-chat-name.utils";
import {isEmptyValues} from "modules/main/others/main-utils";
import {chatSelectors} from "modules/chat/stores/chat/chat.store";
import {useDispatch, useSelector} from "react-redux";
import {updateChatProfileOnFirestore} from "modules/chat/others/chat.utils";
import {setUserProperty, trackChangeChatInfo} from "modules/analytics/others/analytics.utils";
import UserInfoUpdateInput from "modules/main/inputs/user-info-update.input";
import UserInfoApi from "modules/main/apis/user-info.api";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import {DzText} from "deelzat/v2-ui";
import I19n from 'dz-I19n';


const FillChatName = (props) => {

    const {
        onHide = () => {},
        onChangeSuccess = () => {},
        trackSource,
    } = props;

    const dispatch = useDispatch();
    const lastNameRef = useRef()

    const chatProfile = useSelector(chatSelectors.chatProfileSelector)
    const [fields, fieldsSet] = useState({});
    const [errors, errorsSet] = useState({});
    const [isLoading, isLoadingSet] = useState(false)

    const setField = (key, value) => {
        const _fields = {...fields};
        _fields[key] = value;
        fieldsSet(_fields);
    };

    const syncChatName = async (firstName, lastName) => {

        try {

            const currentProfile = await UserInfoApi.getUserInfo() || {};
            const inputs = new UserInfoUpdateInput();
            inputs.metadata = {...currentProfile.metadata, firstName, lastName};
            console.log("fill-chat-name.component.js " + "currentUserPic", currentProfile.metadata)
            console.log("fill-chat-name.component.js " + "------", inputs.metadata)
            await UserInfoApi.updateUserInfo(inputs);

            setUserProperty(USER_PROP.USERNAME, `${firstName} ${lastName}`);
        } catch (e) {

            console.log(e);
        }
    }

    const updateProfile = () => {

        isLoadingSet(true);

        const firstName = fields[ChatInfoFieldConst.FIRST_NAME]?.trim();
        const lastName = fields[ChatInfoFieldConst.LAST_NAME]?.trim();

        (async () => {

            const _profile = {...chatProfile};
            _profile.name = `${firstName} ${lastName}`

            await updateChatProfileOnFirestore(_profile, true);
            await dispatch(chatActions.SetChatProfile(_profile));

            trackChangeChatInfo(fields, trackSource);

            onHide();
            onChangeSuccess();

            syncChatName(firstName, lastName)

        })();
    }

    const onPress = () => {

        const _fieldsErrors = validateFields(fields)
        errorsSet(_fieldsErrors);

        if (isEmptyValues(_fieldsErrors)) {
            updateProfile();
        }
    }


    return (
        <SafeAreaView style={style.container}>
            <View style={style.innerContainer}>
                <DzText style={style.title}>
                    {I19n.t('لتتواصل مع المتجر قم بإدخال اسمك بالكامل') + " " + "💬"}
                </DzText>
                <Space directions={'h'} size={'md'}/>
                <View style={style.namesContainer}>
                    <View style={style.nameField}>
                        <TextField
                            label={I19n.t('الإسم الأول')}
                            value={fields[ChatInfoFieldConst.FIRST_NAME]}
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() => lastNameRef?.current?.focus()}
                            inputStyle={style.inputStyle}
                            viewStyle={style.inputViewStyle}
                            onChangeText={(value) => setField(ChatInfoFieldConst.FIRST_NAME, value)}/>
                        <DzText style={style.errorMessage}>
                            {errors[ChatInfoFieldConst.FIRST_NAME]}
                        </DzText>
                    </View>
                    <Space directions={'v'} size={'md'}/>
                    <View style={style.nameField}>
                        <TextField
                            label={I19n.t('الإسم الأخير')}
                            value={fields[ChatInfoFieldConst.LAST_NAME]}
                            textInputRef={lastNameRef}
                            blurOnSubmit={false}
                            returnKeyType="done"
                            onSubmitEditing={onPress}
                            inputStyle={style.inputStyle}
                            viewStyle={style.inputViewStyle}
                            errorTextStyle={{fontSize: 10}}
                            onChangeText={(value) => setField(ChatInfoFieldConst.LAST_NAME, value)}/>
                        <DzText style={style.errorMessage}>
                            {errors[ChatInfoFieldConst.LAST_NAME]}
                        </DzText>
                    </View>
                </View>
                <Space directions={'h'} size={'sm'}/>
                <Button
                    onPress={onPress}
                    disabled={isLoading}
                    loading={isLoading}
                    size={ButtonOptions.Size.LG}
                    type={ButtonOptions.Type.PRIMARY}
                    text={I19n.t('ابدأ المحادثة')}
                />
                <Space directions={'h'}/>
                <Button
                    onPress={onHide}
                    type={ButtonOptions.Type.MUTED_OUTLINE}
                    text={I19n.t('إلغاء')}
                />
                <Space directions={'h'}/>
            </View>
        </SafeAreaView>
    );
};
export default FillChatName;
