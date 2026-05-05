import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

import { PageNavSiderMenuItem } from "./components/PageNavSider";

export interface LayoutData {
    activeNavKey: string | null;
    fullWidthPage?: boolean;
    onNavItemClick: ((key: string) => void) | null;
    PageNavSiderItems: PageNavSiderMenuItem[];
    PageNavSiderTitle: string | undefined;
    selectedNavKey: string | undefined;
    showHamburger: boolean | undefined;
    showPageNavSider: boolean | undefined;
}

const defaultLayoutData: LayoutData = {
    activeNavKey: null,
    fullWidthPage: undefined,
    onNavItemClick: null,
    PageNavSiderItems: [],
    PageNavSiderTitle: undefined,
    selectedNavKey: undefined,
    showHamburger: undefined,
    showPageNavSider: undefined,
};

interface LayoutContextValue {
    data: LayoutData;
    reset: () => void;
    set: (newData: Partial<LayoutData>) => void;
}

const LayoutContext = createContext<LayoutContextValue>({
    data: defaultLayoutData,
    reset: () => {},
    set: () => {},
});

function LayoutContextProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<LayoutData>(defaultLayoutData);

    const set = useCallback((newData: Partial<LayoutData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    }, []);

    const reset = useCallback(() => {
        setData(defaultLayoutData);
    }, []);

    return (
        <LayoutContext.Provider value={{ data, reset, set }}>
            {children}
        </LayoutContext.Provider>
    );
}

/**
 * Hook for page components to set dynamic layout configuration.
 *
 * Usage:
 *   const setLayout = useSetLayoutConfig();
 *   useEffect(() => {
 *       setLayout({ PageNavSiderItems: [...], showPageNavSider: true });
 *   }, []);
 */
function useSetLayoutConfig() {
    const { set } = useContext(LayoutContext);
    return set;
}

/**
 * Hook to read the current dynamic layout context values.
 * Primarily used by the Layout component and its children.
 */
function useLayoutContext() {
    return useContext(LayoutContext);
}

export {
    defaultLayoutData,
    LayoutContext,
    LayoutContextProvider,
    useLayoutContext,
    useSetLayoutConfig,
};
