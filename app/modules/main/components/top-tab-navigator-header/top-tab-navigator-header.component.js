import React, {useState} from 'react'
import {Animated} from 'react-native'
import {topTabNavigatorHeaderStyle as style} from "./top-tab-navigator-header.component.style";
import CollapsibleTopTabsButtons from "modules/main/components/collapsible-top-tabs-buttons/collapsible-top-tabs-buttons.component";

const TopTabNavigatorHeader = (props) => {

    const {
        makeSpaceForTopHeader,
        positionAnimation,
        onLayoutHeaderHeight = (height) => {},
        tabs,
        currentTabKey,
        children,
        isNewStyle = false,
        isCollapsible = true,
    } = props

    const TOP_TAB_BUTTONS_HEIGHT = isNewStyle? 83 : 55;
    const [viewHeight, viewHeightSet] = useState(0)

    let yMargins = TOP_TAB_BUTTONS_HEIGHT;

    const translateY = positionAnimation?.interpolate({
        inputRange: [0, Math.max(viewHeight - yMargins, 0)],
        outputRange: [0, -(viewHeight - yMargins)],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[style.container,
                isCollapsible &&  {transform: [{translateY}]},
                makeSpaceForTopHeader && {marginTop: TOP_TAB_BUTTONS_HEIGHT}]}
            onLayout={e => {
                const height = Math.ceil(e.nativeEvent.layout.height);
                if (height > viewHeight) {
                    viewHeightSet(height)
                    onLayoutHeaderHeight(height - TOP_TAB_BUTTONS_HEIGHT)
                }
            }}>
            {children}
            <CollapsibleTopTabsButtons isNewStyle={isNewStyle} tabs={tabs} currentTabKey={currentTabKey}/>
        </Animated.View>
    )

}

export default TopTabNavigatorHeader
