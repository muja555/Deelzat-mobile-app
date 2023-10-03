import React from 'react';

import { topTabBarStyle as style } from './top-tab-bar.component.style';
import {DzText, Touchable} from "deelzat/v2-ui";

const TopTabBar = (props) => {

    const {
        tabConfigs = {},
        state,
        navigation,
    } = props;


    const Button = ({route, index}) => {

        const isFocused = state.index === index;

        const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true });
            }
        }

        const title = tabConfigs[route.name].title;

        return (
            <Touchable onPress={onPress}
                       style={[style.btn, !isFocused && style.btnInactive]}>
                <DzText style={[style.label, tabConfigs[route.name].titleStyle, !isFocused && style.labelInactive]}>
                    {title}
                </DzText>
            </Touchable>
        )
    }


    return (
        <Touchable style={style.container}>
            {
                state.routes.map((route, index) => <Button key={index} index={index} route={route}/>)
            }
        </Touchable>
    );
};

export default TopTabBar;
