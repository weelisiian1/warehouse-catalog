import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductGrid from './ProductGrid.jsx';
import {
  buildQuoteDraft,
  filterProducts,
  formatModelCount,
  products,
  toggleCompare,
  validateQuote,
} from '../catalog.mjs';
import '../styles.css';

const byId = (id) => document.getElementById(id);
const filtersForm = byId('filters');
const productsGrid = byId('products');
const compareDialog = byId('compare-dialog');
const quoteDialog = byId('quote-dialog');
const quoteForm = byId('quote-form');
const status = byId('status');
const productRoot = createRoot(productsGrid);
let compareIds = [];

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
  productRoot.render(
    <ProductGrid
      products={filtered}
      compareIds={compareIds}
      onCompare={toggleProductCompare}
      onQuote={(id) => openQuote([id])}
    />,
  );
  if (announce) status.textContent = `Найдено ${formatModelCount(filtered.length)}.`;
}

function renderCompareBar() {
  const count = String(compareIds.length);
  byId('compare-bar').hidden = compareIds.length === 0;
  byId('catalog-compare-count').textContent = count;
  byId('bar-compare-count').textContent = count;
  byId('catalog-compare-open').disabled = compareIds.length === 0;
  byId('quote-open').disabled = compareIds.length === 0;
}

function toggleProductCompare(id) {
  const wasSelected = compareIds.includes(id);
  if (!wasSelected && compareIds.length >= 3) {
    status.textContent = 'Для сравнения можно выбрать не более трёх моделей.';
    return;
  }
  compareIds = toggleCompare(compareIds, id);
  status.textContent = wasSelected ? 'Модель убрана из сравнения.' : 'Модель добавлена к сравнению.';
  renderProducts();
  renderCompareBar();
}

function renderCompare() {
  const selected = products.filter((product) => compareIds.includes(product.id));
  if (!selected.length) {
    status.textContent = 'Сначала добавьте модель в сравнение.';
    return;
  }
  const rows = [
    ['Грузоподъёмность', (product) => `${new Intl.NumberFormat('ru-RU').format(product.capacityKg)} кг`],
    ['Высота подъёма', (product) => product.liftLabel],
    ['Центр нагрузки', (product) => `${new Intl.NumberFormat('ru-RU').format(product.loadCentreMm)} мм`],
    ['Питание', (product) => product.powerDetail],
  ];
  byId('comparison').innerHTML = `<table><caption class="visually-hidden">Сравнение выбранной техники</caption><thead><tr><th scope="col">Параметр</th>${selected.map((product) => `<th scope="col">${product.brand} ${product.model}</th>`).join('')}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${selected.map((product) => `<td>${value(product)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  compareDialog.showModal();
}

function openQuote(ids) {
  byId('quote-items').value = ids.map((id) => products.find((product) => product.id === id)?.name).filter(Boolean).join(', ');
  byId('quote-success').hidden = true;
  quoteForm.hidden = false;
  byId('quote-draft').value = '';
  byId('quote-copy').textContent = 'Скопировать текст';
  quoteDialog.showModal();
}

filtersForm.addEventListener('input', () => renderProducts(false));
filtersForm.addEventListener('change', () => renderProducts(true));
filtersForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderProducts(true);
  byId('catalog').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
  filtersForm.elements.type.value = button.dataset.category;
  renderProducts(true);
}));
byId('clear-filters').addEventListener('click', () => { filtersForm.reset(); renderProducts(true); });
byId('empty-clear').addEventListener('click', () => { filtersForm.reset(); renderProducts(true); });
byId('catalog-compare-open').addEventListener('click', renderCompare);
byId('bar-compare-open').addEventListener('click', renderCompare);
byId('compare-clear').addEventListener('click', () => {
  compareIds = [];
  renderProducts();
  renderCompareBar();
  status.textContent = 'Сравнение очищено.';
});
byId('compare-clear-dialog').addEventListener('click', () => {
  compareIds = [];
  renderProducts();
  renderCompareBar();
  status.textContent = 'Сравнение очищено.';
  compareDialog.close();
});
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
