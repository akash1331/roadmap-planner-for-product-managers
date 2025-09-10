# Product Roadmap Application

## Overview

This is a full-stack product roadmap management application built with a React frontend and Express.js backend. The application allows teams to create, organize, and track product initiatives across different quarters and teams. It features a visual timeline interface with drag-and-drop functionality for managing project roadmaps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Data Layer**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful API with endpoints for CRUD operations on initiatives
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot module replacement with Vite integration for full-stack development

### Data Storage
- **Current Implementation**: In-memory storage with seeded sample data
- **Database Ready**: Drizzle ORM configured for PostgreSQL integration
- **Schema**: Initiatives table with fields for title, description, team, priority, dates, assignees, and positioning

### Component Architecture
- **Layout**: Responsive design with sidebar filters and main timeline view
- **Timeline**: Quarter-based grid layout with team sections
- **Cards**: Draggable initiative cards with priority indicators and team color coding
- **Modals**: Form-based initiative creation and editing
- **Filters**: Real-time filtering by team, priority, and search terms

### Authentication & Authorization
- **Current State**: No authentication implemented
- **Session Management**: Basic session configuration present but not actively used
- **Future Ready**: Structure in place for user management and role-based access

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development plugins

### Database Integration
- **drizzle-kit**: Database migration and introspection tool
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)
- **Environment**: DATABASE_URL environment variable required for PostgreSQL connection