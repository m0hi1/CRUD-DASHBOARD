import { ActiveTab } from "@/components/MainContent";
import { CountryItem } from "./Country";
import { StateItem } from "./State";

export interface ModalProps {
    modalOpen: boolean;
    closeModal: () => void;
    editItem: CountryItem | StateItem | null;
    activeTab: ActiveTab;
    countries: Array<{ iso: string; name: string; region: string }>;
    saveItem: (item: CountryItem | StateItem) => void;
}

