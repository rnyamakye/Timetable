# B.Sc. Computer Science-4 (Group 2) Timetable Web App

A modern, interactive React web application that recreates the official university schedule and curriculum matrix directly on the homepage, built with HTML tables and styled to mirror the authentic layout.

## 🚀 Features

- **Exact Document Replica**:
  - **Schedule Table**: Built with standard semantic HTML `<table>` elements (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`), accurately mapping 10 periods across Monday to Friday with exact `colSpan` merged slots (e.g. 2-period lecture blocks, 6-period Final Year Project block).
  - **Course Card Styling**: Recreates original room labels (`Room SCBSF20`, `SCBFF24`, `SCBFF5`, etc.), Group tags (`Group 2`), bold course codes, titles, and lecturer names with matching color-coded pastel badges.
  - **Curriculum Matrix**: "YEAR FOUR: SEMESTER ONE" table with aligned Theory ($T$), Practical ($P$), and Credit ($C$) values totaling **15 T, 6 P, 18 C**.
  - **Authentic Footer**: Timestamp "Timetable generated: 14/10/2026" and "aSc Timetables" signature.

- **Interactive Capabilities**:
  - **Smart Course Highlighting**: Click any course in the timetable or curriculum table to highlight all related lecture sessions across the entire week.
  - **Search & Instant Filter**: Search by course code (e.g. `CSM 481`), title, lecturer name (`Parley`, `Twum`), or classroom venue (`SCBSF20`).
  - **Day-by-Day Filter**: Filter specifically for today's classes or any individual day.
  - **Class Details Modal**: Click any session to reveal room location, duration, lecturer, and credit weighting.
  - **One-Click Calendar Sync (`.ics`)**: Export your schedule directly into Google Calendar, Apple Calendar, or Microsoft Outlook.
  - **Pixel-Perfect Printing / PDF Export**: Built-in `@media print` CSS cleanly formats the timetable for physical printing or saving as a crisp PDF.
  - **Responsive Views**: Switch effortlessly between the full grid view, a mobile-friendly day agenda view, and a curriculum summary view.

## 💻 Running the App

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                     # Root application with state & filter controls
    ├── main.jsx                    # Application entrypoint
    ├── index.css                   # Custom styles, pastel palette & print media queries
    ├── components/
    │   ├── Header.jsx              # Navbar with search, print, calendar export, & view toggles
    │   ├── StatsBar.jsx            # Quick stat metrics (18 Credits, 15 T, 6 P, 7 Modules)
    │   ├── TimetableGrid.jsx       # The main timetable <table>
    │   ├── CurriculumTable.jsx     # "YEAR FOUR: SEMESTER ONE" curriculum <table>
    │   ├── CourseModal.jsx         # Detailed course popup drawer
    │   └── MobileAgendaView.jsx    # Responsive card-based view for smaller screens
    ├── data/
    │   └── timetableData.js        # Periods, days, schedule matrix, & course metadata
    └── utils/
        └── icsExport.js            # iCalendar (.ics) exporter for calendar syncing
```

