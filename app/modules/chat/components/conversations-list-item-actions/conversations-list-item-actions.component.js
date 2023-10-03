import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {conversationsListItemActionsStyle as style} from "./conversations-list-item-actions.component.style";
import StarIcon from 'assets/icons/Star.svg'
import DeleteIcon from 'assets/icons/NewDelete.svg'
import {Colors} from "deelzat/style";
import ConversationActionsConst from "modules/chat/constants/conversation-actions.const";

const ConversationsListItemAction = ({item, onClickAction}) =>
    <View style={style.container}>
        <View style={style.buttonsContainer}>
            <TouchableOpacity style={style.icon} onPress={() => onClickAction(item, ConversationActionsConst.DELETE)}>
                <DeleteIcon stroke={Colors.ERROR_COLOR}/>
            </TouchableOpacity>
            <TouchableOpacity style={style.icon}
                              onPress={() => onClickAction(item, item.isStarred ? ConversationActionsConst.REMOVE_STAR : ConversationActionsConst.ADD_STAR)}>
                <StarIcon fill={item.isStarred ? Colors.YELLOW : 'white'}/>
            </TouchableOpacity>
        </View>
    </View>


export default ConversationsListItemAction
