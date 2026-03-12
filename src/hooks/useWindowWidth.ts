import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { TABLET_BREAKPOINT } from "../constants";

const useWindowWidth = () => {
    const [width, setWidth] = useState(TABLET_BREAKPOINT);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        const debouncedHandleResize = debounce(handleResize, 200);
        handleResize();
        window.addEventListener("resize", debouncedHandleResize);
        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, []);
    return width;
};

export default useWindowWidth;
