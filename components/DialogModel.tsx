import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MainContentProps } from "@/model/Data";
import { Country } from "@/model/Country";
import { State } from "@/model/State";

export default function Modal({
  isModalOpen,
  closeModal,
  editItem,
  activeTab,
  countries,
  saveItem,
}: MainContentProps) {
  // Form state variables
  const [iso, setIso] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [country, setCountry] = useState("");

  // Initialize form state when modal opens or editItem/activeTab changes
  useEffect(() => {
    if (activeTab === "Countries") {
      setIso((editItem as unknown as Country)?.iso || "");
      setName(editItem?.name || "");
      setRegion((editItem as unknown as Country)?.region || "");
    } else {
      setStateCode((editItem as unknown as State)?.code || "");
      setName(editItem?.name || "");
      setCountry(
        (editItem as unknown as State)?.country || countries[0]?.name || ""
      );
    }
  }, [editItem, activeTab, countries]);

  const handleSave = () => {
    if (activeTab === "Countries") {
      const newItem: Country = { iso, name, region };
      saveItem(newItem);
    } else {
      const newItem: State = { code: stateCode, name, country };
      saveItem(newItem);
    }
  };

  if (!isModalOpen) return null;

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
          {editItem?.name ? "Edit" : "Add"} {activeTab}
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
              {countries.map((c) => (
                <option key={c.iso} value={c.name}>
                  {c.name}
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
