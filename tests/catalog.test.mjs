import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteDraft, filterProducts, formatModelCount, toggleCompare, validateQuote } from '../catalog.mjs';

const products = [
  { id: 'reach-1', name: 'Ричтрак', type: 'reach', power: 'electric', capacityKg: 1600, liftMm: 7000, environments: ['indoors'] },
  { id: 'fork-1', name: 'Вилочный погрузчик', type: 'forklift', power: 'electric', capacityKg: 2500, liftMm: 4700, environments: ['indoors', 'outdoors'] },
  { id: 'stacker-1', name: 'Штабелёр', type: 'stacker', power: 'electric', capacityKg: 1200, liftMm: 3500, environments: ['indoors'] },
];

test('model counts use Russian plural forms', () => {
  assert.equal(formatModelCount(1), '1 модель');
  assert.equal(formatModelCount(3), '3 модели');
  assert.equal(formatModelCount(5), '5 моделей');
});

test('combines capacity, lift, power and environment filters', () => {
  assert.deepEqual(filterProducts(products, {
    capacityMin: 1500, liftMin: 6000, power: 'electric', environment: 'indoors',
  }).map(({ id }) => id), ['reach-1']);
});

test('an empty filter set returns the full catalog and nonmatching filters can be cleared', () => {
  assert.equal(filterProducts(products, { type: 'forklift' }).length, 1);
  assert.equal(filterProducts(products, {}).length, products.length);
});

test('comparison toggles an item and refuses duplicates or more than three items', () => {
  const once = toggleCompare([], 'reach-1');
  assert.deepEqual(toggleCompare(once, 'reach-1'), []);
  assert.deepEqual(toggleCompare(['reach-1'], 'reach-1'), []);
  assert.deepEqual(toggleCompare(['reach-1', 'fork-1', 'stacker-1'], 'fourth'), ['reach-1', 'fork-1', 'stacker-1']);
});

test('quote draft is composed locally from selected models and the provided contact without claiming to send it', () => {
  const draft = buildQuoteDraft({ items: 'Ричтрак CQD16L', name: ' Ирина ', phone: '+7 900 123-45-67', email: '' });
  assert.match(draft, /Ричтрак CQD16L/);
  assert.match(draft, /Имя: Ирина/);
  assert.match(draft, /Контакт: \+7 900 123-45-67/);
  assert.match(draft, /Прошу уточнить цену и комплектацию/);
  assert.doesNotMatch(draft, /отправлено|доставлено/i);
});

test('quote form requires a name and at least one contact method', () => {
  assert.match(validateQuote({ name: '', phone: '', email: '' }).name, /имя/i);
  assert.match(validateQuote({ name: 'Ирина', phone: '', email: '' }).contact, /телефон или почту/);
  assert.match(validateQuote({ name: 'Ирина', phone: '+7 900 123-45-67', email: 'not-an-email' }).email, /почты/);
  assert.deepEqual(validateQuote({ name: 'Ирина', phone: '+7 900 123-45-67', email: '' }), {});
});