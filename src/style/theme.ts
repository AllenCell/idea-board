// GRAYS
export const WHITE = "#FFFFFF";
export const SOFT_WHITE = "#F2F2F2";
export const RAIN_SHADOW = "#CBCBCC";
export const SERIOUS_GRAY = "#323233";

export const ALLEN_LIGHT_10 = "#DFE5EA";
export const ALLEN_LIGHT_30 = "#9FB1C0";
export const ALLEN_BLUE = "#003057";

export const PRIMARY_COLOR = ALLEN_BLUE;

export default {
    token: {
        colorPrimary: PRIMARY_COLOR,
        colorBgContainer: WHITE,
        colorLink: PRIMARY_COLOR,
        colorLinkActive: PRIMARY_COLOR,
        colorLinkHover: PRIMARY_COLOR,
        borderRadius: 4,
        colorBorder: RAIN_SHADOW,
        fontFamily: "Open Sans",
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
            defaultColor: PRIMARY_COLOR,
            defaultBg: SOFT_WHITE,
            defaultBorderColor: PRIMARY_COLOR,
            defaultHoverBg: SOFT_WHITE,
            colorPrimary: SOFT_WHITE,
            colorPrimaryBgHover: SOFT_WHITE,
            primaryColor: PRIMARY_COLOR,
            colorPrimaryBorder: PRIMARY_COLOR,
            primaryShadow: "none",
            defaultGhostColor: PRIMARY_COLOR,
            defaultHoverBorderColor: PRIMARY_COLOR,
            contentFontSize: 16,
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
        },
    },
};
