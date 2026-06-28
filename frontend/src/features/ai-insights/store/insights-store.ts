import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InsightCardData } from '../types';

interface InsightsState {
  savedInsights: InsightCardData[];
  insightHistory: InsightCardData[];
  saveInsight: (insight: InsightCardData) => void;
  removeSavedInsight: (insightId: string) => void;
  addToHistory: (insight: InsightCardData) => void;
  clearHistory: () => void;
  isInsightSaved: (insightId: string) => boolean;
}

export const useInsightsStore = create<InsightsState>()(
  persist(
    (set, get) => ({
      savedInsights: [],
      insightHistory: [],

      saveInsight: (insight) => {
        set((state) => {
          if (state.savedInsights.some(i => i.id === insight.id)) return state;
          return {
            savedInsights: [{ ...insight, isSaved: true }, ...state.savedInsights]
          };
        });
      },

      removeSavedInsight: (insightId) => {
        set((state) => ({
          savedInsights: state.savedInsights.filter(i => i.id !== insightId)
        }));
      },

      addToHistory: (insight) => {
        set((state) => {
          // Avoid duplicates if same insight generated again recently
          if (state.insightHistory[0]?.id === insight.id) return state;
          return {
            insightHistory: [insight, ...state.insightHistory].slice(0, 100) // keep last 100
          };
        });
      },

      clearHistory: () => {
        set({ insightHistory: [] });
      },

      isInsightSaved: (insightId) => {
        return get().savedInsights.some(i => i.id === insightId);
      }
    }),
    {
      name: 'ai-insights-storage',
    }
  )
);
