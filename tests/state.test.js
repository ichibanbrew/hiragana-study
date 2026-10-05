import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultState } from '../src/state.js';

test('getDefaultState returns valid initial state', () => {
  const state = getDefaultState();
  assert.ok(Array.isArray(state.selectedRowIds));
  assert.equal(state.selectedRowIds.length, 10, 'Default has 10 basic rows selected');
  assert.equal(state.stats.answered, 0);
  assert.equal(state.stats.correct, 0);
  assert.equal(state.stats.currentStreak, 0);
  assert.equal(state.stats.bestStreak, 0);
  assert.equal(typeof state.mistakes, 'object');
});
