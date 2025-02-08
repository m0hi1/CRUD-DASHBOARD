import { X } from "lucide-react";
import { ActiveTab } from "./MainContent";
import { useState } from "react";

interface ModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  editItem: any;
  activeTab: ActiveTab;
  countries: Array<{ iso: string; name: string; region: string }>;
  saveItem: (item: any) => void;
}

export default function Modal({
  modalOpen,
  closeModal,
  editItem,
  activeTab,
  countries,
  saveItem,
}: ModalProps) {
  const [iso, setIso] = useState(editItem?.iso || "");
  const [name, setName] = useState(editItem?.name || "");
  const [region, setRegion] = useState(editItem?.region || "");
  const [stateCode, setStateCode] = useState(editItem?.code || "");
  const [country, setCountry] = useState(
    editItem?.country || countries[0]?.name || ""
  );

  const handleSave = () => {
    const newItem =
      activeTab === "Countries"
        ? { ...editItem, iso, name, region }
        : { ...editItem, code: stateCode, name, country };
    saveItem(newItem);
    closeModal();
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {editItem ? "Edit" : "Add"} {activeTab}
        </h2>
        {activeTab === "Countries" ? (
          <>
            <input
              type="text"
              placeholder="ISO Code"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={iso}
              onChange={(e) => setIso(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Region"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="State Code"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((country) => (
                <option key={country.iso} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </>
        )}
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
}
