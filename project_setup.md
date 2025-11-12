# ConnectEMC AI Learning Platform

## Overview
ConnectEMC AI is an intelligent learning platform for mastering Electromagnetic Compatibility (EMC). The application features AI-powered chatbots, comprehensive course materials, and interactive learning tools.

**Technology Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Supabase (PostgreSQL, Authentication)
- AI: OpenAI GPT-3.5 Turbo
- Icons: Lucide React

## Recent Changes (November 12, 2025)
- Initial project setup in Replit environment
- Configured Vite dev server for port 5000 with proper HMR settings
- Added TypeScript environment type definitions for Vite env variables
- Set up workflow for development server
- Configured deployment settings for autoscale deployment

## Project Architecture

### Frontend Structure
```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── ChatHistoryView.tsx
│   │   ├── CourseForm.tsx
│   │   └── FeedbackView.tsx
│   ├── user/           # User-facing components
│   │   ├── ChatBot.tsx
│   │   ├── FeedbackForm.tsx
│   │   ├── SavedContentView.tsx
│   │   └── UserDashboard.tsx
│   ├── Home.tsx
│   └── Login.tsx
├── contexts/
│   └── AuthContext.tsx # Authentication state management
├── lib/
│   ├── openai.ts      # OpenAI API integration
│   └── supabase.ts    # Supabase client & types
├── App.tsx
├── index.css
└── main.tsx
```

### Database (Supabase)
The project uses Supabase for backend services including:
- User authentication
- PostgreSQL database with RLS (Row Level Security)
- Real-time subscriptions

Database migrations are stored in `supabase/migrations/`

### Key Features
1. **Admin Dashboard**: Course management, chat history monitoring, feedback review
2. **User Dashboard**: Browse courses, AI chatbot interaction, save content, submit feedback
3. **AI Assistant**: Context-aware chatbot powered by OpenAI GPT-3.5 Turbo
4. **Authentication**: Email/password authentication with role-based access (admin/user)

## Environment Variables

Required environment variables (set in Replit Secrets):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous/public API key
- `VITE_OPENAI_API_KEY`: OpenAI API key for chatbot functionality

## Admin Account Setup

**Default Admin Credentials:**
- Email: `admin@connectemc.ai`
- Password: `123123`

The system automatically assigns admin role to this email address upon registration. See `ADMIN_SETUP.md` for more details.

## Development

**Start Development Server:**
```bash
npm run dev
```
Server runs on http://localhost:5000

**Build for Production:**
```bash
npm run build
```

**Type Checking:**
```bash
npm run typecheck
```

## Deployment
The project is configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`

## Notes
- The application requires valid Supabase credentials to function
- OpenAI API key is required for chatbot functionality
- Database schema is managed through Supabase migrations
- HMR (Hot Module Replacement) is configured for Replit's proxy environment
