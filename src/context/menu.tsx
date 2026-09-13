import { createContext, type ReactNode } from "react";

interface MenuContextType {
    openMenu?: () => void;
}

const MenuContext = createContext<MenuContextType>({});

interface MenuProviderProps {
    value: MenuContextType;
    children: ReactNode;
}

export const MenuProvider = ({ value, children }: MenuProviderProps) => (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
);

export default MenuContext;