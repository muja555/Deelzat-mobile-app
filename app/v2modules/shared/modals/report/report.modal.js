import React, { useState } from 'react';
import {View, Text, Platform} from 'react-native';
import Modal from "react-native-modal";

import { reportModalStyle as style } from './report.modal.style';
import {useSelector} from "react-redux";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import SIGNUP_SOURCE from "modules/analytics/constants/analytics-signup-source.const";
import Report from "v2modules/shared/components/report/report.component";
import I19n from "dz-I19n";

function ReportModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const {
            itemId = '',
            isShop = false,
        } = props;

        const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
        const [isVisible, isVisibleSet] = useState(false);

        this.show = (show = true, showOptions = {}) => {

            if (show && isAuthenticated) {
                isVisibleSet(true);
            }
            else if (show) {
                AuthRequiredModalService.setVisible({
                    message: I19n.t('أنشئ حساب لتتمكن من الإبلاغ'),
                    trackSource: {name: SIGNUP_SOURCE.REPORT, attr1: itemId},
                    onAuthSuccess: () => setTimeout(() => isVisibleSet(true), Platform.OS === 'ios'? 500: 0)
                });
            }
            else {
                isVisibleSet(false);
            }
        };

        const onHide = () => {
            isVisibleSet(false);
        };


        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                style={style.container}>
                <View style={style.content}>
                    <Report itemId={itemId}
                            isShop={isShop}
                            onDone={isVisibleSet}/>
                </View>
            </Modal>
        );
    };
};


const useReportModal = () => {
    return new ReportModal();
};
export default useReportModal;
