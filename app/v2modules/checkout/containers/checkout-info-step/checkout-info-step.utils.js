import I19n from 'dz-I19n';
import { Colors, Font, LayoutStyle, Spacing } from 'deelzat/style';
import PanelHandle from 'assets/icons/PanelHandle.svg';
import React from 'react';
import { DzText } from 'deelzat/v2-ui';
import { View } from 'react-native';
import {isRTL} from "dz-I19n";

const AddressesOptionConst = {};
AddressesOptionConst.COPY_BUYER_INFO = 'COPY_BUYER_INFO';
AddressesOptionConst.ADD_NEW_ADDRESS = 'ADD_NEW_ADDRESS';
Object.freeze(AddressesOptionConst);
export {AddressesOptionConst}



const getAddressOptions = (isDisabled = false) => {
    const isrtl = isRTL();
    return [
        {
            key: AddressesOptionConst.COPY_BUYER_INFO,
            label: I19n.t('التوصيل لعنواني الحالي'),
            disabled: isDisabled,
        },
        {
            key: AddressesOptionConst.ADD_NEW_ADDRESS,
            label: (
                <View style={{ flexDirection:  isrtl? 'row': 'row-reverse' , alignItems: 'center' }}>
                    <View style={{flex: 1, paddingTop: isrtl? 2: 4, height: '100%'}}>
                        <PanelHandle stroke={Colors.N_BLACK}
                                     strokeWidth={1}
                                     width={14}
                                     style={LayoutStyle.Flex}
                                     height={14} />
                    </View>
                    <View style={{width: 10}} />
                    <DzText style={Font.Bold}>
                        {I19n.t('أدخل عنوان توصيل جديد')}
                    </DzText>
                </View>
            ),
        }
    ]
}
export {getAddressOptions}
