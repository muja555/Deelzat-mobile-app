import React, {useCallback, useState} from 'react';
import {View, Image, TouchableOpacity, FlatList} from 'react-native';

import { productImagesEditListStyle as style } from './product-images-edit-list.component.style';
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";



const ProductImagesEditListItem = (props) => {
    const {
        image = {},
        index,
        onClick = (image, index) => {},
    } = props;

    const [isLoadImageFailed, isLoadImageFailedSet] = useState(false);

    const onError = () => {
         isLoadImageFailedSet(true);
    }

    const onLongPress = () => {
        ImagePreviewModalService.setVisible({
            show: true,
            imageUrl: image?.data?.uri || image?.uri
        });
    }

    const onPressOut = () => {
        ImagePreviewModalService.setVisible({
            show: false
        });
    }


    return (
        <TouchableOpacity key={image.id}
                          onPress={() => { onClick(image, index) }}
                          onLongPress={onLongPress}
                          onPressOut={onPressOut}>
            <View style={style.imageWrapper}>
                <Image style={[style.image,
                    index === 0 ? style.mainImage : null,
                    isLoadImageFailed && style.failedImage
                ]}
                       source={{uri: image.data?.uri || image.uri}}
                       onError={onError}/>
            </View>
        </TouchableOpacity>
    );
};


const ProductImagesEditList = (props, ref) => {

    const {
        images = [],
        onItemPress = (image, index) => {},
        onLongPress = (image) => {},
        onPressOut = (image) => {}
    } = props;

    const renderItem = useCallback(({item, index}) => {
        return (
            <ProductImagesEditListItem index={index}
                                       image={item}
                                       onClick={onItemPress}
                                       onLongPress={onLongPress}
                                       onPressOut={onPressOut}/>
        )
    }, []);


    return (
        <View style={style.container}>
            <FlatList
                ref={ref}
                horizontal={true}
                data={images}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default React.forwardRef(ProductImagesEditList);
