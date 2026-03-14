/**
 * CQC Admin Panel - Authentication & Content Management
 * 
 * Default login: cqcAdmin2024!
 * Content is stored in localStorage under "cqc_event_data" (default page)
 * or "cqc_event_data_<slug>" for additional pages.
 * The pages registry is stored under "cqc_pages_list".
 */

const ADMIN_SESSION_KEY  = 'cqc_admin_session';
const ADMIN_HASH_KEY     = 'cqc_admin_hash';
const CONTENT_KEY        = 'cqc_event_data';
const PAGES_REGISTRY_KEY = 'cqc_pages_list';

// Track the page currently being edited (slug + content key)
window._currentEditSlug       = 'qe2022';
window._currentEditContentKey = CONTENT_KEY;

// Default password hash for "cqcAdmin2024!" (SHA-256)
const DEFAULT_HASH = '02feafc6fb0b9004437ff5694400136fd017318ce2ecfdad8d5c95f5b7c331cb';

// ── Crypto helpers ────────────────────────────────────────────────────────────

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Session helpers ───────────────────────────────────────────────────────────

function isLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function setLoggedIn() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
}

function logout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = 'login.html';
}

// ── Auth guard (call on protected pages) ─────────────────────────────────────

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// ── Login handler ─────────────────────────────────────────────────────────────

async function handleLogin(event) {
  event.preventDefault();

  const passwordInput = document.getElementById('adminPassword');
  const errorEl       = document.getElementById('loginError');
  const btnEl         = document.getElementById('loginBtn');
  const password      = passwordInput ? passwordInput.value : '';

  if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Verifying…'; }
  if (errorEl) errorEl.style.display = 'none';

  const enteredHash = await sha256(password);
  const storedHash  = localStorage.getItem(ADMIN_HASH_KEY) || DEFAULT_HASH;

  if (enteredHash === storedHash) {
    setLoggedIn();
    window.location.href = 'dashboard.html';
  } else {
    if (errorEl) errorEl.style.display = 'block';
    if (btnEl)   { btnEl.disabled = false; btnEl.textContent = 'Login'; }
    if (passwordInput) passwordInput.value = '';
  }
}

// ── Default event content ─────────────────────────────────────────────────────

function getDefaultContent() {
  return {
    eventTitle:       'QE Week 2022',
    eventSubtitle:    'Annual Quality Engineering Conference',
    eventDate:        'November 2022',
    eventLocation:    'Colombo, Sri Lanka',
    eventDescription: 'QE Week is the flagship annual event of Colombo Quality Camp — a multi-day conference bringing together quality engineering practitioners, testers, and tech leaders from across Sri Lanka and beyond.',
    heroImageUrl:     '',
    stats: [
      { icon: 'fas fa-users',        value: '500+', label: 'Attendees'  },
      { icon: 'fas fa-microphone',   value: '20',   label: 'Speakers'   },
      { icon: 'fas fa-calendar-alt', value: '10',   label: 'Sessions'   },
      { icon: 'fas fa-clock',        value: '3',    label: 'Days'       },
    ],
    speakers: [
      { name: 'Tharindra Jayamaha', role: 'Quality Engineering Lead', bio: 'Expert in test automation and quality processes.', imageUrl: '../img/portrait.jpg' },
      { name: 'Chamal Perera',      role: 'Senior QA Engineer',       bio: 'Passionate about continuous testing and DevOps.',  imageUrl: '../img/portrait.jpg' },
    ],
    sessions: [
      {
        speaker:     'John Smith',
        title:       'Introduction to Creative Design in QA',
        description: 'In this session we will discuss about digital topics in detail. You need laptops and other tech support equipment. This session will last for 2 hours.',
        youtubeUrl:  '',
      },
      {
        speaker:     'John Smith',
        title:       'Advanced Test Automation Strategies',
        description: 'A deep dive into modern test automation frameworks, patterns and best practices for enterprise-scale applications.',
        youtubeUrl:  '',
      },
    ],
    gallery: [],
  };
}

// ── Content storage ───────────────────────────────────────────────────────────

