import React from "react";
import {Font} from "../style";
import DzText from "./dz-text";

/**
 * See Algolia index: "faqs" or "static_content",
 */
const TextParser = (props) => {
    const {
        content = [],
        textStyle = {},
    } = props;

    return (
        <DzText style={textStyle}>
            {content.map(((_text, index) => {
                let text = _text;
                let isBold = false;
                if (text.startsWith("#b#")) {
                    isBold = true;
                    text = text.replace("#b#", "");
                } else if (text.startsWith("#br#")) {
                    text = text.replace("#br#", "\n");
                } else if (text.startsWith("#li#")) {
                    text = text.replace("#li#", "\n• ");
                }

                return (
                    <DzText key={"_" + index} style={[textStyle, isBold && Font.Bold]}>
                        {text}
                    </DzText>
                )
            }))}
        </DzText>
    )
}

export default TextParser;
