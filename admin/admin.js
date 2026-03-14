/**
 * CQC Admin Panel - Authentication & Content Management
 * 
 * Default login: cqcAdmin2024!
 * Content is stored in localStorage under "cqc_event_data"
 */

const ADMIN_SESSION_KEY = 'cqc_admin_session';
const ADMIN_HASH_KEY    = 'cqc_admin_hash';
const CONTENT_KEY       = 'cqc_event_data';

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

function loadContent() {
  try {
    const stored = localStorage.getItem(CONTENT_KEY);
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

function saveContent(data) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
}

// ── Dashboard helpers ─────────────────────────────────────────────────────────

function buildStatsHTML(stats) {
  return stats.map((s, i) => `
    <div class="border border-secondary rounded p-3 mb-3 stat-item" data-index="${i}">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label text-muted small">Icon class</label>
          <input type="text" class="form-control admin-input" name="stats[${i}][icon]" value="${escHtml(s.icon)}" placeholder="fas fa-users">
        </div>
        <div class="col-md-3">
          <label class="form-label text-muted small">Value</label>
          <input type="text" class="form-control admin-input" name="stats[${i}][value]" value="${escHtml(s.value)}" placeholder="500+">
        </div>
        <div class="col-md-4">
          <label class="form-label text-muted small">Label</label>
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
          <label class="form-label text-muted small">Name</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][name]" value="${escHtml(sp.name)}" placeholder="Speaker Name">
        </div>
        <div class="col-md-3">
          <label class="form-label text-muted small">Role / Title</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][role]" value="${escHtml(sp.role)}" placeholder="QA Engineer">
        </div>
        <div class="col-md-4">
          <label class="form-label text-muted small">Bio</label>
          <input type="text" class="form-control admin-input" name="speakers[${i}][bio]" value="${escHtml(sp.bio)}" placeholder="Short bio">
        </div>
        <div class="col-md-2">
          <label class="form-label text-muted small">Photo URL</label>
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
          <label class="form-label text-muted small">Speaker</label>
          <input type="text" class="form-control admin-input" name="sessions[${i}][speaker]" value="${escHtml(s.speaker)}" placeholder="Speaker Name">
        </div>
        <div class="col-md-8">
          <label class="form-label text-muted small">Session Title</label>
          <input type="text" class="form-control admin-input" name="sessions[${i}][title]" value="${escHtml(s.title)}" placeholder="Session Title">
        </div>
        <div class="col-md-8">
          <label class="form-label text-muted small">Description</label>
          <textarea class="form-control admin-input" name="sessions[${i}][description]" rows="2" placeholder="Session description">${escHtml(s.description)}</textarea>
        </div>
        <div class="col-md-4">
          <label class="form-label text-muted small">YouTube URL</label>
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
    return '<p class="text-muted small">No photos added yet.</p>';
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
  const container  = document.getElementById('stats-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const newIndex = Date.now(); // unique temp index
  const html = buildStatsHTML([{ icon: '', value: '', label: '' }]).replace(/data-index="0"/g, `data-index="${newIndex}"`).replace(/\[0\]/g, `[${existingCount}]`);
  container.insertAdjacentHTML('beforeend', html);
}

function addSpeaker() {
  const container = document.getElementById('speakers-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const html = buildSpeakersHTML([{ name: '', role: '', bio: '', imageUrl: '' }]).replace(/data-index="0"/g, `data-index="${Date.now()}"`).replace(/\[0\]/g, `[${existingCount}]`);
  container.insertAdjacentHTML('beforeend', html);
}

function addSession() {
  const container = document.getElementById('sessions-container');
  const existingCount = container.querySelectorAll('[data-index]').length;
  const html = buildSessionsHTML([{ speaker: '', title: '', description: '', youtubeUrl: '' }]).replace(/data-index="0"/g, `data-index="${Date.now()}"`).replace(/\[0\]/g, `[${existingCount}]`);
  container.insertAdjacentHTML('beforeend', html);
}

function addGalleryItem() {
  const container = document.getElementById('gallery-container');
  // remove the "no photos" placeholder if present
  const placeholder = container.querySelector('p.text-muted');
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

  saveContent(data);
  showAlert('Changes saved successfully! The QE Week page has been updated.', 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const content = loadContent();

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
}
