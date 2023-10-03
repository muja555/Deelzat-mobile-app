import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {chatRoomStyle as style} from "./chat-room.component.style";
import {GiftedChat, Bubble, InputToolbar, Composer, Message, MessageText, Time, Actions} from "@deelzat/react-native-gifted-chat";
import SendIcon from 'assets/icons/SendArrow.svg'
import {
    Platform,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import {Space} from 'deelzat/ui'
import CameraIcon from 'assets/icons/NewCamera.svg';
import CameraWhiteIcon from 'assets/icons/NewCameraWhite.svg';
import GalleryIcon from "assets/icons/NewGallery.svg";
import ChatImagesList from "modules/chat/components/chat-images-list/chat-images-list.component";
import {Colors, LocalizedLayout} from "deelzat/style";
import Close from "assets/icons/Close.svg";
import {DzText, Touchable} from "deelzat/v2-ui";
import I19n from 'dz-I19n';
import MessageStatusConst from "modules/chat/constants/message-status.const";
import OneTickIcon from 'assets/icons/ChatOneTick.svg';
import TwoTickIcon from 'assets/icons/ChatTwoTicks.svg';
import ChatBubbleImages from "modules/chat/components/chat-bubble-images/chat-bubble-images.component";

const ChatRoom = (props) => {

    const {
        onRemoveImage = (image) => {},
        isLoadingMessages = true,
        images = [],
        messages = [],
        latestSentStatus = {id: null, status: null},
        onSend,
        chatProfile,
        onPressCamera,
        onPressGallery,
        onEndReached,
        fetchMore
    } = props;


    const [keyboardIsVisible, keyboardIsVisibleSet] = useState(false);
    const [keyboardHeight, keyboardHeightSet] = useState(0);
    const [mediaViewVisible, mediaViewVisibleSet] = useState(false);
    const [composerHeight, composerHeightSet] = useState(50)
    const [inputText, inputTextSet] = useState('')

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            keyboardIsVisibleSet(true);
            keyboardHeightSet(e?.endCoordinates?.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>   keyboardIsVisibleSet(false));

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    const renderInputToolbar = useCallback((_props) => {

        const canSend = inputText?.trim().length || images.length;
        return (
            <View style={[style.inputToolbarContainerOuter, images.length && style.inputToolbarContainerOuterWithImages]}>
                <View style={[style.inputToolbarContainerColor,
                    canSend && style.inputToolbarContainerOuterCanSend,
                    {height: composerHeight}
                ]}/>
                <InputToolbar {..._props}
                              containerStyle={[style.inputToolbarContainer, {height: composerHeight}]}/>
            </View>
        )
    }, [images, composerHeight, inputText]);


    const renderComposer = useCallback((_props) => {

        const canSend = inputText?.trim().length || images.length;

        const onTextLayout = ({height}) => {
            let _composerHeight = height
            if (_composerHeight < 50)
                _composerHeight = 50;
            if (_composerHeight > 70)
                _composerHeight = 70

            composerHeightSet(_composerHeight)
        }

        return (
            <Composer
                {..._props}
                composerHeight={composerHeight}
                multiline={true}
                onInputSizeChanged={onTextLayout}
                onTextChanged={inputTextSet}
                textInputStyle={[style.inputText, canSend && {paddingEnd: 50}, LocalizedLayout.TextAlign()]}
                placeholder={I19n.t('ابدأ بالكتابة هنا')}/>
            )
    }, [inputText, images, composerHeight]);


    const renderMessageText = useCallback((_props) => {
        return (
            <MessageText {..._props}
                         textStyle={{left: style.messageTextLeft, right: style.messageTextRight}}/>
        )
    }, []);


    const renderMessage = useCallback((_props) => {
        const {currentMessage} = _props
        const isUserBubble = currentMessage?.user?._id === chatProfile._id;
        return (
            <Message
                {..._props}
                linkStyle={{
                    left: style.linkLeft,
                    right: style.linkRight,
                }}
                position={!isUserBubble ? 'right' : 'left'}/>
        )
    }, [chatProfile]);


    const renderBubble = useCallback((_props) => {

        const {
            currentMessage
        } = _props;

        let msgStatus;
        if (messages.length
            && currentMessage._id === messages[0]._id) {

            const latestMsg = messages[0];
            const displaySeen = !!latestMsg.seenBy && latestMsg.seenBy !== chatProfile.userId;

            if (displaySeen) {
                msgStatus = MessageStatusConst.SEEN;
            }
            else if (latestMsg?.sentBy === chatProfile?.userId) {
                msgStatus = latestSentStatus?.status;
            }
        }


        return (
            <View>
                <Bubble {..._props}
                        wrapperStyle={{left: style.bubbleWrapperLeft, right: style.bubbleWrapperRight}}/>
                <View style={style.lastMsgStatus}>
                    {
                        (!!msgStatus) &&
                        <View style={style.lastMsgStatus}>
                            {
                                (msgStatus === MessageStatusConst.SEEN || msgStatus === MessageStatusConst.SENT) &&
                                <View style={style.seenView}>
                                    {
                                        (msgStatus === MessageStatusConst.SENT) &&
                                        <OneTickIcon width={15} height={15}/>
                                    }
                                    {
                                        (msgStatus === MessageStatusConst.SEEN) &&
                                        <TwoTickIcon width={15} height={15}/>
                                    }
                                    <Space directions={'v'} size={'sm'}/>
                                    <DzText style={[style.seenText, {opacity: msgStatus === MessageStatusConst.SEEN? 1: 0}]}>
                                        {msgStatus === MessageStatusConst.SEEN?
                                            I19n.t('تمت المشاهدة'): 'TEMP'}
                                    </DzText>
                                </View>
                            }
                            {
                                (msgStatus === MessageStatusConst.ERROR) &&
                                <>
                                    <Close width={14} height={14} strokeWidth={2} style={{marginTop: 1}}
                                           stroke={Colors.ERROR_COLOR_2}/>
                                    <View style={{width: 4}}/>
                                    <DzText style={style.sendFailureTxt}>
                                        {I19n.t('فشل فى الارسال')}
                                    </DzText>
                                </>
                            }
                        </View>
                    }
                </View>
            </View>

        )
    }, [chatProfile?.userId, latestSentStatus?.status, messages]);


    const renderTime = useCallback((_props) => {
        return (
            <Time {..._props}
                  timeTextStyle={{left: style.messageTimeLeft, right: style.messageTimeRight}} />
        )
    }, []);

    const renderActions = useCallback((_props) => {

        const onPressMediaButton = () => {
            mediaViewVisibleSet(true);
        }

        return (
            <Actions {..._props}
                     containerStyle={style.actionsContainer}
                     onPressActionButton={onPressMediaButton}
                     icon={() =>
                         <View style={style.cameraIcon}>
                             <CameraIcon width={30} height={30}/>
                         </View>
                     }/>
        )
    }, []);


    const SendButton = useCallback((props) => {
        const {
            text,
            onSend
        } = props;

        const canSend = inputText?.trim().length || images.length;

        const onPress = () => {
            const toSend = {
                text: text.trim(),
                user: chatProfile
            }

            if (images.length) {
                toSend.image = images[0].downloadURL;
                if (images.length > 1)
                    toSend.images = images.join(',');
            }

            onSend(toSend, true)
            inputTextSet('')
        }

        if (canSend) {
            const isUploading = images.length && !!images.find(img => img.status === 'uploading')
            return <TouchableOpacity style={[
                style.sendBtn,
                isUploading && style.sendBtnDisabled,
                images.length > 0 && {right: 0},
                LocalizedLayout.ScaleX()
            ]}
                                     onPress={onPress}
                                     disabled={isUploading}
                                     hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                     activeOpacity={1}>
                <SendIcon width={30} height={30} />
            </TouchableOpacity>
        }

        return <></>
    }, [images, inputText]);


    const renderFooter = useCallback(() => {
        return (
            <View style={{ height: images.length? 110 : 40 }}/>
        )
    }, [images]);


    const renderMessageImage = useCallback((_props) => {
        const {
            currentMessage
        } = _props;

        const _images = currentMessage?.images? currentMessage.images.split(','): [currentMessage.image];

        return (
            <ChatBubbleImages images={_images} />
        )
    }, [])


    const renderLoadEarlier = useCallback(() => {
        return (
            <ActivityIndicator size="large" color={Colors.MAIN_COLOR} style={style.activityIndicator}/>
        );
    }, []);

    const _onPressCamera = () => {
        mediaViewVisibleSet(false);
        onPressCamera();
    }

    const _onPressGallery = () => {
        mediaViewVisibleSet(false);
        onPressGallery();
    }


    const onPressOutsideMediaView = () => {
        mediaViewVisibleSet(false);
    }


    const renderHeader = () => {
        return (
            <View>
                {
                    (fetchMore) &&
                    <Space directions={'h'} size={['sm', 'md']} />
                }
                <ActivityIndicator style={style.footerLoader}
                                   size="small"
                                   color={fetchMore? Colors.MAIN_COLOR : 'transparent'} />
                {
                    (fetchMore) &&
                    <Space directions={'h'} size={['sm', 'md']} />
                }
            </View>
        )
    }

    const listViewProps = useMemo(() => {
        return ({
                onEndReachedThreshold: 0.3,
                showsVerticalScrollIndicator: false,
                keyboardDismissMode: 'on-drag',
                onEndReached,
            })
    }, [onEndReached]);

    return (
        <View style={style.container}>
            <GiftedChat
                wrapInSafeArea={false}
                messages={messages}
                text={inputText}
                onSend={onSend}
                bottomOffset={Platform.OS === 'ios' ? 70 : 0}
                user={chatProfile}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderSend={SendButton}
                renderMessage={renderMessage}
                renderHeader={renderHeader}
                renderMessageText={renderMessageText}
                maxComposerHeight={50}
                minComposerHeight={50}
                loadEarlier={isLoadingMessages}
                renderLoadEarlier={renderLoadEarlier}
                renderTime={renderTime}
                optionTitles={[I19n.t('نسخ النص'), I19n.t('إلغاء')]}
                renderActions={renderActions}
                renderFooter={renderFooter}
                renderMessageImage={renderMessageImage}
                inverted={true}
                listViewProps={listViewProps}
                //isTyping={false}
                //scrollToBottom={true}
                //renderLoading={() => <View style={{height: 0, backgroundColor: 'red'}} />}
                //invertibleScrollViewProps
            />
            {
                (keyboardIsVisible && Platform.OS !== 'android') &&
                <View style={{height: 60}}/>
            }
            {
                images.length > 0 &&
                <View style={style.chatImagesContainer}>
                    <ChatImagesList images={images} onItemPress={onRemoveImage}/>
                </View>
            }
            {
                (mediaViewVisible) &&
                <Touchable style={style.outsideMediaView}
                           activeOpacity={1}
                           onPress={onPressOutsideMediaView}>
                    <View style={[
                        style.mediaView,
                        {
                            bottom: (composerHeight + 30) +
                                (images.length ? 90 : 0) +
                                (Platform.OS === 'ios'? keyboardHeight: 0)
                        },
                    ]}>

                        <Touchable onPress={_onPressCamera} style={style.mediaViewBtn}>
                            <View style={style.mediaViewCircle}>
                                <CameraWhiteIcon width={24} height={24} stroke={'#fff'}/>
                            </View>
                            <Space directions={'v'} />
                            <DzText style={style.mediaViewText}>
                                {I19n.t('افتح الكاميرا')}
                            </DzText>
                        </Touchable>
                        <Space directions={'v'} />
                        <Touchable onPress={_onPressGallery} style={style.mediaViewBtn}>
                            <View style={style.mediaViewCircle}>
                                <GalleryIcon width={24} height={24} stroke={'#fff'}/>
                            </View>
                            <Space directions={'v'} />
                            <DzText style={style.mediaViewText}>
                                {I19n.t('صور الهاتف')}
                            </DzText>
                        </Touchable>
                    </View>
                </Touchable>
            }
        </View>
    )
};

export default ChatRoom
