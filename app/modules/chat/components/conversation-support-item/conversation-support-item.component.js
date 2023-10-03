import React, { useMemo } from 'react';
import {conversationSupportStyle as style} from "./conversation-support-item.component.style";
import I19n from 'dz-I19n';
import {Text, TouchableOpacity, View, Image} from "react-native";
import {DzText} from "deelzat/v2-ui";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import { useSelector } from 'react-redux';
import { chatSelectors } from 'modules/chat/stores/chat/chat.store';

const ConversationSupportItem = (props) => {

    const {
        item = {},
        onPress = (item) => {},
        chatProfile = {},
        containerStyle = {},
    } = props;

    const unreadMessages = useSelector(chatSelectors.unreadMessagesSelector);
    const unreadCount = useMemo(() => {
        return unreadMessages[item.lastMessageSender] || 0;
    }, [unreadMessages]);

    const getMessageText = () => {

        if (!item.lastMessage) {
            return I19n.t('في حال احتجت لأي مساعدة، تواصل معنا')
        }

        const isThisSender = chatProfile.userId === item.lastMessageSender;

        if (item.lastMessage === 'image' && isThisSender) {
            return I19n.t('لقد قمت بإرسال صورة')
        } else if (item.lastMessage === 'image') {
            return I19n.t('قام بإرسال صورة')
        } else {
            return `${isThisSender? (I19n.t('أنت:') + ' ') : ''}${item?.lastMessage}`;
        }
    }

    const onLongPress = () => {
        ImagePreviewModalService.setVisible({
            show: true,
            asRectangle: true,
            imageUrl: item?.otherUser?.avatar
        });
    };

    const onPressOut = () => {
        ImagePreviewModalService.setVisible({
            show: false
        });
    }

    return (
            <TouchableOpacity activeOpacity={0.7}
                              onPress={onPress}
                              onLongPress={onLongPress}
                              onPressOut={onPressOut}
                              style={[style.allContainer, style.container, containerStyle]}>
                <Image style={style.senderImage} source={{uri: item?.otherUser?.avatar}}/>
                <View style={style.textContainer}>
                    <View style={style.senderNameContainer}>
                        <View style={style.nameContainer}>
                            <DzText style={style.senderName} numberOfLines={1}>
                                {I19n.t('فريق ديلزات')}
                            </DzText>
                            <View style={style.onlineDot}/>
                        </View>
                        <DzText style={style.messageTime}>
                            {I19n.t('متواجدين 24/7')}
                        </DzText>
                    </View>
                    <View style={style.messageTextAndUnreadCountContainer}>
                        <DzText style={[style.lastMessageText, unreadCount > 0 && style.lastMessageTextUnread]}
                              numberOfLines={1}>
                            {getMessageText()}
                        </DzText>
                        {
                            unreadCount > 0 &&
                            <View style={style.unreadCountContainer}>
                                <DzText style={style.unreadCount}>
                                    {unreadCount}
                                </DzText>
                            </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
    )
}
export default ConversationSupportItem
