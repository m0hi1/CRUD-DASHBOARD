import { MainContentProps } from "@/model/Data";
import { Plus, Edit, Trash } from "lucide-react";

export default function MainContent({
  activeTab,
  countries,
  states,
  openModal,
  deleteItem,
}: MainContentProps) {
  return (
    <main className="flex-1 p-6 bg-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{activeTab}</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          <Plus size={16} className="mr-2" /> Add {activeTab}
        </button>
      </div>
      <div className="mt-5 bg-white p-4 rounded shadow">
        {activeTab === "Countries" ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ISO Code</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Region</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {country.iso}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {country.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {country.region}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(country)}
                      className="text-blue-500 hover:underline m-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(country)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">State Code</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Country</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {state.code}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {state.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {state.country}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(state)}
                      className="text-blue-500 hover:underline m-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem(state)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
