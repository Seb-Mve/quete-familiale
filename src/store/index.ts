"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState } from "./types";
import {
  creerFamille,
  creerEnfant,
  validerTache,
  rachatRecompense,
  validerStreak,
} from "./actions";

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      famille: null,
      completions: [],
      rachats: [],
      creerFamille: creerFamille(set),
      creerEnfant: creerEnfant(set, get),
      validerTache: validerTache(set, get),
      rachatRecompense: rachatRecompense(set, get),
      validerStreak: validerStreak(set, get),
    }),
    {
      name: "quete-familiale-v1",
      skipHydration: true,
      version: 1,
    }
  )
);
