import React, {useEffect} from 'react';
import Modal from "react-native-modal";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, Font} from "deelzat/style"
import I19n from 'dz-I19n';
import DzText from "../v2-ui/dz-text";

const _style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        maxHeight: '80%'
    },
    list: {
      paddingHorizontal: 32,
        paddingBottom: 32,
        width: '100%'
    },
    item: {
        paddingVertical: 8,
        textAlign: 'center',
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#fff"
    },
    text: {
      color: '#000'
    },
    selectedItem: {
        backgroundColor: Colors.LIGHT_BLUE,
        borderColor: Colors.ACCENT_BLUE
    },
    selectedText: {
        color: Colors.ACCENT_BLUE,
    },
    head: {
        width: '100%',
        paddingHorizontal: 16
    },
    doneView: {
        height: 50,
        alignItems:'flex-end',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 10,
        marginHorizontal: 16,
    },
    doneText: {
        color: Colors.ACCENT_BLUE,
        ...Font.Bold
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 8,
        ...Font.Bold
    },
    headerPadding: {
        height: 32,
    }
};
const style = StyleSheet.create(_style);

const SelectModalOptions = {
    HideType: {
        DONE: 'DONE',
        CANCEL: 'CANCEL',
    }
};
export { SelectModalOptions as SelectModalOptions };

const SelectModal = (props) => {

    const {
        keyBy = 'key',
        labelBy = 'label',
        isVisible = false,
        options = [],
        selected = null,
        onSelect = () => {},
        onHide = (type) => {},
        title = '',
        multi = false,
        DoneLabel = I19n.t('تم')
    } = props;

    const onItemSelect = (item) => {
        if (multi) {
            let newSelected = [];
            if (selected) {
                const exist = selected.find((i) => i[keyBy] === item[keyBy]);
                newSelected = selected.filter((i) => i[keyBy] !== item[keyBy]);
                if(!exist) {
                    newSelected.push(item);
                }
            }
            else {
                newSelected.push(item);
            }
            onSelect(newSelected);
        }
        else {
            onSelect(item);
            onHide(SelectModalOptions.HideType.DONE, item);
        }

    };

    const isSelected = (item) => {

        if(!selected) {
            return  false;
        }
        if (multi) {
            return !!selected.find((i) => i[keyBy] === item[keyBy]);
        }
        else {
            return selected[keyBy] === item[keyBy]
        }

    };

    const list = options.map((item) => {

        const isItemSelected =  isSelected(item);
        const onPress = () => {
            onItemSelect(item);
        }

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[style.item, isItemSelected ? style.selectedItem : null]}
                key={item[keyBy]}
                onPress={onPress}>
                <DzText style={[style.text, isItemSelected ? style.selectedText : null]}> {item[labelBy]} </DzText>
            </TouchableOpacity>
        );
    });

    useEffect(() => {

        if (multi && selected && !Array.isArray(selected)) {
            throw "Select: selected should array when multi = true"
        }

    }, [multi, selected]);

    return (
        <Modal
            onBackButtonPress={() => onHide(SelectModalOptions.HideType.CANCEL)}
            onBackdropPress={() => onHide(SelectModalOptions.HideType.CANCEL)}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            isVisible={isVisible}
            style={style.container}>
            <View style={style.content}>
                <View style={style.head}>
                    <View style={style.headerPadding}/>
                    {
                        multi &&
                        <TouchableOpacity
                            style={style.doneView}
                            hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
                            onPress={() => onHide(SelectModalOptions.HideType.DONE)}>
                            <DzText style={style.doneText}> {DoneLabel} </DzText>
                        </TouchableOpacity>
                    }
                </View>
                {
                    (title !== '') &&
                    <DzText style={style.title}> {title} </DzText>
                }

                <ScrollView contentContainerStyle={style.list}>
                    {list}
                </ScrollView>

            </View>
        </Modal>
    );

};

export default SelectModal;
