import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import Modal from "react-native-modal";
import CloseIcon from "assets/icons/Close.svg"

import { subCategoriesModalStyle as style } from './sub-categories.modal.style';
import {Colors} from "deelzat/style";
import {Space} from "deelzat/ui";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import {useSelector} from "react-redux";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {getLocale} from "dz-I19n";
import {refactorImageUrl} from "modules/main/others/main-utils";

let timeoutId;
const SCREEN_WIDTH = Dimensions.get('window').width;
function SubCategoriesModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const {
            onSelect = (category, subCategory) => {},
            onHide = () => {},
        } = props;

        const [isVisible, isVisibleSet] = useState(false);
        const [isMounted, isMountedSet] = useState(false);
        const [category, categorySet] = useState({});
        const allSubCategories = useSelector(persistentDataSelectors.subCategoriesSelector);
        const [subCategories, subCategoriesSet] = useState([]);

        useEffect(() => {
            timeoutId = setTimeout(() => {
                isMountedSet(isVisible);
            }, isVisible? 0 : 300)

            return () => {
                clearTimeout(timeoutId);
            }
        }, [isVisible]);


        this.show = (show = true, showOptions = {}) => {
            isVisibleSet(show);
        };

        this.setOptions = ({category}) => {
            categorySet(category);
            const children = (category.children || []).filter((item) => item !== false);
            const subs = children.map((item) => allSubCategories[item]);
            subCategoriesSet(subs);
        }

        const renderItem = useCallback(({item, index}) => {

            const isInFullRow = index % 2 === 0 && index === subCategories.length - 1;

            return (
                <Touchable onPress={() => onSelect(category, item)} style={[style.cellView,  !isInFullRow && {[index % 2 === 0? 'marginEnd' : 'marginStart']: 8}]}>
                    <ImageWithBlur
                        resizeMode='cover'
                        useFastImage={true}
                        resizeMethod="resize"
                        style={style.cellImage}
                        imageUrl={refactorImageUrl(item.image, SCREEN_WIDTH/2)}
                        thumbnailUrl={refactorImageUrl(item.image, 1)}
                    />
                </Touchable>
            )
        }, [subCategories]);

        const keyExtractor = useCallback((item) => "" + item.objectID, []);
        const ItemSeparatorComponent = useCallback(() => <Space directions={'h'} size={'md'}/>, []);

        if (!isMounted) {
            return <></>
        }

        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                style={style.container}>
                <View style={style.content}>
                    <View style={style.header}>
                        <DzText style={style.title}>
                            {category[getLocale()]?.title}
                        </DzText>
                        <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                                   onPress={onHide}>
                            <CloseIcon
                                fill={Colors.N_BLACK}
                                width={16}
                                height={16}/>
                        </Touchable>
                    </View>
                    <Space directions={'h'} size={'md'}/>
                    <Space directions={'h'} />
                    <FlatList data={subCategories}
                              renderItem={renderItem}
                              keyExtractor={keyExtractor}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={style.listContents}
                              ItemSeparatorComponent={ItemSeparatorComponent}
                              numColumns={2}/>
                </View>
            </Modal>
        );
    };
};


const useSubCategoriesModal = () => {
    return new SubCategoriesModal();
};
export default useSubCategoriesModal;
