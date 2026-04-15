// GRAYS
export const WHITE = "#FFFFFF";
export const SOFT_WHITE = "#F2F2F2";
export const RAIN_SHADOW = "#CBCBCC";
export const SERIOUS_GRAY = "#323233";

export const ALLEN_LIGHT_10 = "#DFE5EA";
export const ALLEN_LIGHT_30 = "#9FB1C0";
export const ALLEN_BLUE = "#003057";
export const LINK_COLOR = "#0094FF";

export const PRIMARY_COLOR = ALLEN_BLUE;

export default {
    token: {
        colorPrimary: PRIMARY_COLOR,
        colorBgContainer: WHITE,
        colorLink: LINK_COLOR,
        colorLinkActive: PRIMARY_COLOR,
        colorLinkHover: PRIMARY_COLOR,
        borderRadius: 4,
        colorBorder: RAIN_SHADOW,
        fontFamily: "Raleway",
    },
    components: {
        Layout: {
            bodyBg: SOFT_WHITE,
        },
        Modal: {
            motionDurationMid: "0.1s",
            contentBg: ALLEN_LIGHT_10,
            headerBg: ALLEN_LIGHT_10,
            footerBg: ALLEN_LIGHT_10,
            titleColor: PRIMARY_COLOR,
        },
        Button: {
            defaultBg: SOFT_WHITE,
            defaultBorderColor: PRIMARY_COLOR,
            defaultHoverBg: ALLEN_LIGHT_10,
            primaryShadow: "none",
        },
        Table: {
            headerColor: SERIOUS_GRAY,
            borderColor: RAIN_SHADOW,
            headerBg: WHITE,
            cellFontSize: 16,
            borderRadius: 4,
            rowHoverBg: WHITE,
        },
        Descriptions: {
            itemPaddingBottom: 0,
        },
        Tag: {
            defaultColor: PRIMARY_COLOR,
        },
        Card: {
            colorBorder: RAIN_SHADOW,
            lineWidth: 1.5,
            borderRadius: 0,
        },
        Menu: {
            itemSelectedBg: SOFT_WHITE,
        },
    },
};
