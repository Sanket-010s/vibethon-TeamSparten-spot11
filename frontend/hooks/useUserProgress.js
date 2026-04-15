"use client";

import { useEffect, useState } from "react";
import { subscribeToUserDocument } from "@/services/firestoreService";

export function useUserProgress(uid) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!uid) {
      return undefined;
    }

    const unsub = subscribeToUserDocument(uid, (docData) => {
      setProgress(docData);
    });

    return () => unsub?.();
  }, [uid]);

  const loading = Boolean(uid) && progress === null;

  return { progress, loading };
}
