import React from 'react';

const typeLabels = {
  forklift: 'Вилочный погрузчик',
  reach: 'Ричтрак',
  stacker: 'Штабелёр',
  pallet: 'Гидравлическая тележка',
};

const numberFormat = new Intl.NumberFormat('ru-RU');

function ProductCard({ product, compared, onCompare, onQuote }) {
  const extraFact = product.turningRadiusMm
    ? { label: 'Радиус поворота', value: `${numberFormat.format(product.turningRadiusMm)} мм` }
    : { label: 'Масса', value: `${numberFormat.format(product.serviceWeightKg)} кг` };

  return (
    <article className={`product-card product-card--${product.type}`}>
      <div className="product-data-panel">
        <div className="product-panel-top">
          <span className="product-type">{typeLabels[product.type]}</span>
          <span className="product-brand">{product.brand}</span>
        </div>
        <p className="product-model-code">{product.model}</p>
        <div className="product-main-facts">
          <div className="product-main-fact product-main-fact--capacity">
            <span>Грузоподъёмность</span>
            <strong>{numberFormat.format(product.capacityKg)} <small>кг</small></strong>
          </div>
          <div className="product-main-fact">
            <span>Высота подъёма</span>
            <strong>{product.liftLabel}</strong>
            {product.liftNote && <small>{product.liftNote}</small>}
          </div>
        </div>
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>
        <dl className="spec-list">
          <div>
            <dt>{product.loadCentreLabel ?? 'Центр нагрузки'}</dt>
            <dd>{numberFormat.format(product.loadCentreMm)} мм</dd>
          </div>
          <div>
            <dt>Питание</dt>
            <dd>{product.powerDetail}</dd>
          </div>
          <div>
            <dt>{extraFact.label}</dt>
            <dd>{extraFact.value}</dd>
          </div>
        </dl>

        <details className="product-source">
          <summary>Проверить источник параметров</summary>
          <p>{product.sourceNote}</p>
          <a href={product.source} target="_blank" rel="noopener noreferrer">
            Источник: {product.sourceLabel}
          </a>
        </details>

        <div className="product-actions">
          <button
            className="button button--quiet compare-toggle"
            type="button"
            aria-pressed={compared}
            aria-label={`${compared ? 'В сравнении: убрать' : 'Сравнить'} ${product.brand} ${product.model}`}
            onClick={() => onCompare(product.id)}
          >
            {compared ? 'В сравнении' : 'Сравнить'}
          </button>
          <button
            className="button button--text quote-product"
            type="button"
            aria-label={`Подготовить запрос по модели ${product.name}`}
            onClick={() => onQuote(product.id)}
          >
            Подготовить запрос
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductGrid({ products, compareIds, onCompare, onQuote }) {
  return products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      compared={compareIds.includes(product.id)}
      onCompare={onCompare}
      onQuote={onQuote}
    />
  ));
}
