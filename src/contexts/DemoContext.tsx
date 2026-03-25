import { createContext, useContext } from "react";

const DemoContext = createContext(false);

export function DemoProvider({ children, isDemo }: { children: React.ReactNode; isDemo: boolean }) {
  return <DemoContext.Provider value={isDemo}>{children}</DemoContext.Provider>;
}

export function useIsDemo() {
  return useContext(DemoContext);
}
