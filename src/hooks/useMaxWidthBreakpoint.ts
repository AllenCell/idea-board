import {
    MIDSCREEN_BREAKPOUNT,
    PHONE_BREAKPOINT,
    TABLET_BREAKPOINT,
    WIDESCREEN_BREAKPOINT,
} from "../constants";
import useWindowWidth from "./useWindowWidth";

export const useMaxWidthBreakpoint = (breakpoint: number): boolean => {
    const windowWidth = useWindowWidth();
    return windowWidth < breakpoint;
};

export const useWideScreenBreakpoint = () =>
    useMaxWidthBreakpoint(WIDESCREEN_BREAKPOINT);
export const useMidScreenBreakpoint = () =>
    useMaxWidthBreakpoint(MIDSCREEN_BREAKPOUNT);
export const useMobileBreakpoint = () =>
    useMaxWidthBreakpoint(PHONE_BREAKPOINT);
export const useTabletBreakpoint = () =>
    useMaxWidthBreakpoint(TABLET_BREAKPOINT);

export default useMaxWidthBreakpoint;
