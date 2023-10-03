import React from 'react';
import { View } from 'react-native';

import { reportStyle as style } from './report.component.style';
import ProductClaimInput from "modules/product/inputs/product-claim.input";
import ProductApi from "modules/product/apis/product.api";
import AlertService from "modules/main/others/alert.service";
import {Font} from "deelzat/style";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import I19n from "dz-I19n";

const REASON_KEYS = [
    'يحتوي على رسائل مزعجة',
    'يعرض محتوى حساس',
    'مسيء أو ضار',
    'منتجات غير قانونية',
    'معلومات المنتج خاطئة',
    'المنتج يؤدي الى العنف',
];


const Report = (props) => {

    const {
        itemId = '',
        isShop = false,
        onDone = () => {},
    } = props;

    const productClaim = (reason) => {

        (async () => {
            try {
                const inputs = new ProductClaimInput();
                inputs.claimable_info = itemId;
                inputs.reason = reason;
                await ProductApi.claim(inputs);
                AlertService.Success(I19n.t('إبلاغك يهمنا'), I19n.t('نشكر إهتمامك بتحسين تجربة مستخدمي ديلزات'));
                onDone();
            }
            catch (e) {
                console.warn(e);
                let errorMessage = '';
                if (e && e.status) {
                    if (e.status === 409) {
                        errorMessage = isShop?
                            I19n.t('لقد قمت بالإبلاغ مسبقا عن هذا المتجر'):
                            I19n.t('لقد قمت بالإبلاغ مسبقا عن هذا المنتج')
                    }
                }
                AlertService.Danger(I19n.t('نعتذر حصل خطأ ما'), errorMessage);
                onDone();
            }

        })();

    };

    const reasonsContent = REASON_KEYS.map((reason, index) => {
        return (
            <View key={index}>
                <Button
                    key={index}
                    btnStyle={style.actionSheetButton}
                    textStyle={Font.Bold}
                    onPress={() => productClaim(reason)}
                    size={ButtonOptions.Size.LG}
                    text={I19n.t(reason)}/>
                {
                    (index !== REASON_KEYS.length - 1) &&
                    <Space directions={'h'} size={'md'} />
                }
            </View>
        );
    });



    return (
        <View>
            {reasonsContent}
        </View>
    );
};

export default Report;
