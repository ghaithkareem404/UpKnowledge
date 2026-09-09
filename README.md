# UpKnowledge — Professional HR & IT Solutions

![UpKnowledge](https://img.shields.io/badge/UpKnowledge-HR%20%26%20IT%20Solutions-092442)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)

The official website for **UpKnowledge** — a professional services company specializing in
Human Resources management and Information Technology solutions in Iraq and the Kurdistan
region, and the authorized ODOO partner in Iraq.

- **Live site:** https://www.upknowledgeco.com
- **Headquarters:** Baghdad, Iraq
- **Email:** info@upknowledgeco.com
- **Phone:** +964 773 877 7449 · +964 773 877 7446

---

## Services

### HR Solutions
- HR department management (outsourcing)
- Recruitment & talent acquisition
- Payroll management & benefits administration
- Internal policy development
- Employee training & development
- Work permit & immigration services

### IT Solutions
- IT department management (outsourcing)
- Infrastructure development & optimization
- IT training & certification programs
- System selection & implementation
- Technical support & maintenance
- Network management & security

### ODOO Solutions
- Authorized ODOO partner in Iraq
- ERP implementation
- Custom development & integration
- Training & support
- System customization

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Hand-written semantic HTML5 |
| Styling | Plain CSS3 with custom properties (no framework) |
| Scripting | Vanilla JavaScript (ES5-compatible, no build step) |
| Backend | [Supabase](https://supabase.com) — Postgres, Auth, Storage, Edge Functions |
| Icons | Font Awesome 6.5 (CDN) |
| Fonts | Cairo, Tajawal, Inter (Google Fonts) |

There is **no build step and no package manager** — the files are served as-is.

### Brand colors
| Token | Value |
|---|---|
| Primary (navy) | `#092442` |
| Accent (sand) | `#f8dcbf` |
| Background | `#ffffff` |

---

## Project Structure

```
UpKnowledge/
├── index.html          # Homepage (services, about, Odoo, contact)
├── careers.html        # Public job listings + application flow
├── admin.html          # Protected dashboard for managing job postings
├── css/
│   ├── style.css       # Shared design system, header, footer, homepage
│   ├── careers.css     # Careers page, job cards, modals, apply form
│   └── admin.css       # Admin dashboard and login
├── js/
│   ├── i18n.js         # Arabic/English dictionary + language switcher
│   ├── jobs.js         # Job data layer, rendering, details & apply modals
│   ├── admin.js        # Admin CRUD against Supabase + auth
│   ├── recovery.js     # Password-reset flow for admin accounts
│   └── script.js       # Shared UI behavior (nav, scroll, counters)
├── images/
├── robots.txt
└── sitemap.xml
```

---

## Features

### Bilingual (Arabic / English)
The site is Arabic-first with full RTL layout and a one-click switch to English.
`js/i18n.js` holds both dictionaries and drives translation through `data-i18n`
and `data-i18n-html` attributes; the choice persists in `localStorage`.
Job postings are translated per-record via an `en` JSON column.

### Careers page
- Job listings loaded live from Supabase (published postings only)
- Job details modal with description, location, type, department, skills and experience
- **Application form** with name, phone, email and CV upload
  (PDF / Word / image, 10 MB limit, validated client-side)
- CVs upload to Supabase Storage; applications are recorded in the `applications` table
- Notification emails via the `send-application-emails` Edge Function
- Shareable per-job links (`careers.html?job=<slug>`) that open that job's details directly

### Admin dashboard (`admin.html`)
Email/password login through Supabase Auth, then create, edit, publish/hide and delete
job postings in both languages. Includes a secure password-recovery flow.

---

## Running Locally

```bash
git clone https://github.com/ghaithkareem404/UpKnowledge.git
cd UpKnowledge
python3 -m http.server 8000
```

Then open http://localhost:8000.

Open the site through a local server rather than `file://` — the Supabase client and
`fetch` calls will not work from the filesystem.

---

## Configuration

The Supabase project is configured inline in `careers.html` and `admin.html`:

```js
window.UPK_SUPABASE = {
  url: "https://<project-ref>.supabase.co",
  key: "<publishable-key>",
  bucket: "Private"
};
```

Only the **publishable (anon) key** belongs here — it is safe to expose, provided
Row Level Security is enabled on every table. Never place a service-role key in
client-side code.

### Expected backend schema

**`jobs`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `title`, `company`, `department`, `location` | text | Arabic values |
| `type` | text | e.g. `دوام كامل` |
| `description` | text | |
| `skills`, `experience`, `tags` | text[] | |
| `icon` | text | Font Awesome class, e.g. `fa-briefcase` |
| `badge` | text | e.g. `جديد` |
| `job_date` | date | |
| `published` | bool | only `true` rows are shown publicly |
| `en` | jsonb | English translations of the fields above |
| `created_at` | timestamptz | listings are ordered by this, newest first |

**`applications`**

| Column | Type |
|---|---|
| `id` | uuid |
| `full_name`, `phone`, `email` | text |
| `job_id`, `job_title` | text |
| `cv_path`, `cv_url` | text |

**Storage:** a bucket (default `Private`) holding uploaded CVs under `cvs/`.

**Required RLS policies:** public `select` on published `jobs`; anonymous `insert`
on `applications` and on the storage bucket; authenticated-only write access to `jobs`.

---

## Responsive Design

Optimized for mobile (320px+), tablets (768px+), and desktop (1024px+).

---

## Contact

**UpKnowledge** — Baghdad, Iraq
📧 info@upknowledgeco.com · 📱 +964 773 877 7449 / +964 773 877 7446

---

## License

MIT — see the LICENSE file for details.

**© 2024 UpKnowledge. All rights reserved.**
