import React from 'react';
import { View } from 'react-native';

import { actionSheetStyle as style } from './action-sheet.component.style';
import * as _ from "lodash";
import {Button, Space} from 'deelzat/ui';
import {DzText} from "deelzat/v2-ui";


const ActionSheet = (props) => {

    const {
        children = null,
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
            <View style={style.btn} key={_.uniqueId([''])}>
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
            {children}
        </View>
    );
};

export default ActionSheet;
