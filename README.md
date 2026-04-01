# FinDash ✦ Premium Finance Dashboard

![FinDash Preview](https://via.placeholder.com/1200x600/0f172a/14b8a6?text=FinDash+Dashboard+Preview)

A production-grade, highly interactive financial dashboard built to demonstrate senior-level frontend engineering, advanced UX patterns, and modern state management.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` to view the dashboard.

---

## 🎯 Architecture & Approach

This project was architected with a strict emphasis on **User Experience (UX)**, **Performance**, and **Modularity**. Instead of merely displaying tables, the objective was to build a fluid, product-ready experience.

### Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (v4) for strict design system adherence and responsive fluid layouts.
- **State Management:** Zustand (with `persist` middleware for LocalStorage synchronization).
- **Animations:** Framer Motion (Page transitions, layout pop-animations, rolling counters, 3D interactions).
- **Data Visualization:** Recharts (Heavily customized with SVG drop-shadow filters and custom interactive legends).
- **Icons & Polish:** Lucide-React & Sonner (for premium Toast notifications).

---

## ✨ Core Features & Evaluation Checkmarks

### 1. Dashboard Overview
- **3D Parallax Summary Cards:** Fluid, mouse-tracking 3D cards for Total Balance, Income, and Expenses.
- **Dual-Layer Area Chart:** Plots Income vs. Expense concurrently over time featuring custom hardware-accelerated SVG drop-shadow neon lines.
- **Intelligent Donut Chart:** A custom center-cut Recharts Donut paired with a custom HTML-based dynamic progress-bar legend.

### 2. Transactions & Advanced Data Grid
- **Global Search & Filter:** A fully responsive Data grid featuring Debounced search, multi-layered category filtering, and Date/Amount sorting strategies.
- **Smart Toggle:** Users can flawlessly transition between **Table View** and **Grid View** depending on their terminal / mobile usage.
- **Export System:** Client-side generated **1-click CSV Export** functionality.

### 3. Role-Based Access Control (RBAC) UI
- Seamlessly transition between **Viewer** and **Admin** states via the navigation bar.
- *Viewer:* Restricted access (Read-only interface).
- *Admin:* Unlocked access (Floating Action Buttons, Delete/Modify capabilities).

### 4. Interactive Insights
- Fully dynamic calculations providing intelligent readouts (e.g., "Food represents 40% of your expenses").
- **Interactive Filtering:** Clicking an insight card automatically delegates to the global Zustand store to automatically filter the transaction table below.

### 5. Advanced State Management
- Handled entirely by **Zustand**. No prop-drilling.
- Features **Optimistic UI Updates** and highly optimized `useMemo` hooks for data transformation before rendering, avoiding expensive re-renders entirely.

---

## 🏆 Top 1% Edge (Creative Enhancements)

I implemented several advanced features that exceed standard dashboard requirements to demonstrate a focus on genuine product engineering:

1. **Zorvyn Copilot (AI Chatbot):** Custom floating AI Chat widget connected directly to the global state. Ask it "How am I doing?" and it natively reads your local financial data arrays to give dynamic context-aware financial advice.
2. **Keyboard Power-User Shortcuts:** Global event listeners bind `/` to instantly focus the search bar, and `A` to instantly trigger the "Add Transaction" modal.
3. **Undo/Redo Toast Architecture:** Deleting a transaction immediately pulls it from the UI for responsiveness, but the global Toast notification features an active "Undo" parameter that securely reverts the global state if triggered.
4. **Animated Rolling Counters:** All numeric changes in the dashboard physically interpolate and count upwards using physics-based animation rather than instantaneously snapping.
5. **Strict Dark Mode:** Implemented a seamless Dark/Light context toggle, bound with an inline HTML script execution completely avoiding the dreaded "Flash of Unstyled Content" (FOUC).

---

## 🧠 Design Philosophy

The UI aims for "Bento Box" principles. Rather than an infinite vertical scroll of data, cards are restricted to fluid aspect ratios that neatly stack. I heavily utilized **Glassmorphism**, carefully controlling opacity and blur values to simulate depth over a dynamic background mesh without sacrificing core WCAG color contrast guidelines.

Feel free to break it, test edge cases, and explore the UI logic. 
*Designed and engineered with attention to the finest details.*
