import React from 'react';
import { Text } from 'react-native';

import { productListTabBarStyle as style } from './product-list-tab-bar.component.style';
import {Touchable} from "deelzat/v2-ui";
import I19n from "dz-I19n";
import {DzText} from "deelzat/v2-ui";

const ProductListTabBar = (props) => {

    const {state, navigation} = props;

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

        const title = route.name.includes('USED')? I19n.t('مستعمل') : I19n.t('جديد');

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
                state.routes.map((route, index) => <Button key={index} index={index} route={route}/>)
            }
        </Touchable>
    );
};

export default ProductListTabBar;
