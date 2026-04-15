import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { HEATMAP_DAYS, ML_MODULES } from "@/lib/sampleData";

const STORAGE_KEY = "aiml_nexus_demo_user_data";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultUserData(skillLevel = "Beginner") {
  return {
    skillLevel,
    completedModules: [],
    quizScores: {},
    quizAttempts: [],
    progressPercent: 0,
    totalPoints: 0,
    gameScores: {},
    activityMap: {},
    updatedAt: new Date().toISOString(),
  };
}

function recalcProgress(data) {
  const moduleWeight = Math.round((data.completedModules.length / ML_MODULES.length) * 60);
  const quizEntries = Object.values(data.quizScores);
  const quizAverage = quizEntries.length
    ? Math.round(quizEntries.reduce((sum, score) => sum + score, 0) / quizEntries.length)
    : 0;
  return Math.min(100, moduleWeight + Math.round(quizAverage * 0.4));
}

function readLocalData() {
  if (typeof window === "undefined") {
    return defaultUserData();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = defaultUserData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
}

function writeLocalData(nextValue) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
  window.dispatchEvent(new CustomEvent("aiml-data-update", { detail: nextValue }));
}

export async function ensureUserDocument(uid, payload = {}) {
  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...defaultUserData(payload.skillLevel),
        email: payload.email || "",
        createdAt: serverTimestamp(),
      });
    }
    return;
  }

  const local = readLocalData();
  writeLocalData({ ...local, skillLevel: payload.skillLevel || local.skillLevel });
}

export function subscribeToUserDocument(uid, callback) {
  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(defaultUserData());
        return;
      }
      callback(snap.data());
    });
  }

  const emit = () => callback(readLocalData());
  emit();
  window.addEventListener("aiml-data-update", emit);
  return () => window.removeEventListener("aiml-data-update", emit);
}

export async function completeModule(uid, moduleId) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      completedModules: arrayUnion(moduleId),
      totalPoints: increment(25),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : defaultUserData();
    await updateDoc(ref, { progressPercent: recalcProgress(current) });
    return;
  }

  const local = readLocalData();
  if (!local.completedModules.includes(moduleId)) {
    local.completedModules.push(moduleId);
  }
  local.totalPoints += 25;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.progressPercent = recalcProgress(local);
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export async function saveQuizAttempt(uid, moduleId, scorePercent) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`quizScores.${moduleId}`]: scorePercent,
      quizAttempts: arrayUnion({
        moduleId,
        scorePercent,
        at: new Date().toISOString(),
      }),
      totalPoints: increment(15),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });

    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : defaultUserData();
    await updateDoc(ref, { progressPercent: recalcProgress(current) });
    return;
  }

  const local = readLocalData();
  local.quizScores[moduleId] = scorePercent;
  local.quizAttempts.push({ moduleId, scorePercent, at: new Date().toISOString() });
  local.totalPoints += 15;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.progressPercent = recalcProgress(local);
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export async function saveGameScore(uid, gameId, score) {
  const day = todayKey();

  if (isFirebaseConfigured) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`gameScores.${gameId}`]: score,
      totalPoints: increment(10),
      [`activityMap.${day}`]: increment(1),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  const local = readLocalData();
  local.gameScores[gameId] = Math.max(local.gameScores[gameId] || 0, score);
  local.totalPoints += 10;
  local.activityMap[day] = (local.activityMap[day] || 0) + 1;
  local.updatedAt = new Date().toISOString();
  writeLocalData(local);
}

export function buildHeatmapDays(activityMap = {}) {
  const days = [];
  const now = new Date();

  for (let i = HEATMAP_DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: activityMap[key] || 0,
    });
  }

  return days;
}
