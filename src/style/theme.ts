// Allen Institute Brand 2025
export const WHITE = "#FFFFFF";
export const PAGE_1 = "#F3F0E8"; // warm off-white
export const PAGE_2 = "#DED9D1"; // warm light gray
export const GRAY_1 = "#AAA39F"; // borders
export const GRAY_2 = "#737373"; // muted text
export const BLACK = "#000000";

export const ALLEN_BLUE = "#6464FF";
export const ALLEN_VIOLET = "#8246E1";
export const ALLEN_TEAL = "#00A59B";
export const ALLEN_GREEN = "#CDEB05";

export const PRIMARY_COLOR = ALLEN_BLUE;

export default {
    token: {
        colorPrimary: PRIMARY_COLOR,
        colorBgContainer: PAGE_1,
        colorBgLayout: PAGE_1,
        colorLink: ALLEN_VIOLET,
        colorLinkActive: ALLEN_GREEN,
        colorLinkHover: ALLEN_GREEN,
        borderRadius: 2,
        colorBorder: GRAY_1,
        fontFamily: "Instrument Sans",
    },
    components: {
        Layout: {
            bodyBg: PAGE_1,
        },
        Modal: {
            motionDurationMid: "0.1s",
            contentBg: PAGE_2,
            headerBg: PAGE_2,
            footerBg: PAGE_2,
            titleColor: PRIMARY_COLOR,
        },
        Button: {
            defaultBg: PAGE_1,
            defaultBorderColor: PRIMARY_COLOR,
            defaultHoverBg: PAGE_2,
            primaryShadow: "none",
        },
        Table: {
            headerColor: BLACK,
            borderColor: GRAY_1,
            headerBg: PAGE_1,
            cellFontSize: 16,
            borderRadius: 2,
            rowHoverBg: PAGE_2,
        },
        Descriptions: {
            itemPaddingBottom: 0,
        },
        Tag: {
            defaultColor: PRIMARY_COLOR,
        },
        Card: {
            colorBorder: GRAY_1,
            lineWidth: 1.5,
            borderRadius: 0,
        },
        Menu: {
            itemSelectedBg: PAGE_2,
        },
        Dropdown: {
            colorBgElevated: BLACK,
            colorText: WHITE,
        },
    },
};