function loadContent(contentKey) {
  const key = contentKey || CONTENT_KEY;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults so new fields added later still have values
      const defaults = getDefaultContent();
      return {
        ...defaults,
        ...parsed,
        stats:    (parsed.stats    && parsed.stats.length)    ? parsed.stats    : defaults.stats,
        speakers: (parsed.speakers && parsed.speakers.length) ? parsed.speakers : defaults.speakers,
        sessions: (parsed.sessions && parsed.sessions.length) ? parsed.sessions : defaults.sessions,
        gallery:  parsed.gallery  || defaults.gallery,
      };
    }
  } catch (_) { /* ignore */ }
  return getDefaultContent();
}

function saveContent(data, contentKey) {
  const key = contentKey || CONTENT_KEY;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Pages registry ────────────────────────────────────────────────────────────

function getDefaultPagesRegistry() {
  return [
    { slug: 'qe2022', title: 'QE Week 2022', contentKey: CONTENT_KEY },
  ];
}

function loadPagesRegistry() {
  try {
    const stored = localStorage.getItem(PAGES_REGISTRY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) { /* ignore */ }
  return getDefaultPagesRegistry();
}

function savePagesRegistry(pages) {
  localStorage.setItem(PAGES_REGISTRY_KEY, JSON.stringify(pages));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^-+|-+$/g, '') || ('page' + Date.now());
}

// ── Dashboard helpers ─────────────────────────────────────────────────────────

function buildStatsHTML(stats) {
  return stats.map((s, i) => `
    <div class="border border-secondary rounded p-3 mb-3 stat-item" data-index="${i}">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label admin-label">Icon class</label>
          <input type="text" class="form-control admin-input" name="stats[${i}][icon]" value="${escHtml(s.icon)}" placeholder="fas fa-users">
        </div>
        <div class="col-md-3">
          <label class="form-label admin-label">Value</label>
          <input type="text" class="form-control admin-input" name="stats[${i}][value]" value="${escHtml(s.value)}" placeholder="500+">
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">Label</label>
          <input type="text" class="form-control admin-input" name="stats[${i}][label]" value="${escHtml(s.label)}" placeholder="Attendees">
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button type="button" class="btn btn-sm btn-outline-danger w-100" onclick="removeItem('stats-container', ${i})">Remove</button>
        </div>
      </div>
    </div>`).join('');
}

function buildSpeakersHTML(speakers) {
  return speakers.map((sp, i) => `
    <div class="border border-secondary rounded p-3 mb-3 speaker-item" data-index="${i}">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label admin-label">Name</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][name]" value="${escHtml(sp.name)}" placeholder="Speaker Name">
        </div>
        <div class="col-md-3">
          <label class="form-label admin-label">Role / Title</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][role]" value="${escHtml(sp.role)}" placeholder="QA Engineer">
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">Bio</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][bio]" value="${escHtml(sp.bio)}" placeholder="Short bio">
        </div>
        <div class="col-md-2">
          <label class="form-label admin-label">Photo URL</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][imageUrl]" value="${escHtml(sp.imageUrl)}" placeholder="../img/portrait.jpg">
        </div>
        <div class="col-12 text-end">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem('speakers-container', ${i})">Remove Speaker</button>
        </div>
      </div>
    </div>`).join('');
}

function buildSessionsHTML(sessions) {
  return sessions.map((s, i) => `
    <div class="border border-secondary rounded p-3 mb-3 session-item" data-index="${i}">
      <div class="row g-2">
        <div class="col-md-4">
          <label class="form-label admin-label">Speaker</label>
          <input type="text" class="form-control admin-input" name="sessions[${i}][speaker]" value="${escHtml(s.speaker)}" placeholder="Speaker Name">
        </div>
        <div class="col-md-8">
          <label class="form-label admin-label">Session Title</label>
          <input type="text" class="form-control admin-input" name="sessions[${i}][title]" value="${escHtml(s.title)}" placeholder="Session Title">
        </div>
        <div class="col-md-8">
          <label class="form-label admin-label">Description</label>
          <textarea class="form-control admin-input" name="sessions[${i}][description]" rows="2" placeholder="Session description">${escHtml(s.description)}</textarea>
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">YouTube URL</label>
          <input type="text" class="form-control admin-input" name="sessions[${i}][youtubeUrl]" value="${escHtml(s.youtubeUrl)}" placeholder="https://youtu.be/...">
        </div>
        <div class="col-12 text-end">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem('sessions-container', ${i})">Remove Session</button>
        </div>
      </div>
    </div>`).join('');
}

function buildGalleryHTML(gallery) {
  if (!gallery || gallery.length === 0) {
    return '<p class="admin-label">No photos added yet.</p>';
  }
  return gallery.map((url, i) => `
    <div class="d-flex align-items-center gap-2 mb-2 gallery-item" data-index="${i}">
      <input type="text" class="form-control admin-input" name="gallery[${i}]" value="${escHtml(url)}" placeholder="https://...">
      <button type="button" class="btn btn-sm btn-outline-danger flex-shrink-0" onclick="removeItem('gallery-container', ${i})">✕</button>
    </div>`).join('');
}

function escHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Remove dynamic item ───────────────────────────────────────────────────────

function removeItem(containerId, index) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = container.querySelectorAll('[data-index]');
  items.forEach(el => {
    if (parseInt(el.getAttribute('data-index'), 10) === index) {
      el.remove();
    }
  });
}

