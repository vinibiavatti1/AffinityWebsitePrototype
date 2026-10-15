(function () {
	const categories = window.PRODUCT_CATEGORIES || [];
	const treeEl = document.querySelector('#catalog-tree');
	const gridEl = document.querySelector('#catalog-grid');
	const titleEl = document.querySelector('#catalog-category-title');
	const countEl = document.querySelector('#catalog-category-count');
	const lightbox = document.querySelector('#lightbox');
	const lightboxImg = document.querySelector('#lightbox-img');
	const lightboxCaption = document.querySelector('#lightbox-caption');
	const lightboxClose = document.querySelector('#lightbox-close');

	if (!treeEl || !gridEl || !categories.length) return;

	function buildSrc(slug, item) {
		return `./products/${slug}/${encodeURIComponent(item)}`;
	}

	function renderTree(activeSlug) {
		treeEl.innerHTML = categories.map((cat) => `
			<li class="catalog-tree-item">
				<button type="button" class="catalog-tree-link${cat.slug === activeSlug ? ' active' : ''}" data-slug="${cat.slug}">
					<span>${cat.name}</span>
					<span class="catalog-tree-count">${cat.items.length}</span>
				</button>
			</li>
		`).join('');
	}

	function renderGrid(cat) {
		titleEl.textContent = cat.name;
		countEl.textContent = `${cat.items.length} ${cat.items.length === 1 ? 'produto' : 'produtos'}`;
		gridEl.innerHTML = cat.items.map((item) => {
			const src = buildSrc(cat.slug, item);
			const label = item.replace(/\.[^.]+$/, '');
			return `
				<button type="button" class="catalog-item reveal" data-src="${src}" data-label="${label}" data-category="${cat.name}" aria-label="Ampliar ${cat.name} ${label}">
					<span class="catalog-item-image"><img src="${src}" alt="${cat.name} - ${label}" loading="lazy"></span>
					<span class="catalog-item-label">${label}</span>
				</button>
			`;
		}).join('');
		document.querySelectorAll('.catalog-grid .reveal').forEach((el) => el.classList.add('visible'));
	}

	function selectCategory(slug) {
		const cat = categories.find((c) => c.slug === slug) || categories[0];
		if (!cat) return;
		renderTree(cat.slug);
		renderGrid(cat);
		history.replaceState(null, '', `#${cat.slug}`);
	}

	treeEl.addEventListener('click', (event) => {
		const button = event.target.closest('[data-slug]');
		if (!button) return;
		selectCategory(button.dataset.slug);
		gridEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	});

	gridEl.addEventListener('click', (event) => {
		const item = event.target.closest('.catalog-item');
		if (!item || !lightbox) return;
		lightboxImg.src = item.dataset.src;
		lightboxImg.alt = item.dataset.label;
		lightboxCaption.textContent = `${item.dataset.category} · ${item.dataset.label}`;
		lightbox.hidden = false;
	});

	lightboxClose?.addEventListener('click', () => { lightbox.hidden = true; });
	lightbox?.addEventListener('click', (event) => {
		if (event.target === lightbox) lightbox.hidden = true;
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && lightbox && !lightbox.hidden) lightbox.hidden = true;
	});

	const requestedSlug = decodeURIComponent(location.hash.replace('#', ''));
	const initialSlug = categories.some((cat) => cat.slug === requestedSlug) ? requestedSlug : categories[0].slug;
	selectCategory(initialSlug);
})();
