"use client";

import { use, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import MobileFrame from "@/components/ui/MobileFrame";
import ValidationSuccess from "@/components/screens/ValidationSuccess";
import LevelUpOverlay from "@/components/screens/LevelUpOverlay";
import { getTitreNiveau, isTacheCompleteAujourdhui } from "@/store/selectors";
import { getTacheById } from "@/data/taches";
import type { ValidationResult } from "@/store/types";

interface PageProps {
  params: Promise<{ id: string; tacheId: string }>;
}

export default function ValidationPage({ params }: PageProps) {
  const { id, tacheId } = use(params);
  const router = useRouter();
  const famille = useStore((s) => s.famille);
  const completions = useStore((s) => s.completions);
  const validerTache = useStore((s) => s.validerTache);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const enfant = famille?.enfants.find((e) => e.id === id);
  const tache = getTacheById(tacheId);

  // Redirect if already complete
  const alreadyComplete = isTacheCompleteAujourdhui({ completions }, id, tacheId);

  useEffect(() => {
    if (!enfant || !tache || alreadyComplete) {
      router.replace(`/enfant/${id}`);
    }
  }, [enfant, tache, alreadyComplete, router, id]);

  if (!enfant || !tache || alreadyComplete) return null;

  const handleValider = () => {
    try {
      const res = validerTache(id, tacheId);
      setResult(res);
      setShowSuccess(true);
    } catch {
      router.replace(`/enfant/${id}`);
    }
  };

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
    if (result?.levelUp && result.nouveauNiveau) {
      setShowLevelUp(true);
    } else {
      router.replace(`/enfant/${id}`);
    }
  }, [result, id, router]);

  const handleLevelUpContinuer = () => {
    setShowLevelUp(false);
    router.replace(`/enfant/${id}`);
  };

  // Get updated enfant after validation for level up overlay
  const enfantUpdated = useStore((s) => s.famille?.enfants.find((e) => e.id === id));
  const titreActuel = enfantUpdated ? getTitreNiveau(enfantUpdated) : "";

  return (
    <>
      <MobileFrame>
        {/* Header */}
        <div className="bg-app-text px-5 pt-10 pb-5">
          <button
            onClick={() => router.replace(`/enfant/${id}`)}
            className="text-white/60 text-sm mb-3 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-white font-extrabold text-xl">Validation de quête</h1>
          <p className="text-white/60 text-sm mt-1">{enfant.prenom}</p>
        </div>

        {/* Tâche */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
          <div className="text-8xl">{tache.icone}</div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-app-text">{tache.titre}</h2>
            <p className="text-sm text-gray-400 mt-1 capitalize">{tache.type === "epique" ? "Quête Épique" : "Quête de Base"}</p>
          </div>

          {/* Gains */}
          <div className="flex gap-4">
            <div className="bg-primary/10 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-primary">+{tache.xpValeur}</p>
              <p className="text-xs text-primary font-semibold">XP</p>
            </div>
            {tache.creditsValeur > 0 && (
              <div className="bg-gold/10 rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-extrabold text-gold">+{tache.creditsValeur}</p>
                <p className="text-xs text-gold font-semibold">Crédits</p>
              </div>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="px-5 pb-10 flex flex-col gap-3">
          <button
            onClick={handleValider}
            className="w-full py-5 rounded-2xl bg-success text-white font-extrabold text-xl shadow-lg hover:bg-success/90 active:scale-95 transition-all"
          >
            ✅ VALIDER
          </button>
          <button
            onClick={() => router.replace(`/enfant/${id}`)}
            className="w-full py-4 rounded-2xl bg-danger text-white font-bold text-base hover:bg-danger/90 active:scale-95 transition-all"
          >
            🔄 RÉESSAYER
          </button>
        </div>
      </MobileFrame>

      {showSuccess && result && (
        <ValidationSuccess
          xpGagne={result.xpGagne}
          creditsGagnes={result.creditsGagnes}
          onComplete={handleSuccessComplete}
        />
      )}

      {showLevelUp && result?.nouveauNiveau && (
        <LevelUpOverlay
          nouveauNiveau={result.nouveauNiveau}
          titreNiveau={titreActuel}
          onContinuer={handleLevelUpContinuer}
        />
      )}
    </>
  );
}
