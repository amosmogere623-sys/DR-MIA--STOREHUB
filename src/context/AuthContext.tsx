"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole, KenyaLocation } from "../types";

interface AuthContextType {
  currentUser: UserProfile | null;
  currentLocation: KenyaLocation;
  isAuthModalOpen: boolean;
  openAuthModal: (preferredRole?: UserRole) => void;
  closeAuthModal: () => void;
  loginAs: (profile: UserProfile) => void;
  logout: () => void;
  updateLocation: (loc: KenyaLocation) => void;
}

const DEFAULT_LOCATION: KenyaLocation = {
  county: "Kisii",
  town: "Kisii Town",
  estate: "Mwembe",
};

const DEFAULT_BUYER: UserProfile = {
  id: "user-buyer23",
  name: "Buyer Account",
  email: "buyer23@gmail.com",
  phone: "0722 334 455",
  role: "buyer",
  location: DEFAULT_LOCATION,
  createdAt: "2026-11-01",
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentLocation: DEFAULT_LOCATION,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  loginAs: () => {},
  logout: () => {},
  updateLocation: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentLocation, setCurrentLocation] = useState<KenyaLocation>(DEFAULT_LOCATION);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("drmia_user_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.location) {
          setCurrentLocation(parsed.location);
        }
      } else {
        setCurrentUser(DEFAULT_BUYER);
        localStorage.setItem("drmia_user_session", JSON.stringify(DEFAULT_BUYER));
      }

      const storedLoc = localStorage.getItem("drmia_user_location");
      if (storedLoc) {
        setCurrentLocation(JSON.parse(storedLoc));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginAs = (profile: UserProfile) => {
    setCurrentUser(profile);
    setCurrentLocation(profile.location);
    localStorage.setItem("drmia_user_session", JSON.stringify(profile));
    localStorage.setItem("drmia_user_location", JSON.stringify(profile.location));
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event("userSessionChanged"));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("drmia_user_session");
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("current_vendor");
    window.dispatchEvent(new Event("userSessionChanged"));
  };

  const updateLocation = (loc: KenyaLocation) => {
    setCurrentLocation(loc);
    localStorage.setItem("drmia_user_location", JSON.stringify(loc));
    if (currentUser) {
      const updated = { ...currentUser, location: loc };
      setCurrentUser(updated);
      localStorage.setItem("drmia_user_session", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("userLocationChanged"));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentLocation,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginAs,
        logout,
        updateLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
