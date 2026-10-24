import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DraftStore {
    drafts: Record<string, unknown>;
    setDraft: (key: string, data: unknown) => void;
    getDraft: <T>(key: string) => T | undefined;
    clearDraft: (key: string) => void;
    clearAllDraftsForPatient: (patientId: string | number) => void;
    clearAllDrafts: () => void;
    hasDraft: (key: string) => boolean;
}

/**
 * Unsaved record-form drafts, keyed `patient-<id>-<section>`.
 *
 * Persisted to sessionStorage (issue #7): drafts survive a full page
 * reload or an accidental tab refresh, but die with the browser tab
 * session — clinical data is never left in persistent browser storage
 * on a possibly shared machine. Drafts are also wiped on logout (see
 * UserMenuContent's handleLogout, which calls clearAllDrafts()).
 */
export const DRAFT_STORAGE_KEY = 'lumax-drafts';

export const useDraftStore = create<DraftStore>()(
    persist(
        (set, get) => ({
            drafts: {},
            setDraft: (key, data) =>
                set((state) => ({
                    drafts: {
                        ...state.drafts,
                        [key]: data,
                    },
                })),
            getDraft: (key) => get().drafts[key] as never,
            clearDraft: (key) =>
                set((state) => {
                    const newDrafts = { ...state.drafts };
                    delete newDrafts[key];
                    return { drafts: newDrafts };
                }),
            clearAllDraftsForPatient: (patientId) =>
                set((state) => {
                    const newDrafts = { ...state.drafts };
                    Object.keys(newDrafts).forEach((key) => {
                        if (key.startsWith(`patient-${patientId}-`)) {
                            delete newDrafts[key];
                        }
                    });
                    return { drafts: newDrafts };
                }),
            clearAllDrafts: () => set({ drafts: {} }),
            hasDraft: (key) => get().drafts[key] !== undefined,
        }),
        {
            name: DRAFT_STORAGE_KEY,
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ drafts: state.drafts }),
        },
    ),
);
