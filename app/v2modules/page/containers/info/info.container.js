import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Dimensions} from 'react-native';

import { infoContainerStyle as style } from './info.container.style';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import {getLocale, isRTL} from "dz-I19n";
import PersistentDataApi from "modules/main/apis/persistent-data.api";
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout, Spacing} from "deelzat/style";
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import {DzText, Panel, TextParser} from "deelzat/v2-ui";
import PanelHandle from "assets/icons/PanelHandle.svg";
import WillShowToast from "deelzat/toast/will-show-toast";

let FAQs;
const InfoContainer = (props) => {
    const {
        title = '',
        data = {}
    } = props.route?.params || {};

    const [sections, sectionsSet] = useState([data]);
    const [expandedSection, expandedSectionSet] = useState();
    const [showSections, showSectionsSet] = useState(!data.requestFomIndex);

    useEffect(() => {
        if (data.requestFomIndex) {
            if (!FAQs) {
                PersistentDataApi.getFaqs()
                    .then((_sections) => {
                        FAQs = _sections;
                        sectionsSet(_sections);
                        setTimeout(() => showSectionsSet(true), 50);
                    })
                    .catch(console.warn);
            }
            else {
                sectionsSet(FAQs);
                showSectionsSet(true);
            }

        }
    }, [])


    const SectionHandle = () => {
        return (
            <PanelHandle stroke={Colors.MAIN_COLOR}
                         strokeWidth={1.5}
                         width={16}
                         height={16}/>
        )
    }

    const onPressSection = (id) => {
        expandedSectionSet(current => {
            return current !== id && id;
        })
    }

    const renderSections = sections.map((section, index) => {

        const content = section[getLocale()];
        const isExpanded = sections.length === 1 || expandedSection === index;

        if (!content)
            return (
                <View key={"_" + index}/>
            );

        const header = (
            <View style={style.headerView}>
                <DzText style={[style.headerText, LocalizedLayout.TextAlign(isRTL())]}>
                    {content.title}
                </DzText>
            </View>
        );

        return (
            <View key={"_" + index}>
                <View style={Spacing.HorizontalPadding}>
                    <Panel header={header}
                           isExpanded={isExpanded}
                           CustomHandle={SectionHandle}
                           initialHeight={style.headerView.height}
                           onExpandCollapse={() => onPressSection(index )}>
                        <View style={[isRTL() && {paddingEnd: 24}]}>
                            <TextParser content={content.body}
                                        textStyle={[style.sectionText, LocalizedLayout.TextAlign(isRTL()), {paddingEnd: isRTL()? 24: 0}]}/>
                            <Space directions="h" size={'md'} />
                        </View>
                    </Panel>
                </View>
                {
                    (index < sections.length - 1) &&
                    <View style={style.sectionSeparator}/>
                }
            </View>
        )
    });

    return (
        <SafeAreaView style={style.container}>
            <WillShowToast id={'info'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                            type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {title}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
            <View style={{height: 60}}/>
            <ScrollView showsVerticalScrollIndicator={false} style={!showSections && {opacity: 0}}>
                <View style={style.content}>
                    {renderSections}
                </View>
                <Space directions={'h'} size={'md'}/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default InfoContainer;
