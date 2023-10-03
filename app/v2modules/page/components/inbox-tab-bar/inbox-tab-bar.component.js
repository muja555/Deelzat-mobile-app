import React, { useState } from 'react';

import { inboxTabBarStyle as style } from './inbox-tab-bar.component.style';
import {DzText, Touchable} from "deelzat/v2-ui";

import {getTabsOptions} from "./inbox-tab-bar.util";
import InboxRoutesConst from 'modules/chat/constants/inbox-routes.const';

const InboxTabBar = (props) => {

    const {
        currentTab,
        onPressTab = (selectedTab) => {}
    } = props;

    const [TabOptions] = useState(getTabsOptions());
    const [tabs] = useState([InboxRoutesConst.MESSAGES, InboxRoutesConst.STARRED_MESSAGES]);

    const Button = ({route}) => {

        const isFocused = currentTab === route;
        const option = TabOptions[route];

        const onPress = () => {
            onPressTab(route);
        }

        const title = option?.label;

        return (
            <Touchable onPress={onPress}
                       style={[style.btn, !isFocused && style.btnInactive]}>
                <DzText style={[style.label, !isFocused && style.labelInactive]}>
                    {title}
                </DzText>
            </Touchable>
        )
    }


    return (
        <Touchable style={style.container}>
            {
                tabs.map((route, index) => <Button key={index} index={index} route={route}/>)
            }
        </Touchable>
    );
};

export default InboxTabBar;
