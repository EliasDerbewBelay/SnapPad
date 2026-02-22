# SnapPad 📝

**SnapPad** is a minimalist, full-stack note-taking application designed for speed and style. Built with a high-performance **Next.js** frontend and a robust **Django** backend, it allows users to capture thoughts instantly with custom rich-text styling.

---

## 🚀 Overview

Most note-taking apps are either too complex or too ugly. **SnapPad** hits the "Goldilocks zone"—providing a clutter-free environment that supports essential rich-text features (bold, italic, colors, etc.) without the overhead of heavy project management tools.

### Key Features

* **Zero-Friction Auth:** Secure user registration and login using JWT (JSON Web Tokens).
* **Rich Text Editor:** Custom-styled notes with Bold, Italic, Underline, and Blockquotes.
* **Structured Content:** Support for bulleted (unordered) and numbered (ordered) lists to organize thoughts.
* **Color-Coded Thoughts:** Integrated color picker to change font colors for better organization and visual flair.
* **Auto-Save:** Powered by debounced API calls to ensure your thoughts are never lost.
* **Responsive Design:** A mobile-first approach—write on your phone, review on your desktop.
* **Searchable Archive:** Quickly find old notes via a lightning-fast search bar.

---

## 🛠️ The Tech Stack

### Frontend

* **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Editor Engine:** [Tiptap](https://tiptap.dev/) (Headless Rich Text Editor)
* **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
* **Icons:** [Lucide React](https://lucide.dev/)

### Backend

* **Framework:** [Django](https://www.djangoproject.com/)
* **API:** [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
* **Authentication:** [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
* **Database:** [SQLite](https://sqlite.org/) (Optimized with WAL mode for production-ready performance)

---

## 🏗️ Architecture

SnapPad uses a decoupled architecture:

1. **Client-Side:** The Next.js app handles the UI and local state. It communicates with the backend via asynchronous fetch requests.
2. **Server-Side:** Django manages the business logic, user authentication, and data persistence.
3. **Security:** All API endpoints are protected. Users can only see, edit, or delete notes belonging to their specific account.

---

## 📋 Roadmap

* [ ] Implement Folder/Tagging system.
* [ ] Add "Share Link" functionality for read-only note access.
* [ ] Offline support via Service Workers (PWA).
* [ ] Dark Mode / Light Mode toggle.

---

## ⚙️ Quick Start (Development)

1. **Clone the repo:**
```bash
git clone https://github.com/EliasDerbewBelay/SnapPad.git

```


2. **Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```


3. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev

```
