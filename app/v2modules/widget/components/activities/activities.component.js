import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';

import { activitiesStyle as style } from './activities.component.style';
import ActivitiesItem from "v2modules/widget/components/activities-item/activities-item.component";
import GroupsInput from "v2modules/widget/inputs/groups.input";
import GroupsApi from "v2modules/widget/apis/groups.api";
import WidgetCategoriesConst from "v2modules/widget/constants/widget-categories.const";
import {trackClickOnActivity} from "modules/analytics/others/analytics.utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {routeToProducts} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import {DzText} from "deelzat/v2-ui";
import {getLocale, isRTL} from "dz-I19n";
import {Colors} from "deelzat/style";


// As seen on Figma, width / height
const SCALE = 352 / 167;
const paddingHorizontal = 17;
// screen width - padding
const SCREEN_WIDTH = Dimensions.get('window').width - (paddingHorizontal * 2);

const Activities = (props) => {

    const {
        componentFilter,
        ...rest
    } = props;

    const browseCountryCode = useSelector(geoSelectors.geoBrowseCountryCodeSelector);
    const [activities, activitiesSet] = useState([]);

    /**
     * Arrange data to be placed as the following:
     * [      item 1       ]
     * [ item 2 ] [ item 3 ]
     * [      item 4       ]
     * [ item 5 ] [ item 6 ]
     */
    const mapData = (res = []) => {
        const _activities = [];
        for (let index = 0; index < res.length; index++) {
            if (index % 3 === 0) {
                _activities.push([res[index]]);
                _activities.push([]);
            }
            else {
                _activities[_activities.length - 1].push(res[index]);
            }
        }
        activitiesSet(_activities);
    }

    useEffect(() => {

        if (!browseCountryCode) {
            return;
        }

        activitiesSet([]);
        const input = new GroupsInput();
        input.countryCode = browseCountryCode;
        input.componentFilter = componentFilter;
        input.category = WidgetCategoriesConst.ACTIVITIES;
        GroupsApi.getItems(input)
            .then(mapData)
            .catch(console.warn);

    }, [browseCountryCode]);


    const renderItem = useCallback(({item, index}) => {

        const onPress = (item) => {
            const trackSource = {name: EVENT_SOURCE.ACTIVITY, attr1: item.objectID, attr2: componentFilter};
            routeToProducts({id: item.filters}, trackSource);
            trackClickOnActivity(item, index, componentFilter);
        }

        const rowStyle = {paddingHorizontal: paddingHorizontal, height: SCREEN_WIDTH / SCALE};
        return (
            <View style={rowStyle}>
                {
                    (index % 2 === 0) &&
                    <ActivitiesItem item={item[0]} onPress={onPress}/>
                }
                {
                    (!!item[0]?.button) &&
                    <DzText style={[style.buttonText,
                        {[isRTL()? 'right': 'left']: 13},
                        {color: item[0].button.textColor ?? Colors.N_BLACK},
                        {backgroundColor: item[0].button.backgroundColor ?? 'white'}
                    ]}>
                        {item[0].button[getLocale()]}
                    </DzText>
                }
                {
                    (index % 2 !== 0) &&
                        <View style={style.listRowMultiple}>
                            {
                                (!!item[0]) &&
                                <ActivitiesItem viewStyle={style.listItemStart} item={item[0]} onPress={onPress}/>
                            }
                            {
                                (item.length > 1 && !!item[1]) &&
                                <ActivitiesItem viewStyle={style.listItemEnd} item={item[1]} onPress={onPress}/>
                            }
                        </View>
                }
            </View>
        )
    }, []);

    const renderSeparator = useCallback(() => {
        return (
            <View style={style.listSeparator}/>
        )
    }, []);

    const keyExtractor = useCallback((item, index) => `item_${index}`, []);

    return (
        <FlatList
            data={activities}
            renderItem={renderItem}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={renderSeparator}
            ListFooterComponent={renderSeparator}
            {...rest}/>
    )
}

export default Activities;
