import { supabase } from "@/lib/supabaseClient";
import { SidebarProps } from "@/model/Data";
import { useRouter } from "next/navigation";


export default function CustomSidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const router = useRouter();
  return (
    <aside className="w-64 bg-gray-900 text-white p-5">
      <h1 className="text-xl font-bold">DEMO</h1>
      <nav className="mt-5">
        <ul>
          <li
            className={`py-2 px-4 rounded cursor-pointer ${
              activeTab === "Countries" ? "bg-purple-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("Countries")}
          >
            Countries
          </li>
          <li
            className={`py-2 px-4 rounded cursor-pointer ${
              activeTab === "States" ? "bg-purple-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("States")}
          >
            States
          </li>
        </ul>
      </nav>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded end-2 bottom-4 fixed hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}
