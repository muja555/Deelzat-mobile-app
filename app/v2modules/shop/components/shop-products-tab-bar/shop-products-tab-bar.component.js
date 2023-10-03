import React, { useState } from 'react';

import { shopProductsTabBarStyle as style } from './shop-products-tab-bar.component.style';
import I19n from "dz-I19n";
import {DzText, Touchable} from "deelzat/v2-ui";

const ShopProductsTabBar = (props) => {

    const {
        currentTab,
        onTabChanged = () => {},
        routes = [],
    } = props;


    const Button = ({route, index}) => {

        const isFocused = route === currentTab;

        const onPress = () => {
            onTabChanged(route);
        }

        const title = route.includes('USED')? I19n.t('مستعمل') : I19n.t('جديد');

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
                routes.map((route, index) => <Button key={index} index={index} route={route}/>)
            }
        </Touchable>
    );
};

export default ShopProductsTabBar;
