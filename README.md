# FlexTrack - Gym Management System

FlexTrack is a modern, responsive web application designed to help gym owners efficiently manage their gym operations. This system streamlines customer management, payment tracking, and business insights in one intuitive interface.

![FlexTrack Dashboard](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)

## Features

- **Customer Management**: Add, view, update, and delete customer records
- **Payment Tracking**: Record and monitor membership fees and payment history
- **Dashboard**: Get quick insights into gym performance and member status
- **Responsive Design**: Works seamlessly on desktops, tablets, and smartphones
- **Secure Authentication**: Protects sensitive customer data

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PowerX-NOT/gym.io.git
   cd gym.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setting Up Supabase [guide](https://github.com/PowerX-NOT/gym.io/blob/main/supabase/README.md)

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to GitHub Pages

1. Create a new repository on GitHub

2. Update the `base` property in `vite.config.ts` with your repository name:
   ```ts
   base: '/your-repository-name/'
   ```

3. Create and switch to the main branch if not already on it:
   ```bash
   git checkout -b main
   ```

4. Initialize Git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/your-repository-name.git
   git push -u origin main
   ```
   
6. Configure GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages"
   - Under "Build and deployment":
     - Source: "GitHub Action"

7. GitHub uses `.github/workflows/deploy.yml` file for automatic deployment:

Your site will be available at: `https://username.github.io/your-repository-name`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)

