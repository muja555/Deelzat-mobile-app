import React, {useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import DeepLinkingService from "modules/root/others/deeplinking.service";
import {routeTo} from "./deeplinks-router.utils";

const DeepLinksRouter = () => {

    const isFocused = useIsFocused();

    useEffect(() => {
        return DeepLinkingService.onNavigateToLink((linkInfo) => {
            if (isFocused) {
                routeTo(linkInfo.type,
                    linkInfo.id,
                    linkInfo.trackSource,
                    linkInfo.extra)
            }
        })
    }, [isFocused])

    return <></>;
};

export default DeepLinksRouter;
