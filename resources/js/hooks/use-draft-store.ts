import { create } from 'zustand';

interface DraftStore {
    drafts: Record<string, unknown>;
    setDraft: (key: string, data: unknown) => void;
    getDraft: <T>(key: string) => T | undefined;
    clearDraft: (key: string) => void;
    clearAllDraftsForPatient: (patientId: string | number) => void;
    hasDraft: (key: string) => boolean;
}

export const useDraftStore = create<DraftStore>((set, get) => ({
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
    hasDraft: (key) => get().drafts[key] !== undefined,
}));
