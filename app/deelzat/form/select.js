import React from 'react';
import {Text, View} from 'react-native';
import {formStyle as style} from "./style";
import UISelect from "./../ui/select";
import {Colors} from "../style";
import {DzText} from "../v2-ui";

const Select = (props) => {

    const {
        label = '',
        errorMessage = '',
        errorColorOnError = false,
        componentRef,
        ...rest
    } = props;

    return (
        <View>
            <View style={style.head}>
                {
                    (label !== '') &&
                    <DzText style={style.label}>{label}</DzText>
                }
                {
                    (errorMessage !== '') &&
                        <View style={style.errorMessageView}>
                            <DzText style={style.errorMessage}>{errorMessage}</DzText>
                        </View>
                }
            </View>
            <UISelect
                title={label}
                ref={componentRef}
                arrowColor={(errorColorOnError && errorMessage !== '')? Colors.ERROR_COLOR : Colors.GREY}
                buttonStyle={(errorColorOnError && errorMessage !== '') && style.selectError}
                {...rest}
            />
        </View>
    )


};

export default Select;
