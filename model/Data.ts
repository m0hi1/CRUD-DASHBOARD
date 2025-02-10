import { Country } from "./Country";
import { State } from "./State";

export type ActiveTab = "Countries" | "States";


export interface MainContentProps {
    activeTab: ActiveTab;
    countries: Country[];
    states: State[];
    openModal: (item?: Country | State) => void;
    isModalOpen: boolean;
    closeModal: () => void;
    editItem: Country | State | null;
    deleteItem: (item: Country | State) => void;
    saveItem: (item: Country | State) => void;

}

export interface SidebarProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}
