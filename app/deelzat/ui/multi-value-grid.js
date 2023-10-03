import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "./../style"
import DzText from "../v2-ui/dz-text";

const MultiValueGrid = (props) => {

    const {
        options = [],
        value = [],
        onChange = () => {},
        keyBy = 'key',
        labelBy = 'label',
        multi = true,
    } = props;

    const onItemPress = (item) => {
        let newValue = [];
        if (value) {
            const exist = value.find((i) => i[keyBy] === item[keyBy]);
            newValue = multi? value.filter((i) => i[keyBy] !== item[keyBy]) : []
            if(!exist) {
                newValue.push(item);
            }
        }
        else {
            newValue.push(item);
        }
        onChange(newValue);
    };


    const optionsContent = options.map((item) => {
       const selected = !!(value || []).find((i) => i[keyBy] === item[keyBy]);

       return React.useMemo(() => (
           <TouchableOpacity
               style={[style.item, selected? style.itemSelected : null, {opacity: !!item.disabled? 0.3 : 1}]}
               activeOpacity={1}
               disabled={!!item.disabled}
               onPress={() => onItemPress(item)}
               key={item[keyBy] + ""}>
               <DzText style={[style.itemText, selected ? style.itemTextSelected : null]}>
                   {item[labelBy]}
               </DzText>
           </TouchableOpacity>
       ), [onItemPress])
    })



    return(
        <View style={style.container}>
            {optionsContent}
        </View>
    )
};


export default MultiValueGrid;

const _style = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    item: {
        padding: 8,
        marginEnd: 4,
        marginBottom: 4,
        minWidth: 40,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.GREY
    },
    itemSelected: {
        backgroundColor: Colors.ACCENT_BLUE_100,
        borderColor: Colors.ACCENT_BLUE
    },
    itemText: {
        color: Colors.GREY
    },
    itemTextSelected: {
        color: Colors.ACCENT_BLUE
    }

};
const style = StyleSheet.create(_style);
