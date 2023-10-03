import React from 'react';
import { View } from 'react-native';

import { addonsListStyle as style } from './addons-list.component.style';
import {Space} from "deelzat/ui";
import AddonListItem from "v2modules/shared/components/addon-list-item/addon-list-item.component";

const AddonsList = (props) => {

    const {
        addonsList = [],
        currencyCode = '',
        onChangeAddons = (addonsList) => {}
    } = props;


    const onChangeAddon = (changedAddon) => {
        const changedIndex = addonsList.findIndex(item => item.objectID === changedAddon.objectID)
        const _addonsList = [... addonsList]
        _addonsList[changedIndex] = changedAddon
        onChangeAddons(_addonsList)
    }


    return (
        <View style={style.container}>
            {addonsList.map(addon =>
                <View key={addon.objectID}>
                    <AddonListItem addon={addon}
                                   currencyCode={currencyCode}
                                   onChangeAddon={onChangeAddon}/>
                    <Space directions={'h'} size={'md'} />
                </View>
            )}
        </View>
    );
};

export default AddonsList;
