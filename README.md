# 📖 Presença EBD

### 📖 About the Project

**Presença EBD** is a web system for managing attendance and members of the **Sunday School** of the **Igreja Presbiteriana de Teresópolis (Teresópolis Presbyterian Church)**. The project was developed to replace manual attendance control with a digital solution that is practical, secure, and centralized.

The system allows leaders to track members and attendance for each church society (**UCP, UPA, UMP, UPH, SAF**), visualize participation data on a dashboard, and generate branded PDF reports — all protected by authentication and backed by Supabase.

---

### ✨ Key Features

-   **Authentication:** Secure login with email and password powered by **Supabase Auth**, with protected routes and session persistence.
-   **Dashboard:** Cards with the member count of each society (UCP, UPA, UMP, UPH, SAF) plus a bar chart of attendance by date and a pie chart of members per society.
-   **Member Management:** Create, list, search, edit, and delete members with a filterable **DataGrid**.
-   **Attendance Control:** Mark attendance for any society on a chosen Sunday (defaults to the next Sunday), with a history of recorded dates.
-   **PDF Reports:** Generate attendance reports per day (list of present members) or per month (member × Sundays matrix), with the church's branded header.
-   **Password Recovery:** Reset password flow sent through Supabase Auth e-mail.
-   **UI/UX:** Dark/light mode toggle, collapsible sidebar on desktop, drawer menu on mobile, and a fully localized interface in **pt-BR**.

---

### 🚀 Technologies Used

-   **Language:** TypeScript
-   **Framework:** React 19
-   **Build Tool:** Vite 8
-   **Routing:** React Router DOM 7
-   **UI Library:** Material UI (MUI) 9 — including Data Grid
-   **Backend:** Supabase (PostgreSQL + Authentication + Row Level Security)
-   **Charts:** Recharts
-   **PDF Generation:** jsPDF + jsPDF-AutoTable
-   **Forms:** React Hook Form
-   **Sidebar:** React Pro Sidebar

---

### 📸 Screenshots

<!-- Replace the placeholders below with your screenshots (e.g., docs/login.png, docs/dashboard.png) -->

```
<!-- Login screen -->
<!-- Dashboard -->
<!-- Attendance control -->
<!-- PDF report -->
```

---

### 🧱 System Architecture

The project follows a layered structure that separates responsibilities:

1.  **Routes (`src/routes`):** Centralizes all routes with an auth-guarded layout (sidebar + mobile drawer).
2.  **Screens (`src/screens`):** One folder per page (login, dashboard, members, attendance, reports, password recovery).
3.  **Services (`src/services`):** Data-access layer that talks to Supabase (one service per entity).
4.  **Context (`src/context`):** Global state for authentication and the mobile menu.
5.  **Utils (`src/utils`):** PDF generation, localized DataGrid texts, and exception handling.
6.  **Database (`supabase/schema.sql`):** Idempotent schema with tables `users`, `member`, and `presences`, plus RLS policies.

---

### ⚙️ How to Run the Project

#### Requirements

-   **Node.js** 20 or higher
-   A **Supabase** project (free tier is enough)

#### Steps

1.  Clone the repository:

```bash
git clone https://github.com/Santos-02/EBD-IPT.git
cd EBD-IPT
```

2.  Install the dependencies:

```bash
npm install
```

3.  Create a `.env.local` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

4.  Open the **Supabase SQL Editor** and run the script [`supabase/schema.sql`](supabase/schema.sql) to create the tables, views, and RLS policies.

5.  Start the development server:

```bash
npm run dev
```

6.  The application will be available at:

```
http://localhost:5173
```

#### Production Build

```bash
npm run build
```

The project includes a [`vercel.json`](vercel.json) with SPA rewrites, so it can be deployed directly to **Vercel**.

---

### 🧠 Key Concepts Practiced

During the development of this project, the following concepts were explored:

-   Authentication and session management with Supabase Auth
-   Database security with Row Level Security (RLS) policies
-   Data persistence and queries through a service layer pattern
-   Complex table UI with MUI Data Grid (filters, search, pagination)
-   Client-side PDF generation with jsPDF and AutoTable
-   Protected route handling with React Router and context
-   Theming and dark/light mode with Material UI
-   Responsive layouts (sidebar on desktop, drawer on mobile)
-   Form handling and validation with React Hook Form
-   Environment variable management with Vite (`VITE_*`)

---

### 👨‍💻 Author

**João Lucas dos Santos**

---

### 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
