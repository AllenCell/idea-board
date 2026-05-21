// Allen Institute Brand 2025

// Base — neutrals
export const WHITE = "#FFFFFF";
export const BLACK = "#000000";
export const PAGE_1 = "#F3F0E8"; // warm off-white — page background
export const PAGE_2 = "#DED9D1"; // warm light gray — alt surfaces, cards
export const GRAY_1 = "#AAA39F"; // medium warm gray — borders, dividers
export const GRAY_2 = "#737373"; // mid gray — muted text

// Primary — used as backgrounds
export const ALLEN_BLUE = "#6464FF";
export const ALLEN_VIOLET = "#8246E1";
export const ALLEN_TEAL = "#00A59B";
export const ALLEN_MAROON = "#CD0F55";

// Accent — highlights, used sparingly
export const ALLEN_GREEN = "#CDEB05";
export const ALLEN_ROSE = "#FF00FF";
export const ALLEN_ORANGE = "#FF6E00";
export const ALLEN_OCHRE = "#DC9600";
export const ALLEN_YELLOW = "#FFEB23";

// Semantic aliases
export const PRIMARY_COLOR = ALLEN_BLUE;
export const SECONDARY_COLOR = ALLEN_TEAL;
export const FEATURE_COLOR = ALLEN_VIOLET;
export const ACCENT_COLOR = ALLEN_GREEN;
export const LINK_COLOR = ALLEN_BLUE;
export const BORDER_COLOR = GRAY_1;
export const DISABLED_COLOR = GRAY_1;
export const SURFACE_COLOR = WHITE;
export const BG_BASE_COLOR = PAGE_1;
export const BG_SECONDARY_COLOR = PAGE_2;
export const BG_DARK_COLOR = BLACK;
export const TEXT_PRIMARY_COLOR = BLACK;
export const TEXT_SECONDARY_COLOR = GRAY_2;
export const TEXT_HEADING_COLOR = WHITE;
export const TEXT_LIGHT_COLOR = PAGE_1;
export const FOOTER_TEXT_COLOR = GRAY_2;
export const SMALL_TABLE_BORDER_COLOR = GRAY_1;
export const MAIN_CARD_HEADER_COLOR = ALLEN_BLUE;
export const CALLOUT_BOX_BG_COLOR = PAGE_2;
export const CALLOUT_BOX_BORDER_COLOR = GRAY_1;

// Ant Design theme token overrides
const BG_CONTAINER = PAGE_1;
const BG_LAYOUT = PAGE_2;

export default {
    token: {
        colorPrimary: PRIMARY_COLOR,
        colorBgContainer: BG_CONTAINER,
        colorBgLayout: BG_LAYOUT,
        colorLink: ALLEN_VIOLET,
        colorLinkActive: ALLEN_GREEN,
        colorLinkHover: ALLEN_VIOLET,
        borderRadius: 2,
        colorBorder: BORDER_COLOR,
        fontFamily: "Instrument Sans",
    },
    components: {
        Layout: {
            bodyBg: BG_LAYOUT,
            footerBg: BORDER_COLOR,
        },
        Modal: {
            motionDurationMid: "0.1s",
            contentBg: BG_CONTAINER,
            headerBg: BG_CONTAINER,
            footerBg: BG_CONTAINER,
            titleColor: PRIMARY_COLOR,
        },
        Button: {
            defaultBg: BG_CONTAINER,
            defaultBorderColor: PRIMARY_COLOR,
            defaultHoverBg: BG_LAYOUT,
            primaryShadow: "none",
        },
        Table: {
            headerColor: BLACK,
            borderColor: BORDER_COLOR,
            headerBg: BG_CONTAINER,
            cellFontSize: 16,
            borderRadius: 2,
            rowHoverBg: BG_LAYOUT,
        },
        Descriptions: {
            itemPaddingBottom: 0,
        },
        Tag: {
            defaultColor: PRIMARY_COLOR,
        },
        Card: {
            colorBorder: BORDER_COLOR,
            lineWidth: 1.5,
            borderRadius: 0,
        },
        Menu: {
            itemSelectedBg: BG_LAYOUT,
        },
        Dropdown: {
            colorBgElevated: BLACK,
            colorText: WHITE,
        },
    },
};
