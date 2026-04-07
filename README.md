#  Interactive Wall Calendar Component

##  Project Overview

This project is a modern **Interactive Wall Calendar Component** built using **Next.js and React**. It is designed to replicate a **physical wall calendar aesthetic** while providing interactive features like **date range selection** and **notes management**.

The application focuses purely on **frontend engineering**, emphasizing clean UI, responsiveness, and user experience.

---

## Project Structure

```
/components
  ├── ui/                 # Reusable UI components (buttons, cards, etc.)
  ├── wall-calendar/      # Main calendar feature components
  └── theme-provider.tsx  # Theme management (light/dark mode)

/hooks
  ├── use-mobile.ts       # Responsive detection hook
  └── use-toast.ts        # Notification/toast logic

/lib
  └── utils.ts            # Utility/helper functions

/public
  ├── images/             # Static images (calendar hero images)
  ├── icons              # App icons
  └── placeholders        # Placeholder assets

/styles                   # Global styles (Tailwind/CSS)

/config files
  ├── next.config.mjs
  ├── tsconfig.json
  ├── postcss.config.mjs
  ├── package.json
```

---

## Features

### Wall Calendar UI

* Designed to mimic a real wall calendar
* Includes a **hero image section**
* Clean layout with strong visual hierarchy

---

###  Date Range Selection

* Users can select:

  * Start date
  * End date
* Highlights selected range visually
* Smooth interaction for better UX

---

###  Notes Section

* Add notes for:

  * Selected date range
  * Entire month
* Data stored in **localStorage**
* Persistent across reloads

---

###  Responsive Design

* Desktop → Side-by-side layout
* Mobile → Stacked layout
* Optimized for touch interactions

---

###  Theme Support

* Light/Dark mode using `theme-provider`
* Improves user experience and accessibility

---

## Tech Stack

* **Framework:** Next.js
* **Library:** React
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Hooks
* **Storage:** localStorage

---

##  Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/your-username/interactive-calendar.git
cd interactive-calendar
```

### 2. Install Dependencies

```
npm install
```

### 3. Run Development Server

```
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## 📸 Demo

### 🔗 Live Demo

https://tuf-frontend-task-swe-summer-intern-sage.vercel.app/

###  Video Walkthrough



---

##  Key Design Decisions

* **Component-based architecture** for scalability
* **Feature folder (wall-calendar)** for modular design
* **Custom hooks** for reusable logic
* **LocalStorage** used to avoid backend complexity
* **Responsive-first design approach**

---

## Evaluation Criteria Covered

* Clean code structure
* Modular component design
* Responsive UI implementation
* State management using hooks
* Strong UX/UI attention

---

##  Future Improvements

* Backend integration for data sync
* Drag-and-drop event creation
* Notifications/reminders
* Multi-user collaboration

---

##  Author

**Abhienaya Sri**

GitHub: https://github.com/AbhienayaSri9509
LinkedIn: https://www.linkedin.com/in/abhienaya-sri-572020254/

---

