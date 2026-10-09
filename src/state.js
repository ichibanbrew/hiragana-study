import { getBasicRowIds } from './data/hiragana.js';

const STORAGE_KEY = 'hiragana_study_state_v1';

/**
 * Get initial default state
 */
export function getDefaultState() {
  return {
    selectedRowIds: getBasicRowIds(),
    stats: {
      answered: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    mistakes: {}, // kana -> { kana, romaji, rowName, count }
    settings: {
      autoAdvance: true,
      soundEnabled: true,
      voiceEnabled: true,
      theme: 'dark', // 'dark' | 'light'
      showRowHint: false
    }
  };
}

class StateManager {
  constructor() {
    this.state = this.load();
    this.listeners = [];
  }

  load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const defaults = getDefaultState();
          return {
            ...defaults,
            ...parsed,
            settings: { ...defaults.settings, ...parsed.settings },
            stats: { ...defaults.stats, ...parsed.stats },
            mistakes: parsed.mistakes || {}
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return getDefaultState();
  }

  save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Row selection methods
  getSelectedRowIds() {
    return this.state.selectedRowIds;
  }

  setSelectedRowIds(rowIds) {
    this.state.selectedRowIds = Array.from(new Set(rowIds));
    this.save();
  }

  toggleRow(rowId) {
    const current = new Set(this.state.selectedRowIds);
    if (current.has(rowId)) {
      current.delete(rowId);
    } else {
      current.add(rowId);
    }
    this.state.selectedRowIds = Array.from(current);
    this.save();
  }

  // Stats methods
  recordResult(target, isCorrect) {
    this.state.stats.answered += 1;

    if (isCorrect) {
      this.state.stats.correct += 1;
      this.state.stats.currentStreak += 1;
      if (this.state.stats.currentStreak > this.state.stats.bestStreak) {
        this.state.stats.bestStreak = this.state.stats.currentStreak;
      }
    } else {
      this.state.stats.currentStreak = 0;
      // Record mistake
      const existing = this.state.mistakes[target.kana] || {
        kana: target.kana,
        romaji: target.romaji,
        rowName: target.rowName,
        count: 0
      };
      existing.count += 1;
      this.state.mistakes[target.kana] = existing;
    }

    this.save();
  }

  resetStats() {
    this.state.stats = {
      answered: 0,
      correct: 0,
      currentStreak: 0,
      bestStreak: 0
    };
    this.state.mistakes = {};
    this.save();
  }

  // Settings
  updateSettings(partial) {
    this.state.settings = { ...this.state.settings, ...partial };
    this.save();
  }
}

export const stateManager = new StateManager();
