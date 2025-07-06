# 100acres.com CRM Frontend

A modern CRM dashboard built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- **Role-based Sidebar Navigation**: Sidebar menu adapts to user role (Super Admin, Head Admin, Team Leader, Employee) and highlights the active page with a clear, high-contrast style.
- **Dynamic Greeting**: The dashboard header greets the logged-in user by name and role (e.g., "Hello Rajesh (Super Admin)").
- **User Management**: Manage users with real backend data, including search, filter, and status toggling.
- **Leads & Tickets**: Hierarchical lead assignment and ticket management workflows.
- **Responsive UI**: Clean, modern, and mobile-friendly design.
- **Accessibility**: Improved sidebar link visibility and keyboard navigation.

## Getting Started

### Prerequisites
- Node.js & npm (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation
```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure
- `src/components/Sidebar.jsx`: Sidebar navigation, role-based links, and user info.
- `src/components/DashboardLayout.jsx`: Main layout, header greeting, and sidebar integration.
- `src/pages/`: Main app pages (Dashboard, Leads, Users, etc).

## Technologies Used
- React + Vite
- TypeScript
- shadcn-ui
- Tailwind CSS
- lucide-react (icons)

## Recent UI/UX Improvements
- Sidebar active link is now highly visible with a light background, bold left border, and dark text.
- Greeting in the header is personalized with the user's name and role.
- Sidebar navigation is fully role-based and responsive.

## Deployment
You can deploy using your preferred method or via [Lovable](https://lovable.dev/projects/32bbaf20-d098-4de6-aa40-52f5bedd91ed) (see original instructions below).

---

# Original Lovable Instructions

(You may still use Lovable for cloud editing and deployment. See below for details.)

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/32bbaf20-d098-4de6-aa40-52f5bedd91ed) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
