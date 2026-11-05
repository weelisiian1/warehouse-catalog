export const products = [
  {
    id: 'teu-flb18s', brand: 'TEU', model: 'FLB18S',
    name: 'Электропогрузчик FLB18S', type: 'forklift', power: 'electric',
    capacityKg: 1800, liftMm: 4700, environments: ['indoors', 'outdoors'],
    image: 'forklift', source: 'https://istk.ru/catalog/product/elektropogruzchik-teu-flb18s/',
    sourceNote: 'По каталогу дистрибьютора: грузоподъёмность 1 800 кг, высота подъёма 4 700 мм.'
  },
  {
    id: 'ep-cqd16l', brand: 'EP Equipment', model: 'CQD16L',
    name: 'Ричтрак CQD16L', type: 'reach', power: 'electric',
    capacityKg: 1600, liftMm: 6500, environments: ['indoors'],
    image: 'reach', source: 'https://ilift.co.uk/products/cqd16l-1600kg',
    sourceNote: 'Карточка поставщика: грузоподъёмность 1 600 кг, мачта 6 500 мм в указанной комплектации.'
  },
  {
    id: 'xilin-cdd15ren', brand: 'Xilin', model: 'CDD15R-EN',
    name: 'Электроштабелёр CDD15R-EN', type: 'stacker', power: 'electric',
    capacityKg: 1500, liftMm: 3500, environments: ['indoors'],
    image: 'stacker', source: 'https://www.xilin.com/product/fullelectric-stacker/electric-walkie-stacker-570.html',
    sourceNote: 'В каталоге дистрибьютора указаны грузоподъёмность 1 500 кг и высота подъёма 1 600–3 500 мм.'
  },
  {
    id: 'toyota-lhm230', brand: 'Toyota', model: 'LHM230',
    name: 'Гидравлическая тележка LHM230', type: 'pallet', power: 'manual',
    capacityKg: 2300, liftMm: 0, environments: ['indoors', 'outdoors'],
    image: 'pallet', source: 'https://media.toyota-forklifts.eu/published/24101_Original%20document_toyota%20mh.pdf',
    sourceNote: 'Паспорт Toyota указывает ручной тип управления и номинальную грузоподъёмность 2 300 кг.'
  }
];

export function formatModelCount(count) {
  const category = new Intl.PluralRules('ru').select(count);
  const label = { one: 'модель', few: 'модели', many: 'моделей', other: 'модели' }[category];
  return `${count} ${label}`;
}

