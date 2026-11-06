import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteDraft, filterProducts, formatModelCount, products as catalogProducts, toggleCompare, validateQuote } from '../catalog.mjs';

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

test('catalogue model facts match their traceable specification sources', () => {
  const byId = Object.fromEntries(catalogProducts.map((product) => [product.id, product]));

  assert.deepEqual(
    [byId['teu-flb18s'].capacityKg, byId['teu-flb18s'].liftMinMm, byId['teu-flb18s'].liftMm, byId['teu-flb18s'].loadCentreMm],
    [1800, 3000, 4700, 500],
  );
  assert.deepEqual([byId['teu-flb18s'].batteryVoltageV, byId['teu-flb18s'].batteryCapacitiesAh], [76.8, [205, 280]]);

  assert.deepEqual(
    [byId['ep-cqd16l'].capacityKg, byId['ep-cqd16l'].liftMm, byId['ep-cqd16l'].maxLiftMm, byId['ep-cqd16l'].loadCentreMm],
    [1600, 6500, 8000, 600],
  );
  assert.deepEqual([byId['ep-cqd16l'].batteryVoltageV, byId['ep-cqd16l'].batteryCapacityAh], [48, 405]);

  assert.deepEqual(
    [byId['xilin-cdd15ren'].capacityKg, byId['xilin-cdd15ren'].mastHeightsMm, byId['xilin-cdd15ren'].loadCentreMm],
    [1500, [1600, 2500, 3000, 3300, 3500], 600],
  );
  assert.deepEqual([byId['xilin-cdd15ren'].batteryVoltageV, byId['xilin-cdd15ren'].batteryCapacityAh], [24, 105]);

  assert.deepEqual(
    [byId['toyota-lhm230'].capacityKg, byId['toyota-lhm230'].liftMm, byId['toyota-lhm230'].loadCentreMm, byId['toyota-lhm230'].serviceWeightKg],
    [2300, 200, 600, 63],
  );
  assert.ok(catalogProducts.every(({ source }) => /^https:\/\//.test(source)));
});