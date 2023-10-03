import React from 'react';
import {View, Text, ScrollView, Keyboard} from 'react-native';

import { recentSearchStyle as style } from './recent-search.component.style';
import I19n, {isRTL} from "dz-I19n";
import {Space} from "deelzat/ui";
import EmptyIconAR from "assets/icons/EmptySearchAR.svg";
import EmptyIconEN from "assets/icons/EmptySearchEN.svg";
import {DzText, Touchable} from "deelzat/v2-ui";
import {LayoutStyle, LocalizedLayout} from "deelzat/style";
import CloseSvg from "assets/icons/Close.svg";

const RecentSearch = (props) => {

    const {
        recentSearch = [],
        onModifyRecentList = ([]) => {},
    } = props;


    if (recentSearch.length > 0) {

        const onItemPress = (item, index) => {
            let newRecentList = recentSearch;
            if (!recentSearch.length || recentSearch.length > 0 && recentSearch[0] !== item) {
                newRecentList = recentSearch.filter((_, i) => i !== index);
                newRecentList.unshift(recentSearch[index]);
            }
            onModifyRecentList(newRecentList, item);
        }

        const onPressClear = () => {
            onModifyRecentList([]);
        }

        const onPressClearItem = (index) => {
            const _array = [...recentSearch];
            _array.splice(index, 1);
            onModifyRecentList(_array);
        }

        const recentItems = recentSearch.map((item, index) => {
            return (
                <Touchable onPress={() => onItemPress(item, index)}
                           key={`recent_${index}`}
                           style={style.recentRow}>
                    <DzText style={[style.recentText, LocalizedLayout.TextAlign(true)]}>
                        {item}
                    </DzText>
                    <Touchable hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                               onPress={() => onPressClearItem(index)}>
                        <CloseSvg stroke={'black'}
                                  width={16}
                                  height={16}/>
                    </Touchable>
                </Touchable>
            )
        });


        return (
            <View style={LayoutStyle.Flex}>
                <View style={style.header}>
                    <DzText style={style.recentTitle}>
                        {I19n.t('ما تم البحث عنه')}
                    </DzText>
                    <Touchable style={style.clearBtn} onPress={onPressClear}>
                        <DzText style={style.clearText}>
                            {I19n.t('مسح الجميع')}
                        </DzText>
                    </Touchable>
                </View>
                <Space directions={'h'} size={'md'} />
                <ScrollView onScroll={Keyboard.dismiss}
                            keyboardShouldPersistTaps={'handled'}
                            showsVerticalScrollIndicator={false}>
                    {recentItems}
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={style.container}>
            {
                (isRTL()) &&
                <View style={{alignItems: 'flex-start'}}>
                    <EmptyIconAR />
                    <DzText style={[style.emptyTextBigAR, {textAlign: 'left'}]}>
                        ﺷﻔﻨﺎك، ﺑﺘﺪور ﻋﺈﺷﻲ ﻣﻌﻴﻦ؟
                    </DzText>
                    <Space directions={'h'} />
                    <Space directions={'h'} size={'md'} />
                    <DzText style={style.emptyText}>
                        يلا، إبدأ بالبحث عما يخطر ببالك من منتجات، متاجر وعروض
                    </DzText>
                </View>
            }
            {
                (!isRTL()) &&
                <>
                    <EmptyIconEN />
                    <Space directions={'h'} size={'sm'} />
                    <Space directions={'h'} />
                    <DzText style={style.emptyText}>
                        Start discovering our wide variety
                    </DzText>
                    <DzText style={style.emptyText}>
                        of products, deals, and shops.
                    </DzText>
                </>
            }
        </View>
    );
};

export default RecentSearch;