export function filterProducts(items, filters = {}) {
  const query = String(filters.query ?? '').trim().toLocaleLowerCase('ru');
  return items.filter((product) => {
    if (filters.type && product.type !== filters.type) return false;
    if (filters.power && product.power !== filters.power) return false;
    if (filters.capacityMin && product.capacityKg < Number(filters.capacityMin)) return false;
    if (filters.liftMin && product.liftMm < Number(filters.liftMin)) return false;
    if (filters.environment && !product.environments?.includes(filters.environment)) return false;
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

function equipmentIllustration(kind) {
  const fork = `<svg viewBox="0 0 320 210" aria-hidden="true"><path d="M70 142h160l-12 34H82z" fill="#e3b73e"/><path d="M93 88h95l25 54H73z" fill="#e3b73e"/><path d="M188 88h8l12 54h-8zM206 68h7v75h-7zM218 68h7v75h-7z" fill="#223b3b"/><path d="M84 91h41V67h42v24h20l20 51H70z" fill="#dda92b"/><path d="M125 70h35v24h-35z" fill="#bdd1ca"/><circle cx="112" cy="174" r="24" fill="#203434"/><circle cx="203" cy="174" r="24" fill="#203434"/><circle cx="112" cy="174" r="10" fill="#95a69e"/><circle cx="203" cy="174" r="10" fill="#95a69e"/><path d="M36 143h44v6H36zM35 155h58v6H35z" fill="#283d3d"/></svg>`;
  const reach = `<svg viewBox="0 0 320 210" aria-hidden="true"><path d="M86 125h162v46H86z" fill="#e0b640"/><path d="M106 86h56v39h-56z" fill="#d4a72f"/><path d="M169 49h9v112h-9zM183 49h9v112h-9zM198 49h7v112h-7z" fill="#263b3b"/><path d="M147 62h34v31h-34z" fill="#bfd2ca"/><circle cx="120" cy="174" r="22" fill="#203434"/><circle cx="221" cy="174" r="22" fill="#203434"/><circle cx="120" cy="174" r="9" fill="#95a69e"/><circle cx="221" cy="174" r="9" fill="#95a69e"/><path d="M202 55h64v5h-64z" fill="#2b4240"/></svg>`;
  const stacker = `<svg viewBox="0 0 320 210" aria-hidden="true"><path d="M100 62h12v117h-12zM118 62h10v117h-10z" fill="#263d3c"/><path d="M76 125h144v40H76z" fill="#e1b63d"/><path d="M134 93h52v31h-52z" fill="#d2a531"/><path d="M108 75h59v18h-59z" fill="#bfd2ca"/><path d="M128 62h10v64h-10zM139 62h9v64h-9z" fill="#263d3c"/><circle cx="109" cy="171" r="19" fill="#203434"/><circle cx="197" cy="171" r="19" fill="#203434"/><circle cx="109" cy="171" r="8" fill="#95a69e"/><circle cx="197" cy="171" r="8" fill="#95a69e"/><path d="M192 75h70v5h-70z" fill="#263d3c"/></svg>`;
  const pallet = `<svg viewBox="0 0 320 210" aria-hidden="true"><path d="M54 124h198v26H54z" fill="#e0b53d"/><path d="M64 151h184v16H64z" fill="#233c3b"/><path d="M78 165h20v19H78zM214 165h20v19h-20z" fill="#253d3c"/><path d="M245 124V73h10v51M253 76h27v8h-27" fill="none" stroke="#273f3d" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M83 123l-2-38c-1-13 9-23 21-23h27v61" fill="#d8a92e"/><path d="M101 74h22v23h-22z" fill="#bfd2ca"/><circle cx="112" cy="169" r="18" fill="#203434"/><circle cx="201" cy="169" r="18" fill="#203434"/></svg>`;
  return ({ forklift: fork, reach, stacker, pallet })[kind] ?? fork;
}

if (typeof document !== 'undefined') {
let compareIds = [];
const byId = (id) => document.getElementById(id);
const filtersForm = byId('filters');
const productsGrid = byId('products');
const compareDialog = byId('compare-dialog');
const quoteDialog = byId('quote-dialog');
const quoteForm = byId('quote-form');
const status = byId('status');

function filtersFromForm() {
  return Object.fromEntries(new FormData(filtersForm).entries());
}
function renderProducts(announce = false) {
  const filters = filtersFromForm();
  const filtered = filterProducts(products, filters);
  byId('result-count').textContent = formatModelCount(filtered.length);
  document.querySelectorAll('[data-category]').forEach((button) => {
    const selected = filters.type === button.dataset.category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  byId('empty-state').hidden = filtered.length > 0;
  productsGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-visual product-visual--${product.image}">${equipmentIllustration(product.image)}<span class="product-type">${product.type === 'forklift' ? 'Вилочные погрузчики' : product.type === 'reach' ? 'Ричтраки' : product.type === 'stacker' ? 'Штабелёры' : 'Тележки'}</span></div>
      <div class="product-body"><p class="brand-name">${product.brand}</p><h3>${product.name}</h3>
        <dl class="spec-list"><div><dt>Грузоподъёмность</dt><dd>${new Intl.NumberFormat('ru-RU').format(product.capacityKg)} кг</dd></div><div><dt>Высота подъёма</dt><dd>${product.liftMm ? `${new Intl.NumberFormat('ru-RU').format(product.liftMm)} мм` : 'низкий подъём'}</dd></div><div><dt>Привод</dt><dd>${product.power === 'manual' ? 'ручной' : 'электрический'}</dd></div></dl>
        <details class="product-source"><summary>Источник параметров</summary><p>${product.sourceNote} <a href="${product.source}">Источник: ${product.brand} ${product.model}</a></p></details>
        <div class="product-actions"><button class="button button--quiet compare-toggle" type="button" data-compare="${product.id}" aria-pressed="${compareIds.includes(product.id)}" aria-label="${compareIds.includes(product.id) ? 'В сравнении: ' + product.brand + ' ' + product.model : 'Сравнить ' + product.brand + ' ' + product.model}">${compareIds.includes(product.id) ? 'В сравнении' : 'Сравнить'}</button><button class="button button--text quote-product" type="button" data-quote="${product.id}" aria-label="Подготовить запрос по модели ${product.name}">Подготовить запрос</button></div>
      </div>
    </article>`).join('');
  productsGrid.querySelectorAll('[data-compare]').forEach((button) => button.addEventListener('click', () => {
    const wasSelected = compareIds.includes(button.dataset.compare);
    if (!wasSelected && compareIds.length >= 3) {
      status.textContent = 'Для сравнения можно выбрать не более трёх моделей.';
      return;
    }
    compareIds = toggleCompare(compareIds, button.dataset.compare);
    status.textContent = wasSelected ? 'Модель убрана из сравнения.' : 'Модель добавлена к сравнению.';
    renderProducts(); renderCompareBar();
  }));
  productsGrid.querySelectorAll('[data-quote]').forEach((button) => button.addEventListener('click', () => openQuote([button.dataset.quote])));
  if (announce) status.textContent = `Найдено ${formatModelCount(filtered.length)}.`;
}

function renderCompareBar() {
  const bar = byId('compare-bar');
  const count = String(compareIds.length);
  bar.hidden = compareIds.length === 0;
  byId('catalog-compare-count').textContent = count;
  byId('bar-compare-count').textContent = count;
  byId('catalog-compare-open').disabled = compareIds.length === 0;
  byId('quote-open').disabled = compareIds.length === 0;
}
function renderCompare() {
  const selected = products.filter((product) => compareIds.includes(product.id));
  if (!selected.length) {
    status.textContent = 'Сначала добавьте модель в сравнение.';
    return;
  }
  const rows = [
    ['Тип техники', (p) => p.name.split(' ').slice(0, -1).join(' ')],
    ['Грузоподъёмность', (p) => `${new Intl.NumberFormat('ru-RU').format(p.capacityKg)} кг`],
    ['Высота подъёма', (p) => p.liftMm ? `${new Intl.NumberFormat('ru-RU').format(p.liftMm)} мм` : 'низкий подъём'],
    ['Привод', (p) => p.power === 'manual' ? 'ручной' : 'электрический'],
  ];
  byId('comparison').innerHTML = `<table><caption class="visually-hidden">Сравнение выбранной техники</caption><thead><tr><th scope="col">Параметр</th>${selected.map((p) => `<th scope="col">${p.brand} ${p.model}</th>`).join('')}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${selected.map((p) => `<td>${value(p)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  compareDialog.showModal();
}
function openQuote(ids) {
  byId('quote-items').value = ids.map((id) => products.find((p) => p.id === id)?.name).filter(Boolean).join(', ');
  byId('quote-success').hidden = true;
  quoteForm.hidden = false;
  byId('quote-draft').value = '';
  byId('quote-copy').textContent = 'Скопировать текст';
  quoteDialog.showModal();
}

filtersForm.addEventListener('input', () => renderProducts(false));
filtersForm.addEventListener('change', () => renderProducts(true));
filtersForm.addEventListener('submit', (event) => { event.preventDefault(); renderProducts(true); byId('catalog').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { filtersForm.elements.type.value = button.dataset.category; renderProducts(true); }));
byId('clear-filters').addEventListener('click', () => { filtersForm.reset(); renderProducts(true); });
byId('catalog-compare-open').addEventListener('click', renderCompare);
byId('bar-compare-open').addEventListener('click', renderCompare);
byId('compare-clear').addEventListener('click', () => { compareIds = []; renderProducts(); renderCompareBar(); status.textContent = 'Сравнение очищено.'; });
byId('compare-clear-dialog').addEventListener('click', () => { compareIds = []; renderProducts(); renderCompareBar(); status.textContent = 'Сравнение очищено.'; compareDialog.close(); });
byId('quote-open').addEventListener('click', () => openQuote(compareIds));
byId('quote-close').addEventListener('click', () => quoteDialog.close());
byId('quote-close-success').addEventListener('click', () => quoteDialog.close());
byId('quote-copy').addEventListener('click', async () => {
  const draft = byId('quote-draft');
  try {
    await navigator.clipboard.writeText(draft.value);
    byId('quote-copy').textContent = 'Скопировано';
    status.textContent = 'Текст обращения скопирован.';
  } catch {
    draft.focus();
    draft.select();
    status.textContent = 'Текст выделен. Скопируйте его вручную.';
  }
});
byId('compare-close').addEventListener('click', () => compareDialog.close());
byId('empty-clear').addEventListener('click', () => { filtersForm.reset(); renderProducts(true); });

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(quoteForm).entries());
  const errors = validateQuote(values);
  for (const field of ['name', 'contact', 'email']) {
    const input = byId(field === 'contact' ? 'quote-phone' : `quote-${field}`);
    const error = byId(field === 'contact' ? 'error-contact' : `error-${field}`);
    const message = errors[field] ?? '';
    error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }
  if (Object.keys(errors).length) {
    quoteForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  byId('quote-draft').value = buildQuoteDraft(values);
  quoteForm.hidden = true;
  byId('quote-success').hidden = false;
  status.textContent = 'Текст обращения подготовлен. Данные не отправлены.';
});

renderProducts();
renderCompareBar();
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('has-intersection-observer');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}
}