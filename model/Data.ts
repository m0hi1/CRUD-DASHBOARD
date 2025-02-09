import { Country, CountryItem } from "./Country";
import { State, StateItem } from "./State";

export type ActiveTab = "Countries" | "States";


export interface ModalProps {
    modalOpen: boolean;
    closeModal: () => void;
    editItem: CountryItem | StateItem | null;
    activeTab: ActiveTab;
    countries: Array<{ iso: string; name: string; region: string }>;
    saveItem: (item: CountryItem | StateItem) => void;
}

export interface MainContentProps {
    activeTab: ActiveTab;
    countries: Country[];
    states: State[];
    openModal: (item?: Country | State) => void;
    deleteItem: (item: Country | State) => void;
}