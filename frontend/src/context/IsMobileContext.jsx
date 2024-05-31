import React, { createContext, useContext, useState } from "react";
import { useMediaQuery } from "react-responsive";

const IsMobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const defaultValue = useMediaQuery({ query: '(max-width: 768px)' });
  const [isMobile, setIsMobile] = useState(false);
  return (
    <IsMobileContext.Provider value={{ isMobile, setIsMobile, defaultValue }}>
      {children}
    </IsMobileContext.Provider>
  );
};

export const useIsMobileContext = () => useContext(IsMobileContext);
