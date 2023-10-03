import React from 'react'
import {emptyConversationsStyle as
        style} from "./empty-conversations.component.style";
import {Image, Keyboard, Text, TouchableOpacity} from "react-native";
import {DzText} from "deelzat/v2-ui";

let EmptyConvIcon;
const EmptyConversations = (props) => {

    const {
        emptyItemsText,
        containerStyle = {},
    } = props;
    const onPress = () => {
        Keyboard.dismiss()
    }

    if (!EmptyConvIcon)
        EmptyConvIcon = require('assets/icons/EmptyConv.png');

    return (
        <TouchableOpacity activeOpacity={1}
                          style={[style.container, containerStyle]}
                          onPress={onPress}>
            <Image style={style.icon} source={EmptyConvIcon} defaultSource={EmptyConvIcon}/>
            <DzText style={style.emptyText}>
                {emptyItemsText}
            </DzText>
        </TouchableOpacity>
    )
}


export {EmptyConversations as EmptyConversations}
