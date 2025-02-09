"use client";
import Modal from "@/components/DialogModel";
import MainContent, { ActiveTab } from "@/components/MainContent";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import CustomSidebar from "@/components/Sidebar";
import { User } from "@supabase/supabase-js";
import { Country } from "@/model/Country";
import { State } from "@/model/State";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Countries");
  const [countries, setCountries] = useState<Country[]>([]);

  // const [countries, setCountries] = useState<Country[]>([
  //   { iso: "BRA", name: "Brazil", region: "South America" },
  //   { iso: "USA", name: "United States", region: "North America" },
  // ]);
  const [states, setStates] = useState<State[]>([]);

  // const [states, setStates] = useState<State[]>([
  //   { code: "RAA", name: "Brazil", country: "South America" },
  //   { code: "SAA", name: "United States", country: "North America" },
  // ]);
  // const [modalOpen, setModalOpen] = useState(false);
  //~ type for editItem based on activeTab
  const [editItem, setEditItem] = useState<Country | State | null>(null);

  const router = useRouter();
  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase.from("countries").select("*");
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase.from("states").select("*");
      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

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

  //~ Type openModal argument based on activeTab
  const openModal = (item: Country | State | null = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // const closeModal = () => {
  //   setModalOpen(false);
  //   setEditItem(null);
  // };

  //~ Type saveItem argument based on activeTab
  // const saveItem = (item: Country | State) => {
  //   if (activeTab === "Countries") {
  //     setCountries((prev) => {
  //       const index = prev.findIndex((c) => c.iso === (item as Country).iso);
  //       if (index !== -1) {
  //         const updated = [...prev];
  //         updated[index] = item as Country;
  //         return updated;
  //       }
  //       return [...prev, item as Country];
  //     });
  //   } else {
  //     setStates((prev) => {
  //       const index = prev.findIndex((s) => s.code === (item as State).code);
  //       if (index !== -1) {
  //         const updated = [...prev];
  //         updated[index] = item as State;
  //         return updated;
  //       }
  //       return [...prev, item as State];
  //     });
  //   }
  // };

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
      {/* <Modal
        modalOpen={modalOpen}
        closeModal={closeModal}
        editItem={editItem}
        activeTab={activeTab}
        countries={countries}
        saveItem={saveItem}
      /> */}
    </div>
  );
}



