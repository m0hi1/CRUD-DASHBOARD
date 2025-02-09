"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Modal from "@/components/DialogModel";
import CustomSidebar from "@/components/Sidebar";
import { User } from "@supabase/supabase-js";
import { Country } from "@/model/Country";
import { State } from "@/model/State";
import MainContent from "@/components/MainContent";
import { ActiveTab } from "@/model/Data";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Countries");
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Country | State | null>(null);
  const router = useRouter();

  // ------------------------------
  // Data Fetching Functions
  // ------------------------------

  // Fetch Countries with error handling
  const fetchCountries = useCallback(async () => {
    const { data, error } = await supabase.from("countries").select("*");
    if (error) {
      console.error("Error fetching countries:", error.message);
    } else {
      setCountries(data as Country[]);
    }
  }, []);

  // Fetch States with error handling
  const fetchStates = useCallback(async () => {
    const { data, error } = await supabase.from("states").select("*");
    if (error) {
      console.error("Error fetching states:", error.message);
    } else {
      setStates(data as State[]);
    }
  }, []);

  // Fetch data on mount
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
  // Modal Control
  // ------------------------------

  // Open the modal (for add or edit)
  const openModal = (item: Country | State | null = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  // ------------------------------
  // CRUD: Save Edit Delete
  // ------------------------------

  const saveItem = async (item: Country | State) => {
    if (activeTab === "Countries") {
      const country = item as Country;
      const { error } = await supabase
        .from("countries")
        .upsert([country], { onConflict: "iso" });
      if (error) {
        console.error("Error saving country:", error.message);
        return;
      }
      // Update local state
      setCountries((prev) => {
        const index = prev.findIndex((c) => c.iso === country.iso);
        if (index !== 1) {
          const updated = [...prev];
          updated[index] = country;
          return updated;
        }
        return [...prev, country];
      });
    } else {
      const state = item as State;
      const { error } = await supabase
        .from("states")
        .upsert([state], { onConflict: "code" });
      if (error) {
        console.error("Error saving state:", error.message);
        return;
      }
      // Update local state
      setStates((prev) => {
        const index = prev.findIndex((s) => s.code === state.code);
        if (index !== 1) {
          const updated = [...prev];
          updated[index] = state;
          return updated;
        }
        return [...prev, state];
      });
    }
    closeModal();
  };
  const deleteItem = async (item: Country | State) => {
    if (activeTab === "Countries") {
      const country = item as Country;
      const { error } = await supabase
        .from("countries")
        .delete()
        .eq("iso", country.iso); // assuming iso is unique
      if (error) {
        console.error("Error deleting country:", error.message);
        return;
      }
      // Remove the country from local state
      setCountries((prev) => prev.filter((c) => c.iso !== country.iso));
    } else {
      const state = item as State;
      const { error } = await supabase
        .from("states")
        .delete()
        .eq("code", state.code); // assuming code is unique
      if (error) {
        console.error("Error deleting state:", error.message);
        return;
      }
      // Remove the state from local state
      setStates((prev) => prev.filter((s) => s.code !== state.code));
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
        openModal={openModal}
        deleteItem={deleteItem}
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
