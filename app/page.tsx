"use client";
import Modal from "@/components/DialogModel";
import MainContent, { ActiveTab } from "@/components/MainContent";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import CustomSidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Countries");
  const [countries, setCountries] = useState([
    { iso: "BRA", name: "Brazil", region: "South America" },
    { iso: "USA", name: "United States", region: "North America" },
  ]);
  const [states, setStates] = useState([
    { code: "RAA", name: "Brazil", country: "South America" },
    { code: "SAA", name: "United States", country: "North America" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, [router]);

  const openModal = (item = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  const saveItem = (item) => {
    if (activeTab === "Countries") {
      setCountries((prev) => {
        const index = prev.findIndex((c) => c.iso === item.iso);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = item;
          return updated;
        }
        return [...prev, item];
      });
    } else {
      setStates((prev) => {
        const index = prev.findIndex((s) => s.code === item.code);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = item;
          return updated;
        }
        return [...prev, item];
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <CustomSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent
        activeTab={activeTab}
        countries={countries}
        states={states}
        openModal={openModal}
      />
      <Modal
        modalOpen={modalOpen}
        closeModal={closeModal}
        editItem={editItem}
        activeTab={activeTab}
        countries={countries}
        saveItem={saveItem}
      />
    </div>
  );
}
