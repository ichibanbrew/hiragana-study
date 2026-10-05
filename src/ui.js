import {
  HIRAGANA_ROWS,
  HIRAGANA_CATEGORIES,
  getBasicRowIds,
  getCharactersByRowIds
} from './data/hiragana.js';
import { generateQuestion, evaluateAnswer } from './quiz-engine.js';
import { stateManager } from './state.js';
import { playSound, speakKana } from './audio.js';

export class QuizUI {
  constructor() {
    this.currentQuestion = null;
    this.isAnswering = false;
    this.autoAdvanceTimer = null;

    // Cache DOM elements
    this.elements = {
      cardKanaDisplay: document.getElementById('card-kana-display'),
      cardRowBadge: document.getElementById('card-row-badge'),
      btnAudioSpeak: document.getElementById('btn-audio-speak'),
      optionsContainer: document.getElementById('options-container'),
      btnNextQuestion: document.getElementById('btn-next-question'),
      toggleAutoAdvance: document.getElementById('toggle-auto-advance'),

      // Stats
      statCurrentStreak: document.getElementById('stat-current-streak'),
      statBestStreak: document.getElementById('stat-best-streak'),
      statAccuracy: document.getElementById('stat-accuracy'),
      statAnswered: document.getElementById('stat-answered'),

      // Active pool summary
      activeRowsSummary: document.getElementById('active-rows-summary'),
      activePoolBar: document.getElementById('active-pool-bar'),
      headerRowCount: document.getElementById('header-row-count'),

      // Row Selection Modal
      rowsModal: document.getElementById('rows-modal'),
      btnOpenRows: document.getElementById('btn-open-rows'),
      btnCloseRowsModal: document.getElementById('btn-close-rows-modal'),
      btnApplyRows: document.getElementById('btn-apply-rows'),
      btnSelectBasic: document.getElementById('btn-select-basic'),
      btnSelectAll: document.getElementById('btn-select-all'),
      btnClearAll: document.getElementById('btnClearAll') || document.getElementById('btn-clear-all'),
      categoriesContainer: document.getElementById('categories-container'),
      modalSelectionCount: document.getElementById('modal-selection-count'),

      // Mistakes Modal
      mistakesModal: document.getElementById('mistakes-modal'),
      btnOpenMistakes: document.getElementById('btn-open-mistakes'),
      btnCloseMistakesModal: document.getElementById('btn-close-mistakes-modal'),
      btnCloseMistakes: document.getElementById('btn-close-mistakes'),
      btnResetStats: document.getElementById('btn-reset-stats'),
      mistakesList: document.getElementById('mistakes-list'),
      mistakesCountBadge: document.getElementById('mistakes-count-badge'),

      // Theme
      btnToggleTheme: document.getElementById('btn-toggle-theme')
    };

    // Working set of row IDs in the modal before applying
    this.modalSelectedRowIds = new Set(stateManager.getSelectedRowIds());
  }

  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.renderStats();
    this.renderActiveRowsSummary();
    this.buildCategoriesModal();
    this.nextQuestion();