// ── Add new dynamic items ─────────────────────────────────────────────────────

function addStat() {
  const container     = document.getElementById('stats-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const uid           = Date.now();
  const html = `
    <div class="border border-secondary rounded p-3 mb-3 stat-item" data-index="${uid}">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label admin-label">Icon class</label>
          <input type="text" class="form-control admin-input" name="stats[${existingCount}][icon]" value="" placeholder="fas fa-users">
        </div>
        <div class="col-md-3">
          <label class="form-label admin-label">Value</label>
          <input type="text" class="form-control admin-input" name="stats[${existingCount}][value]" value="" placeholder="500+">
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">Label</label>
          <input type="text" class="form-control admin-input" name="stats[${existingCount}][label]" value="" placeholder="Attendees">
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button type="button" class="btn btn-sm btn-outline-danger w-100" onclick="removeItem('stats-container', ${uid})">Remove</button>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSpeaker() {
  const container     = document.getElementById('speakers-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const uid           = Date.now();
  const html = `
    <div class="border border-secondary rounded p-3 mb-3 speaker-item" data-index="${uid}">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label admin-label">Name</label>
          <input type="text" class="form-control admin-input" name="speakers[${existingCount}][name]" value="" placeholder="Speaker Name">
        </div>
        <div class="col-md-3">
          <label class="form-label admin-label">Role / Title</label>
          <input type="text" class="form-control admin-input" name="speakers[${existingCount}][role]" value="" placeholder="QA Engineer">
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">Bio</label>
          <input type="text" class="form-control admin-input" name="speakers[${existingCount}][bio]" value="" placeholder="Short bio">
        </div>
        <div class="col-md-2">
          <label class="form-label admin-label">Photo URL</label>
          <input type="text" class="form-control admin-input" name="speakers[${existingCount}][imageUrl]" value="" placeholder="../img/portrait.jpg">
        </div>
        <div class="col-12 text-end">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem('speakers-container', ${uid})">Remove Speaker</button>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addSession() {
  const container     = document.getElementById('sessions-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const uid           = Date.now();
  const html = `
    <div class="border border-secondary rounded p-3 mb-3 session-item" data-index="${uid}">
      <div class="row g-2">
        <div class="col-md-4">
          <label class="form-label admin-label">Speaker</label>
          <input type="text" class="form-control admin-input" name="sessions[${existingCount}][speaker]" value="" placeholder="Speaker Name">
        </div>
        <div class="col-md-8">
          <label class="form-label admin-label">Session Title</label>
          <input type="text" class="form-control admin-input" name="sessions[${existingCount}][title]" value="" placeholder="Session Title">
        </div>
        <div class="col-md-8">
          <label class="form-label admin-label">Description</label>
          <textarea class="form-control admin-input" name="sessions[${existingCount}][description]" rows="2" placeholder="Session description"></textarea>
        </div>
        <div class="col-md-4">
          <label class="form-label admin-label">YouTube URL</label>
          <input type="text" class="form-control admin-input" name="sessions[${existingCount}][youtubeUrl]" value="" placeholder="https://youtu.be/...">
        </div>
        <div class="col-12 text-end">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem('sessions-container', ${uid})">Remove Session</button>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addGalleryItem() {
  const container = document.getElementById('gallery-container');
  // remove the "no photos" placeholder if present
  const placeholder = container.querySelector('p.admin-label');
  if (placeholder) placeholder.remove();

  const existingCount = container.querySelectorAll('[data-index]').length;
  const html = `
    <div class="d-flex align-items-center gap-2 mb-2 gallery-item" data-index="${Date.now()}">
      <input type="text" class="form-control admin-input" name="gallery[${existingCount}]" value="" placeholder="https://...">
      <button type="button" class="btn btn-sm btn-outline-danger flex-shrink-0" onclick="this.closest('[data-index]').remove()">✕</button>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

// ── Read form data ────────────────────────────────────────────────────────────

function readFormData() {
  const val = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const readItems = (container, fields) => {
    const containerEl = document.getElementById(container);
    if (!containerEl) return [];
    return Array.from(containerEl.querySelectorAll('[data-index]')).map(item => {
      const obj = {};
      fields.forEach(f => {
        const el = item.querySelector(`[name$="[${f}]"]`);
        obj[f] = el ? el.value.trim() : '';
      });
      return obj;
    }).filter(obj => Object.values(obj).some(v => v !== ''));
  };

  const galleryContainer = document.getElementById('gallery-container');
  const gallery = galleryContainer
    ? Array.from(galleryContainer.querySelectorAll('input[type="text"]'))
        .map(el => el.value.trim())
        .filter(v => v !== '')
    : [];

  return {
    eventTitle:       val('eventTitle'),
    eventSubtitle:    val('eventSubtitle'),
    eventDate:        val('eventDate'),
    eventLocation:    val('eventLocation'),
    eventDescription: val('eventDescription'),
    heroImageUrl:     val('heroImageUrl'),
    stats:            readItems('stats-container',    ['icon', 'value', 'label']),
    speakers:         readItems('speakers-container', ['name', 'role', 'bio', 'imageUrl']),
    sessions:         readItems('sessions-container', ['speaker', 'title', 'description', 'youtubeUrl']),
    gallery,
  };
}

// ── Save handler ──────────────────────────────────────────────────────────────

function handleSave(event) {
  event.preventDefault();
  const data = readFormData();

  if (!data.eventTitle) {
    showAlert('Event title is required.', 'danger');
    return;
  }

  const slug       = window._currentEditSlug;
  const contentKey = window._currentEditContentKey;

  saveContent(data, contentKey);

  // Register or update the page in the pages registry
  const registry = loadPagesRegistry();
  const existing = registry.findIndex(p => p.slug === slug);
  const pageEntry = { slug, title: data.eventTitle, contentKey };
  if (existing >= 0) {
    registry[existing] = pageEntry;
  } else {
    registry.push(pageEntry);
  }
  savePagesRegistry(registry);

  // Refresh the pages manager list
  populatePagesManager();

  // Update preview link
  const previewLink = document.getElementById('previewPageLink');
  if (previewLink) previewLink.href = `../pages/QE24.html?event=${encodeURIComponent(slug)}`;

  showAlert('Changes saved successfully! The QE Week page has been updated.', 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Change password handler ───────────────────────────────────────────────────

async function handleChangePassword(event) {
  event.preventDefault();

  const currentPw  = document.getElementById('currentPassword');
  const newPw      = document.getElementById('newPassword');
  const confirmPw  = document.getElementById('confirmPassword');
  const alertCont  = document.getElementById('pwAlertContainer');

  const showPwAlert = (msg, type) => {
    const el = document.createElement('div');
    el.className = `alert alert-${type}`;
    el.setAttribute('role', 'alert');
    el.innerHTML = escHtml(msg) +
      ' <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.style.display=\'none\'"></button>';
    alertCont.innerHTML = '';
    alertCont.appendChild(el);
    if (type === 'success') setTimeout(() => { el.style.display = 'none'; }, 4000);
  };

  if (!currentPw.value || !newPw.value || !confirmPw.value) {
    showPwAlert('Please fill in all password fields.', 'danger');
    return;
  }

  if (newPw.value.length < 8) {
    showPwAlert('New password must be at least 8 characters long.', 'danger');
    return;
  }

  if (newPw.value !== confirmPw.value) {
    showPwAlert('New passwords do not match.', 'danger');
    return;
  }

  const currentHash = await sha256(currentPw.value);
  const storedHash  = localStorage.getItem(ADMIN_HASH_KEY) || DEFAULT_HASH;

  if (currentHash !== storedHash) {
    showPwAlert('Current password is incorrect.', 'danger');
    currentPw.value = '';
    return;
  }

  const newHash = await sha256(newPw.value);
  localStorage.setItem(ADMIN_HASH_KEY, newHash);

  currentPw.value = '';
  newPw.value     = '';
  confirmPw.value = '';

  showPwAlert('Password updated successfully!', 'success');
}

// ── Alert helper ──────────────────────────────────────────────────────────────

function showAlert(message, type) {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type}`;
  alertEl.setAttribute('role', 'alert');
  alertEl.innerHTML = escHtml(message) +
    ' <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.style.display=\'none\'"></button>';
  alertContainer.innerHTML = '';
  alertContainer.appendChild(alertEl);

  if (type === 'success') {
    setTimeout(() => { alertEl.style.display = 'none'; }, 4000);
  }
}

// ── Populate dashboard form ───────────────────────────────────────────────────

function populateDashboard() {
  populatePagesManager();

  const content = loadContent(window._currentEditContentKey);

  const setVal = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
  };

  setVal('eventTitle',       content.eventTitle);
  setVal('eventSubtitle',    content.eventSubtitle);
  setVal('eventDate',        content.eventDate);
  setVal('eventLocation',    content.eventLocation);
  setVal('eventDescription', content.eventDescription);
  setVal('heroImageUrl',     content.heroImageUrl);

  const statsContainer    = document.getElementById('stats-container');
  const speakersContainer = document.getElementById('speakers-container');
  const sessionsContainer = document.getElementById('sessions-container');
  const galleryContainer  = document.getElementById('gallery-container');

  if (statsContainer)    statsContainer.innerHTML    = buildStatsHTML(content.stats);
  if (speakersContainer) speakersContainer.innerHTML = buildSpeakersHTML(content.speakers);
  if (sessionsContainer) sessionsContainer.innerHTML = buildSessionsHTML(content.sessions);
  if (galleryContainer)  galleryContainer.innerHTML  = buildGalleryHTML(content.gallery);

  // Update editing indicator and preview link
  updateEditingIndicator();
}

// ── Pages manager ─────────────────────────────────────────────────────────────

function updateEditingIndicator() {
  const indicator = document.getElementById('currentEditingLabel');
  const previewLink = document.getElementById('previewPageLink');
  const previewBtnLink = document.getElementById('previewPageBtnLink');
  if (indicator) {
    const registry = loadPagesRegistry();
    const page = registry.find(p => p.slug === window._currentEditSlug);
    indicator.textContent = page ? page.title : 'New Page (unsaved)';
  }
  const url = `../pages/QE24.html?event=${encodeURIComponent(window._currentEditSlug || 'qe2022')}`;
  if (previewLink) previewLink.href = url;
  if (previewBtnLink) previewBtnLink.href = url;
}

function buildPagesManagerHTML(pages) {
  if (!pages || pages.length === 0) {
    return '<p class="admin-label">No pages yet.</p>';
  }
  return pages.map(page => {
    const isActive = page.slug === window._currentEditSlug;
    return `
      <div class="d-flex align-items-center justify-content-between p-2 mb-2 rounded ${isActive ? 'pages-manager-active' : 'pages-manager-row'}">
        <div class="d-flex align-items-center gap-2">
          <i class="fas fa-calendar-alt" style="color: var(--admin-green); font-size:0.85rem;"></i>
          <span class="pages-manager-title">${escHtml(page.title)}</span>
          ${isActive ? '<span class="badge pages-manager-badge ms-2">Editing</span>' : ''}
        </div>
        <div class="d-flex gap-2">
          <a href="../pages/QE24.html?event=${encodeURIComponent(page.slug)}" target="_blank"
             class="btn btn-sm admin-btn-outline py-1 px-2" title="View page">
            <i class="fas fa-external-link-alt"></i>
          </a>
          ${!isActive ? `<button type="button" class="btn btn-sm admin-btn-outline py-1 px-2" onclick="editPage('${escHtml(page.slug)}')" title="Edit this page">
            <i class="fas fa-pen"></i> Edit
          </button>` : ''}
          <button type="button" class="btn btn-sm admin-btn-danger py-1 px-2" onclick="confirmDeletePage('${escHtml(page.slug)}')" title="Delete page">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

function populatePagesManager() {
  const container = document.getElementById('pages-manager-list');
  if (!container) return;
  const registry = loadPagesRegistry();
  container.innerHTML = buildPagesManagerHTML(registry);
}

function editPage(slug) {
  const registry = loadPagesRegistry();
  const page = registry.find(p => p.slug === slug);
  if (!page) return;

  window._currentEditSlug       = page.slug;
  window._currentEditContentKey = page.contentKey;

  populateDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showAlert(`Now editing: ${page.title}`, 'success');
}

function createNewPage() {
  const title = prompt('Enter the title for the new Quality Week page (e.g. QE Week 2026):');
  if (!title || !title.trim()) return;

  const trimmedTitle = title.trim();
  const slug = slugify(trimmedTitle);

  // Check for duplicate slugs
  const registry = loadPagesRegistry();
  if (registry.some(p => p.slug === slug)) {
    showAlert(`A page with a similar name already exists. Please use a different title.`, 'danger');
    return;
  }

  const contentKey = CONTENT_KEY + '_' + slug;
  window._currentEditSlug       = slug;
  window._currentEditContentKey = contentKey;

  // Pre-fill form with the given title and empty defaults
  const defaults = getDefaultContent();
  defaults.eventTitle = trimmedTitle;

  const setVal = (id, value) => { const el = document.getElementById(id); if (el) el.value = value || ''; };
  setVal('eventTitle',       defaults.eventTitle);
  setVal('eventSubtitle',    '');
  setVal('eventDate',        '');
  setVal('eventLocation',    '');
  setVal('eventDescription', '');
  setVal('heroImageUrl',     '');

  const statsContainer    = document.getElementById('stats-container');
  const speakersContainer = document.getElementById('speakers-container');
  const sessionsContainer = document.getElementById('sessions-container');
  const galleryContainer  = document.getElementById('gallery-container');
  if (statsContainer)    statsContainer.innerHTML    = buildStatsHTML(defaults.stats);
  if (speakersContainer) speakersContainer.innerHTML = buildSpeakersHTML([]);
  if (sessionsContainer) sessionsContainer.innerHTML = buildSessionsHTML([]);
  if (galleryContainer)  galleryContainer.innerHTML  = buildGalleryHTML([]);

  updateEditingIndicator();
  populatePagesManager();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showAlert(`New page "${trimmedTitle}" ready. Fill in the details and click Save Changes.`, 'success');
}

function confirmDeletePage(slug) {
  const registry = loadPagesRegistry();
  const page = registry.find(p => p.slug === slug);
  if (!page) return;

  if (!confirm(`Are you sure you want to delete "${page.title}"? This cannot be undone.`)) return;

  // Remove content from localStorage
  localStorage.removeItem(page.contentKey);

  // Remove from registry
  const newRegistry = registry.filter(p => p.slug !== slug);
  // Always keep at least one page; if registry becomes empty, add default back
  if (newRegistry.length === 0) {
    newRegistry.push(...getDefaultPagesRegistry());
  }
  savePagesRegistry(newRegistry);

  // If we just deleted the page currently being edited, switch to first page
  if (window._currentEditSlug === slug) {
    const first = newRegistry[0];
    window._currentEditSlug       = first.slug;
    window._currentEditContentKey = first.contentKey;
    populateDashboard();
  } else {
    populatePagesManager();
  }

  showAlert(`Page "${page.title}" has been deleted.`, 'success');
}
