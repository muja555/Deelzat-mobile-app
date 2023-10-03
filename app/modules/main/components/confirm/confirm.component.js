import React from 'react';
import {Text, View} from 'react-native';

import {confirmStyle as style} from './confirm.component.style';
import {Button, Space} from "deelzat/ui"
import uniqueId from "lodash/uniqueId";
import {DzText} from "deelzat/v2-ui";

const Confirm = (props) => {

    const {
        type = '',
        title = '',
        message = '',
        actions = [],
        onHide = () => {}
    } = props;

    const callback = (action) => {
        action.callback();
        onHide();
    };


    const actionsContent = actions.map((action) => {
       return (
           <View style={style.btn} key={uniqueId([''])}>
               <Button
                   onPress={() => callback(action)}
                   size={action.size}
                   type={action.type}
                   text={action.label}
               />
               <Space directions={'h'}/>
           </View>
       );
    });

    return (
        <View style={style.container}>
            {
                (message !== '') &&
                <View>
                    <DzText style={style.message}>{message}</DzText>
                    <Space size={'md'} directions={'h'}/>
                </View>
            }

            {actionsContent}
        </View>
    );
};

export default Confirm;