    // Subscribe to state changes
    stateManager.subscribe(() => {
      this.renderStats();
      this.renderActiveRowsSummary();
      this.updateMistakesBadge();
    });
  }

  setupTheme() {
    const theme = stateManager.state.settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    this.elements.btnToggleTheme.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  setupEventListeners() {
    // Theme toggle
    this.elements.btnToggleTheme.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      this.elements.btnToggleTheme.textContent = next === 'dark' ? '☀️' : '🌙';
      stateManager.updateSettings({ theme: next });
    });

    // Pronounce audio
    this.elements.btnAudioSpeak.addEventListener('click', () => {
      if (this.currentQuestion) {
        speakKana(this.currentQuestion.target.kana);
      }
    });

    // Next question button
    this.elements.btnNextQuestion.addEventListener('click', () => {
      this.nextQuestion();
    });

    // Auto-advance toggle
    this.elements.toggleAutoAdvance.checked = stateManager.state.settings.autoAdvance;
    this.elements.toggleAutoAdvance.addEventListener('change', (e) => {
      stateManager.updateSettings({ autoAdvance: e.target.checked });
      if (!e.target.checked && this.isAnswering) {
        this.elements.btnNextQuestion.style.display = 'inline-flex';
      }
    });

    // Keyboard shortcuts (1-5, Space, Enter)
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input or modal is open
      if (e.target.tagName === 'INPUT' || this.isAnyModalOpen()) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 5) {
        e.preventDefault();
        this.handleOptionSelection(num - 1);
      } else if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (this.isAnswering) {
          clearTimeout(this.autoAdvanceTimer);
          this.nextQuestion();
        } else if (this.currentQuestion) {
          speakKana(this.currentQuestion.target.kana);
        }
      }
    });

    // Row selection modal triggers
    this.elements.btnOpenRows.addEventListener('click', () => this.openRowsModal());
    if (this.elements.activePoolBar) {
      this.elements.activePoolBar.addEventListener('click', () => this.openRowsModal());
      this.elements.activePoolBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          this.openRowsModal();
        }
      });
    }
    this.elements.btnCloseRowsModal.addEventListener('click', () => this.closeRowsModal());
    this.elements.rowsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.rowsModal) this.closeRowsModal();
    });

    // Row selection quick actions
    this.elements.btnSelectBasic.addEventListener('click', () => {
      this.modalSelectedRowIds = new Set(getBasicRowIds());
      this.syncModalCheckboxes();
    });

    this.elements.btnSelectAll.addEventListener('click', () => {
      this.modalSelectedRowIds = new Set(HIRAGANA_ROWS.map(r => r.id));
      this.syncModalCheckboxes();
    });

    this.elements.btnClearAll.addEventListener('click', () => {
      this.modalSelectedRowIds.clear();
      this.syncModalCheckboxes();
    });

    this.elements.btnApplyRows.addEventListener('click', () => {
      if (this.modalSelectedRowIds.size === 0) {
        alert('Please select at least one Hiragana row to practice!');
        return;
      }
      stateManager.setSelectedRowIds(Array.from(this.modalSelectedRowIds));
      this.closeRowsModal();
      this.nextQuestion(); // restart with new pool
    });

    // Mistakes modal triggers
    this.elements.btnOpenMistakes.addEventListener('click', () => this.openMistakesModal());
    this.elements.btnCloseMistakesModal.addEventListener('click', () => this.closeMistakesModal());
    this.elements.btnCloseMistakes.addEventListener('click', () => this.closeMistakesModal());
    this.elements.mistakesModal.addEventListener('click', (e) => {
      if (e.target === this.elements.mistakesModal) this.closeMistakesModal();
    });

    this.elements.btnResetStats.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all streak, score, and mistake stats?')) {
        stateManager.resetStats();
        this.renderMistakesList();
      }
    });
  }

  isAnyModalOpen() {
    return this.elements.rowsModal.classList.contains('open') ||
           this.elements.mistakesModal.classList.contains('open');
  }

  /**
   * Move to next question
   */
  nextQuestion() {
    clearTimeout(this.autoAdvanceTimer);
    this.isAnswering = false;
    this.elements.btnNextQuestion.style.display = 'none';

    const selectedRows = stateManager.getSelectedRowIds();
    if (selectedRows.length === 0) {
      this.openRowsModal();
      return;
    }

    const prevKana = this.currentQuestion ? this.currentQuestion.target.kana : null;

    try {
      this.currentQuestion = generateQuestion(selectedRows, prevKana);
      this.renderQuestion(this.currentQuestion);

      if (stateManager.state.settings.voiceEnabled) {
        speakKana(this.currentQuestion.target.kana);
      }
    } catch (e) {
      console.error(e);
      this.openRowsModal();
    }
  }

  /**
   * Render question card and 5 options
   */
  renderQuestion(question) {
    this.elements.cardKanaDisplay.textContent = question.target.kana;
    this.elements.cardRowBadge.textContent = `${question.target.rowName}`;

    this.elements.optionsContainer.innerHTML = '';

    question.options.forEach((optRomaji, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.index = index;
      btn.dataset.romaji = optRomaji;

      const textSpan = document.createElement('span');
      textSpan.className = 'option-text';
      textSpan.textContent = optRomaji;

      const badge = document.createElement('span');
      badge.className = 'key-badge';
      badge.textContent = `${index + 1}`;

      btn.appendChild(textSpan);
      btn.appendChild(badge);

      btn.addEventListener('click', () => {
        this.handleOptionSelection(index);
      });

      this.elements.optionsContainer.appendChild(btn);
    });
  }

  /**
   * Handle user choice
   */
  handleOptionSelection(index) {
    if (this.isAnswering || !this.currentQuestion) return;

    const buttons = this.elements.optionsContainer.querySelectorAll('.option-btn');
    const selectedBtn = buttons[index];
    if (!selectedBtn) return;

    this.isAnswering = true;
    const chosenRomaji = selectedBtn.dataset.romaji;
    const evaluation = evaluateAnswer(this.currentQuestion, chosenRomaji);

    // Disable all buttons to prevent double-clicking
    buttons.forEach(btn => btn.disabled = true);

    if (evaluation.isCorrect) {
      selectedBtn.classList.add('correct');
      playSound(true);
      stateManager.recordResult(this.currentQuestion.target, true);
    } else {
      selectedBtn.classList.add('incorrect');
      playSound(false);
      stateManager.recordResult(this.currentQuestion.target, false);

      // Highlight the correct answer button
      buttons.forEach(btn => {
        if (btn.dataset.romaji === evaluation.correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }

    const autoAdvance = stateManager.state.settings.autoAdvance;
    if (autoAdvance) {
      // Delay before next question: 600ms on correct, 1100ms on incorrect to allow review
      const delay = evaluation.isCorrect ? 600 : 1200;
      this.autoAdvanceTimer = setTimeout(() => {
        this.nextQuestion();
      }, delay);
    } else {
      this.elements.btnNextQuestion.style.display = 'inline-flex';
    }
  }

  /**
   * Render Stats Ribbon
   */
  renderStats() {
    const stats = stateManager.state.stats;
    this.elements.statCurrentStreak.textContent = stats.currentStreak;
    this.elements.statBestStreak.textContent = stats.bestStreak;
    this.elements.statAnswered.textContent = stats.answered;

    if (stats.answered > 0) {
      const pct = Math.round((stats.correct / stats.answered) * 100);
      this.elements.statAccuracy.textContent = `${pct}%`;
    } else {
      this.elements.statAccuracy.textContent = '100%';
    }

    this.updateMistakesBadge();
  }

  updateMistakesBadge() {
    const count = Object.keys(stateManager.state.mistakes).length;
    if (count > 0) {
      this.elements.mistakesCountBadge.style.display = 'inline-block';
      this.elements.mistakesCountBadge.textContent = count;
    } else {
      this.elements.mistakesCountBadge.style.display = 'none';
    }
  }

  /**
   * Render Active Row Summary Chips
   */
  renderActiveRowsSummary() {
    const selectedIds = new Set(stateManager.getSelectedRowIds());
    const selectedRows = HIRAGANA_ROWS.filter(r => selectedIds.has(r.id));
    const charsCount = getCharactersByRowIds(stateManager.getSelectedRowIds()).length;

    this.elements.headerRowCount.textContent = `(${selectedRows.length})`;

    this.elements.activeRowsSummary.innerHTML = '';

    if (selectedRows.length === HIRAGANA_ROWS.length) {
      const tag = document.createElement('span');
      tag.className = 'pool-tag';
      tag.textContent = `All Rows (${charsCount} characters)`;
      this.elements.activeRowsSummary.appendChild(tag);
      return;
    }

    // Display first few row tags, then "+N more"
    const displayLimit = 4;
    selectedRows.slice(0, displayLimit).forEach(row => {
      const tag = document.createElement('span');
      tag.className = 'pool-tag';
      tag.textContent = row.name;
      this.elements.activeRowsSummary.appendChild(tag);
    });

    if (selectedRows.length > displayLimit) {
      const extraTag = document.createElement('span');
      extraTag.className = 'pool-tag';
      extraTag.style.opacity = '0.75';
      extraTag.textContent = `+${selectedRows.length - displayLimit} more (${charsCount} chars)`;
      this.elements.activeRowsSummary.appendChild(extraTag);
    }
  }

  /**
   * Construct Row Selection Modal content categorized by Basic, Dakuten, etc.
   */
  buildCategoriesModal() {
    this.elements.categoriesContainer.innerHTML = '';

    HIRAGANA_CATEGORIES.forEach(cat => {
      const rowsInCat = HIRAGANA_ROWS.filter(r => r.category === cat.id);
      if (rowsInCat.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'category-group';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'category-header';
      headerDiv.innerHTML = `
        <h3>${cat.name}</h3>
        <span>${cat.description}</span>
      `;

      const gridDiv = document.createElement('div');
      gridDiv.className = 'rows-grid';

      rowsInCat.forEach(row => {
        const card = document.createElement('div');
        card.className = `row-card ${this.modalSelectedRowIds.has(row.id) ? 'selected' : ''}`;
        card.dataset.rowId = row.id;

        const charPreview = row.characters.map(c => c.kana).join(' ');

        card.innerHTML = `
          <div class="row-card-top">
            <span class="row-card-name">${row.name}</span>
            <input type="checkbox" class="row-checkbox" ${this.modalSelectedRowIds.has(row.id) ? 'checked' : ''} aria-label="${row.name}">
          </div>
          <div class="row-preview-chars">${charPreview}</div>
        `;

        // Toggle handler
        card.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const checkbox = card.querySelector('.row-checkbox');
            checkbox.checked = !checkbox.checked;
          }
          this.handleModalRowToggle(row.id, card.querySelector('.row-checkbox').checked);
        });

        gridDiv.appendChild(card);
      });

      groupDiv.appendChild(headerDiv);
      groupDiv.appendChild(gridDiv);
      this.elements.categoriesContainer.appendChild(groupDiv);
    });

    this.updateModalSelectionCount();
  }

  handleModalRowToggle(rowId, isChecked) {
    if (isChecked) {
      this.modalSelectedRowIds.add(rowId);
    } else {
      this.modalSelectedRowIds.delete(rowId);
    }
    this.syncModalCheckboxes();
  }

  syncModalCheckboxes() {
    const cards = this.elements.categoriesContainer.querySelectorAll('.row-card');
    cards.forEach(card => {
      const rowId = card.dataset.rowId;
      const isSelected = this.modalSelectedRowIds.has(rowId);
      card.classList.toggle('selected', isSelected);
      const checkbox = card.querySelector('.row-checkbox');
      if (checkbox) checkbox.checked = isSelected;
    });

    this.updateModalSelectionCount();
  }

  updateModalSelectionCount() {
    const chars = getCharactersByRowIds(Array.from(this.modalSelectedRowIds));
    const rowCount = this.modalSelectedRowIds.size;

    if (rowCount === 0) {
      this.elements.modalSelectionCount.textContent = '0 characters selected — select at least 1 row';
      this.elements.modalSelectionCount.classList.add('error');
      this.elements.btnApplyRows.disabled = true;
    } else {
      this.elements.modalSelectionCount.textContent = `${chars.length} characters selected (${rowCount} rows)`;
      this.elements.modalSelectionCount.classList.remove('error');
      this.elements.btnApplyRows.disabled = false;
    }
  }

  openRowsModal() {
    this.modalSelectedRowIds = new Set(stateManager.getSelectedRowIds());
    this.syncModalCheckboxes();
    this.elements.rowsModal.classList.add('open');
  }

  closeRowsModal() {
    this.elements.rowsModal.classList.remove('open');
  }

  // Mistakes Modal
  openMistakesModal() {
    this.renderMistakesList();
    this.elements.mistakesModal.classList.add('open');
  }

  closeMistakesModal() {
    this.elements.mistakesModal.classList.remove('open');
  }

  renderMistakesList() {
    const mistakes = Object.values(stateManager.state.mistakes);
    this.elements.mistakesList.innerHTML = '';

    if (mistakes.length === 0) {
      this.elements.mistakesList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          🎉 No mistakes recorded yet! Great job practicing!
        </div>
      `;
      return;
    }

    mistakes.sort((a, b) => b.count - a.count);

    mistakes.forEach(m => {
      const item = document.createElement('div');
      item.className = 'mistake-item';
      item.innerHTML = `
        <div class="mistake-kana">${m.kana}</div>
        <div class="mistake-romaji">${m.romaji}</div>
        <div class="mistake-count">Missed ${m.count}×</div>
        <button class="btn-pill" style="font-size: 0.7rem; padding: 0.2rem 0.4rem; margin-top: 0.3rem;">🔊 Listen</button>
      `;

      item.querySelector('button').addEventListener('click', () => {
        speakKana(m.kana);
      });

      this.elements.mistakesList.appendChild(item);
    });
  }
}
