"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CustomSidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import Modal from "@/components/DialogModel";
import { User } from "@supabase/supabase-js";
import { Country } from "@/model/Country";
import { State } from "@/model/State";
import { ActiveTab } from "@/model/Data";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Countries");
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Country | State | null>(null);

  // ------------------------------
  // Data Fetching Functions
  // ------------------------------

  const fetchCountries = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("countries").select("*");
      if (error) throw error;
      setCountries(data as Country[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching countries:", err.message);
      } else {
        console.error("Error fetching countries:", err);
      }
    }
  }, []);

  const fetchStates = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("states").select("*");
      if (error) throw error;
      setStates(data as State[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching states:", err.message);
      } else {
        console.error("Error fetching states:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, [fetchCountries, fetchStates]);

  // ------------------------------
  // User Authentication Check
  // ------------------------------

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

  // ------------------------------
  // Modal Control Functions
  // ------------------------------

  const openModal = (item: Country | State | null = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  // ------------------------------
  // CRUD Functions
  // ------------------------------

  const saveItem = async (item: Country | State) => {
    try {
      if (activeTab === "Countries") {
        const country = item as Country;
        const { data, error } = await supabase
          .from("countries")
          .upsert([country], { onConflict: "iso" })
          .select();
        if (error) throw error;
        // Optionally update local state with the returned data
        const returnedCountry =
          data && data[0] ? (data[0] as Country) : country;
        setCountries((prev) => {
          const index = prev.findIndex((c) => c.iso === returnedCountry.iso);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = returnedCountry;
            return updated;
          }
          return [...prev, returnedCountry];
        });
      } else {
        const state = item as State;
        const { data, error } = await supabase
          .from("states")
          .upsert([state], { onConflict: "code" })
          .select();
        if (error) throw error;
        const returnedState = data && data[0] ? (data[0] as State) : state;
        setStates((prev) => {
          const index = prev.findIndex((s) => s.code === returnedState.code);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = returnedState;
            return updated;
          }
          return [...prev, returnedState];
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving item:", err.message);
      } else {
        console.error("Error saving item:", err);
      }
    } finally {
      closeModal();
    }
  };

  const deleteItem = async (item: Country | State) => {
    try {
      if (activeTab === "Countries") {
        const country = item as Country;
        const { error } = await supabase
          .from("countries")
          .delete()
          .eq("iso", country.iso);
        if (error) throw error;
        setCountries((prev) => prev.filter((c) => c.iso !== country.iso));
      } else {
        const state = item as State;
        const { error } = await supabase
          .from("states")
          .delete()
          .eq("code", state.code);
        if (error) throw error;
        setStates((prev) => prev.filter((s) => s.code !== state.code));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error deleting item:", err.message);
      }
    }
  };

  // ------------------------------
  // Render Loading or App
  // ------------------------------

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
        deleteItem={deleteItem}
        openModal={openModal}
        isModalOpen={modalOpen}
        editItem={editItem}
        saveItem={saveItem}
        closeModal={closeModal}
      />
      <Modal
        isModalOpen={modalOpen}
        closeModal={closeModal}
        activeTab={activeTab}
        countries={countries}
        states={states}
        openModal={openModal}
        deleteItem={deleteItem}
        saveItem={saveItem}
        editItem={editItem}
      />
    </div>
  );
}
