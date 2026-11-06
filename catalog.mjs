export const products = [
  {
    id: 'teu-flb18s', brand: 'TEU', model: 'FLB18S',
    name: 'Электропогрузчик FLB18S', type: 'forklift', power: 'electric',
    capacityKg: 1800, liftMm: 4700, liftMinMm: 3000, liftLabel: '4 700 мм',
    liftNote: 'Минимальная высота подъёма, указанная дилером, — 3 000 мм.',
    loadCentreMm: 500, loadCentreLabel: 'Центр тяжести груза',
    batteryVoltageV: 76.8, batteryCapacitiesAh: [205, 280],
    powerDetail: '76,8 В · 205/280 А·ч · Li-ion', turningRadiusMm: 2070,
    source: 'https://istk.ru/catalog/product/elektropogruzchik-teu-flb18s/',
    sourceLabel: 'карточка модели ИСТК',
    sourceNote: 'В карточке дилера указаны грузоподъёмность 1 800 кг, высота подъёма 4 700 мм, минимальная высота 3 000 мм, центр тяжести 500 мм и варианты аккумулятора 76,8 В / 205 или 280 А·ч. Сверьте выбранную мачту и аккумулятор в паспорте конкретной комплектации.',
  },
  {
    id: 'ep-cqd16l', brand: 'EP Equipment', model: 'CQD16L',
    name: 'Ричтрак CQD16L', type: 'reach', power: 'electric',
    capacityKg: 1600, liftMm: 6500, maxLiftMm: 8000, liftLabel: '6 500 мм',
    liftNote: 'Максимальная высота подъёма по брошюре — 8 000 мм.',
    loadCentreMm: 600, batteryVoltageV: 48, batteryCapacityAh: 405,
    powerDetail: '48 В · 405 А·ч · Li-ion', turningRadiusMm: 1720,
    source: 'https://ep-equipment.com/wp-content/uploads/2021/01/CQD16L-20L-EN-Brochure-4.pdf',
    sourceLabel: 'брошюра EP Equipment (PDF)',
    sourceNote: 'Брошюра производителя указывает грузоподъёмность 1 600 кг, центр нагрузки 600 мм, высоту подъёма 6 500 мм и максимум 8 000 мм; аккумулятор — 48 В / 405 А·ч. Фактическая высота зависит от мачты.',
  },
  {
    id: 'xilin-cdd15ren', brand: 'Xilin', model: 'CDD15R-EN',
    name: 'Электроштабелёр CDD15R-EN', type: 'stacker', power: 'electric',
    capacityKg: 1500, liftMm: 3500, liftLabel: 'до 3 500 мм',
    liftNote: 'Варианты мачты: 1 600, 2 500, 3 000, 3 300 или 3 500 мм.',
    mastHeightsMm: [1600, 2500, 3000, 3300, 3500],
    loadCentreMm: 600, batteryVoltageV: 24, batteryCapacityAh: 105,
    powerDetail: '24 В · 105 А·ч', turningRadiusMm: 1365,
    source: 'https://www.xilin.com/product/fullelectric-stacker/electric-walkie-stacker-570.html',
    sourceLabel: 'страница производителя Xilin',
    sourceNote: 'В таблице производителя: грузоподъёмность 1 500 кг, центр нагрузки 600 мм, варианты высоты подъёма 1 600–3 500 мм, аккумулятор 24 В / 105 А·ч.',
  },
  {
    id: 'toyota-lhm230', brand: 'Toyota', model: 'LHM230',
    name: 'Гидравлическая тележка LHM230', type: 'pallet', power: 'manual',
    capacityKg: 2300, liftMm: 200, liftLabel: 'до 200 мм',
    loadCentreMm: 600, powerDetail: 'Ручной гидравлический привод', serviceWeightKg: 63,
    source: 'https://media.toyota-forklifts.eu/published/24101_Original%20document_toyota%20mh.pdf',
    sourceLabel: 'технический лист Toyota (PDF)',
    sourceNote: 'Технический лист производителя для LHM230 указывает грузоподъёмность 2 300 кг, центр нагрузки 600 мм, массу 63 кг и высоту подъёма до 200 мм. Значения для версии LHM230U в том же документе отличаются.',
  },
];

const pluralRules = new Intl.PluralRules('ru');
const modelCountLabels = { one: 'модель', few: 'модели', many: 'моделей', other: 'модели' };

export function formatModelCount(count) {
  return `${count} ${modelCountLabels[pluralRules.select(count)]}`;
}

export function filterProducts(items, filters = {}) {
  const query = String(filters.query ?? '').trim().toLocaleLowerCase('ru');
  return items.filter((product) => {
    if (filters.type && product.type !== filters.type) return false;
    if (filters.power && product.power !== filters.power) return false;
    if (filters.capacityMin && product.capacityKg < Number(filters.capacityMin)) return false;
    if (filters.liftMin && product.liftMm < Number(filters.liftMin)) return false;
    return !query || `${product.name} ${product.brand} ${product.model}`.toLocaleLowerCase('ru').includes(query);
  });
}

export function toggleCompare(ids, id, limit = 3) {
  if (ids.includes(id)) return ids.filter((item) => item !== id);
  if (ids.length >= limit) return ids;
  return [...ids, id];
}

export function validateQuote({ name = '', phone = '', email = '' } = {}) {
  const errors = {};
  if (!name.trim()) errors.name = 'Введите имя.';
  const validPhone = phone.replace(/\D/g, '').length >= 10;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (email.trim() && !validEmail) errors.email = 'Проверьте адрес электронной почты.';
  if (!validPhone && !validEmail) errors.contact = 'Укажите телефон или почту для связи.';
  return errors;
}

export function buildQuoteDraft({ items = '', name = '', phone = '', email = '' } = {}) {
  const contact = [phone.trim(), email.trim()].filter(Boolean).join(' / ');
  return `Здравствуйте! Прошу уточнить цену и комплектацию.\n\nИнтересующая техника: ${items.trim() || 'Не выбрана'}\nИмя: ${name.trim()}\nКонтакт: ${contact}\n\nПрошу подтвердить характеристики и наличие у поставщика.`;
}
