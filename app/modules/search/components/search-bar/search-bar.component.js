import React, {useEffect, useRef, useState} from 'react'
import {TextInput, TouchableOpacity, Animated, Easing} from 'react-native';
import {searchBarStyle as style} from "./search-bar.component.style";
import SearchIcon from 'assets/icons/NewSearch.svg'
import {Colors, LocalizedLayout} from 'deelzat/style'
import CloseIcon from 'assets/icons/Close.svg'

const SearchBar = (props) => {

    const {
        isAnimatable = false, // if will support expand/collapse or just a typical search bar
        isExpanded = false,
        onExpandCollapse = () => {},
        placeholderText = 'ابحث عن أي شيء',
        placeholderTextColor = Colors.DARK_GREY,
        inputTextStyle = {},
        containerStyle = {},
        onChangeText = () => {},
        searchSubmit = () => {},
    } = props;

    const [isAnimating, isAnimatingSet] = useState(false);
    const [inputText, textTextSet] = useState('');

    const textIsFilled = inputText?.trim().length > 0;
    const contentAnim = useRef(new Animated.Value(isExpanded? 1 : 0)).current;
    const textOpacityAnim = useRef(new Animated.Value(isExpanded? 1 : 0)).current;
    const borderColorAnim = useRef(new Animated.Value(isExpanded? 1 : 0)).current;

    useEffect(() => {
        isAnimatingSet(true);
        Animated.parallel([
            Animated.timing(textOpacityAnim, {
                toValue: isExpanded ? 1 : 0,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true
            }),
            Animated.timing(contentAnim, {
                toValue: isExpanded ? 1 : 0,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false
            }),
            Animated.timing(borderColorAnim, {
                toValue: isExpanded ? 1 : 0,
                duration: 250,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false
            })

        ]).start(() => {
            isAnimatingSet(false);
        })
    }, [isExpanded])

    const _onChangeText = (text) => {
        textTextSet(text);
        onChangeText(text);
    }

    const clearText = () => {
        if (textIsFilled)
            _onChangeText('')
        else if (!isAnimating && isAnimatable)
            onExpandCollapse()
    }

    const onPress = () => {
        if (textIsFilled)
            searchSubmit()
         else if (!isAnimating && isAnimatable)
            onExpandCollapse()
    }

    const containerWidth = contentAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: ["20%", "100%"],
    });

    const borderColor = borderColorAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: ['#D1D1D100', style.searchSection.borderColor]
    });

    return (
          <Animated.View style={[style.searchSection,
              containerStyle,
              isAnimatable && {width: containerWidth, borderColor: borderColor}]}>
              <TouchableOpacity style={style.searchIcon} activeOpacity={0.8} onPress={onPress}>
                  <SearchIcon style={style.searchIconInner} width={40} height={20} fill={Colors.Gray400}/>
              </TouchableOpacity>
              <Animated.View style={[style.inputContainer, isAnimatable && {opacity: textOpacityAnim}]}>
                  <TextInput
                      direction={'ltr'}
                      style={[style.input, inputTextStyle, LocalizedLayout.TextAlign()]}
                      placeholderTextColor={placeholderTextColor}
                      placeholder={placeholderText}
                      onChangeText={_onChangeText}
                      value={inputText}
                      onSubmitEditing={searchSubmit}/>
              </Animated.View>
              {
                  ((!isAnimatable && textIsFilled) || (isAnimatable && isExpanded)) &&
                  <TouchableOpacity hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}
                                    onPress={clearText}
                                    activeOpacity={0.8}
                                    style={style.clearTextButton}>
                      <CloseIcon fill={Colors.GREY} width={40} hegiht={40}/>
                  </TouchableOpacity>
              }
          </Animated.View>
    );
}

export default SearchBar;
