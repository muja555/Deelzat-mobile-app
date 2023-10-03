import React from 'react'
import {TouchableOpacity, View, Text, Image} from 'react-native'
import {CollapsibleTopTabsButtonsStyle as style} from "./collapsible-top-tabs-buttons.component.style";
import {useRoute} from "@react-navigation/native";
import {trackClickOnPageTab} from "modules/analytics/others/analytics.utils";
import {DzText} from "deelzat/v2-ui";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const CollapsibleTopTabsButtons = (props) => {

    const {
        tabs,
        currentTabKey,
        isNewStyle = false,
    } = props;

    const route = useRoute();

    const onPress = (tabKey) => {
        trackClickOnPageTab(tabKey)
        RootNavigation.navigate(route.name, {screen: tabKey})
    }

    const TabButton = ({tab}) => {
        const isSelected = currentTabKey === tab.key;
        return <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onPress(tab.key)}
            style={[
                style.optionButton,
                isSelected && (isNewStyle ? style.newSelectedButton : style.selectedButton),
                {width: `${(1 / tabs.length) * 100}%`},
            ]}>
            <DzText style={[style.buttonText, (isNewStyle && isSelected) && style.selectedButtonText]}>
                {tab.name}
            </DzText>
        </TouchableOpacity>
    }


    return (
        <View>
            <View style={[style.container, isNewStyle && style.newContainerHeight]}>
                {
                    tabs.map(tab => <TabButton key={tab.key} tab={tab}/>)
                }
            </View>
            {
                !isNewStyle &&
                <Image source={require('assets/icons/SimpleShadow.png')} style={[style.shadowView, isNewStyle && style.newShadowView]}/>
            }
        </View>
    )

}

export default CollapsibleTopTabsButtons;
