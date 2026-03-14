# Colombo Quality Camp (CQC)

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://chamalasela.github.io/cqc/)
[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

The official website of **Colombo Quality Camp (CQC)** — a community dedicated to improving **quality engineering awareness** in Sri Lanka since 2017. CQC brings together software testers, QA engineers, developers, and quality enthusiasts through meetups, bootcamps, workshops, and consulting sessions.

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Pages](#-pages)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

Colombo Quality Camp (CQC) is a non-profit, community-driven initiative that has been actively promoting quality engineering practices across Sri Lanka since 2017. Our community hosts:

- Regular **meetups and sessions** for quality enthusiasts
- Annual **Quality Week** events with industry speakers
- **Bootcamps** for beginners starting their QA journey
- **Corporate consultations** for organizations improving their QE practices

This repository contains the source code for the CQC community website, which serves as the central hub for event information, community engagement, and contact details.

---

## ✨ Features

- **Hero Section** — Eye-catching landing section with animated statistics (500+ attendees, 20+ speakers, 10+ sessions) that count up as you scroll.
- **About Section** — Overview of CQC's history, mission, and impact since its founding in 2017.
- **What We Do** — Three service cards covering Meetups & Sessions, Consultations, and Bootcamps.
- **Community CTA** — Encourages visitors to join the QA community with links to programs and contact.
- **FAQ Section** — Six expandable FAQ items covering common questions about CQC, with a **live search/filter** feature.
- **Past Events Page** — Dedicated page for past events (e.g., Quality Engineering 2024), including speaker cards and session schedules.
- **Contact Form** — Functional contact form integrated with [FormSubmit.co](https://formsubmit.co) for email delivery.
- **Responsive Design** — Fully mobile-friendly layout using Bootstrap 5 grid system.
- **Dark Theme & Modern UI** — Gradient backgrounds, glass-morphism cards, and smooth scroll animations throughout.
- **Cursor Tracking Animation** — Interactive cursor-following circle effect on the homepage.
- **Scroll Reveal Animations** — Elements fade and slide into view as you scroll down the page.

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Main landing page with hero, about, services, FAQ |
| Contact | `contact.html` | Contact form for enquiries |
| Quality Engineering 2024 | `pages/QE24.html` | Past event page with speakers and schedule |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Markup | HTML5 |
| Styling | CSS3, Bootstrap 5.3, Bootstrap Icons |
| Icons | Font Awesome 6.0 |
| Fonts | Google Fonts – Roboto |
| Scripting | Vanilla JavaScript (ES6+) |
| Build Tool | PostCSS + PurgeCSS (CSS optimization) |
| Form Backend | [FormSubmit.co](https://formsubmit.co) |
| Package Manager | Node.js / NPM |

> No frontend framework (React, Vue, Angular) is used — the site is built with pure HTML, CSS, and JavaScript for maximum simplicity and performance.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- [Node.js](https://nodejs.org/) (only required if you want to run the CSS optimization build step)

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chamalasela/cqc.git
   cd cqc
   ```

2. **Open in browser:**
   Simply open `index.html` in your browser — no build step is required:
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

   Or use a local development server (e.g., VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension).

### Optional: CSS Optimization

If you want to strip unused CSS for a smaller production bundle:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run PurgeCSS** (configure `postcss.config.js` as needed):
   ```bash
   npx postcss style.css -o style.min.css
   ```

---

## 📁 Project Structure

```
cqc/
├── index.html          # Main homepage
├── contact.html        # Contact page
├── style.css           # Global stylesheet
├── logo.png            # CQC logo (PNG)
├── cqcpnglogo.svg      # CQC logo (SVG)
├── package.json        # NPM configuration (PostCSS/PurgeCSS)
├── pages/
│   └── QE24.html       # Quality Engineering 2024 event page
└── img/                # Images and graphics
    ├── coverPage.jpg
    ├── crowdImage.jpeg
    ├── headerimage.svg
    ├── portrait.jpg
    └── ...
```

---

## 🤝 Contributing

We welcome contributions from everyone! Whether you're fixing a typo, improving the design, adding a new feature, or reporting a bug — all contributions are appreciated.

### How to Contribute

1. **Fork** the repository by clicking the "Fork" button at the top of this page.

2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/cqc.git
   cd cqc
   ```

3. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** — follow the existing code style (indentation, naming conventions, etc.).

5. **Test your changes** by opening the relevant HTML files in a browser and verifying everything looks and works correctly across screen sizes.

6. **Commit** your changes with a clear message:
   ```bash
   git add .
   git commit -m "feat: add description of your change"
   ```

7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** against the `main` branch of this repository. Describe what you changed and why.

### Contribution Guidelines

- Keep changes focused — one feature or fix per pull request.
- Use descriptive commit messages (e.g., `fix: correct broken link in FAQ`, `feat: add new speaker card`).
- Ensure the site remains **responsive** and looks good on mobile, tablet, and desktop.
- Do not commit build artifacts (e.g., `node_modules/`) or sensitive information.
- For larger changes, please open an **issue** first to discuss the proposed change before submitting a PR.

### Reporting Issues

Found a bug or have a suggestion? Please [open an issue](https://github.com/Chamalasela/cqc/issues) and provide:
- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Screenshots if applicable

---

## 📜 License

This project is open source. Please check the repository for license details or contact the maintainers.

---

## 📬 Contact

Have questions about the CQC community or this website?

- 🌐 **Website**: [Visit the site](https://chamalasela.github.io/cqc/)
- 📧 **Email**: Use the [Contact Form](https://chamalasela.github.io/cqc/contact.html) on the website
- 🐛 **Issues**: [GitHub Issues](https://github.com/Chamalasela/cqc/issues)

---

*Built with ❤️ by the CQC community.*
