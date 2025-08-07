type Tab<T extends string> = {
    id: T;
    label: string;
};
type TabsProps<T extends string> = {
    tabs: readonly Tab<T>[];
    activeTab: T;
    onTabChange: (tabId: T) => void;
};
declare const Tabs: <T extends string>({ tabs, activeTab, onTabChange, }: TabsProps<T>) => import("react").JSX.Element;
export default Tabs;
