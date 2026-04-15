# 🎓 TnP Connect - Modern Training & Placement Management
TnP Connect is a premium, full-stack career development platform designed to bridge the gap between students, training administrators, and institutional heads. Built with a focus on high-performance UI and robust security, it provides a seamless ecosystem for managing career contests, tracking student progress, and ensuring authorized institutional access.
---
## ✨ Key Features
### 🛡️ 1. Multi-Tier Security & Manual Authorization
Unlike standard login systems, TnP Connect implements a gated security workflow:
- **Principal/Superadmin Access:** A secure gateway for institutional heads to manage the entire ecosystem.
- **Manual Admin Approval:** New Admins must request access. Access is granted **only** after a Superadmin manually authorizes the request from their secure dashboard.
- **Real-Time Authorization Hub:** A dedicated panel for approving or dismissing pending admin requests with instant session updates.
### 📊 2. Comprehensive Contest Management (CRUD)
- **Role-Based Management:** Both Admins and Superadmins have full authority to **Create, Read, Update, and Delete (CRUD)** contests.
- **Dynamic Analytics Dashboard:** Visual tracking of Total, Live, and Upcoming contests.
- **Countdown Badges:** Automatic calculation of days remaining for upcoming events.
### 🎓 3. Student Growth & Activity Hub
- **Personalized Tracking:** Students can filter and view their specific registration history in the **"My Activity"** hub.
- **Performance Reporting:** Integrated modal system to display detailed scorecards (Mock/Actual) and Pass/Fail status for completed events.
- **Smart Registration:** Intuitive button states (`Register Now` → `Already Registered` Alert) prevent duplicate entries while maintaining a clean UI.
### 💎 4. Premium UI/UX Aesthetics
- **Core Design:** Implementing Modern Glassmorphism with floating navbars and frosted glass overlays.
- **Micro-Animations:** Fluid card hover effects, pulse dots for live events, and success-glow transitions.
- **Toast Notification System:** A custom-built notification engine for non-blocking real-time feedback.
- **Sleek Custom Scrollbars:** Themed scrollbars matching the dark-indigo professional aesthetic.
---
## 🛠️ Technology Stack
- **Frontend:** [Angular 19+](https://angular.io/) (Modules, Components, Models, Services)
- **Styling:** Vanilla CSS3 with Flex/Grid, Glassmorphism, and Modern Variables
- **Icons:** Unicode Emojis & Custom CSS Badges
- **State Management:** RxJS Observables & BehaviorSubjects
- **Data Persistence:** Integrated Mock Service (Scaleable to Spring Boot REST APIs)
---
## 🔑 Access Credentials (Mock Demo)
To test the multi-tier flow, use the following credentials:
| Role | Access Method | Username / Email | Password / Key |
| :--- | :--- | :--- | :--- |
| **Student** | Student Sign In | `Pravin Pandey` | N/A |
| **Admin** | Admin Sign In | `Vikas Kumar` | (Requires Superadmin Approval) |
| **Superadmin** | Authority Login | `superadmin@tnp.edu` | **Key:** `-` / **Pass:** `-` |
---
## 🚀 Getting Started
1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Development Server:**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`.
3. **Build for Production:**
   ```bash
   ng build
   ```
---
## 📂 Project Structure
```text
src/app/
├── modules/
│   ├── auth/           # Login, Registration, Secret Services
│   └── contest/        # Dashboard, CRUD Modals, Activity Hub
├── services/           # Global Toast notification engine
└── models/             # Type-safe Contest & User interfaces
```
---
*Made with ❤️ for the TnP Connect Community.*
