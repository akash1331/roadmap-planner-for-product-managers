# Product Roadmap Planning Tool

A professional, full-stack roadmap planning application designed for product managers to create, visualize, and manage quarterly product roadmaps with an intuitive drag-and-drop interface.

## Features

### Core Functionality
- **Quarterly Timeline View**: Visual roadmap organized by quarters (Q1-Q4) with clear date ranges
- **Team-based Organization**: Initiatives organized by teams (Engineering, Design, Product, Marketing, Sales)
- **Priority Management**: Color-coded priority system (High, Medium, Low) for easy identification
- **Drag-and-Drop Interface**: Intuitive card manipulation for reorganizing initiatives
- **Initiative Management**: Create, edit, and manage product initiatives with detailed information
- **Advanced Filtering**: Real-time filtering by team, priority, and search terms
- **Professional UI**: Clean, modern interface built with Shadcn/UI components

### User Interface
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark Mode Support**: Built-in theme switching capability
- **Interactive Cards**: Hover effects and smooth animations for better user experience
- **Quick Stats**: Overview dashboard showing total initiatives and status tracking
- **Search Functionality**: Fast search across initiative titles and descriptions

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Shadcn/UI** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling and theming
- **TanStack Query (React Query)** for server state management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form handling
- **Lucide React** for consistent iconography

### Backend
- **Express.js** with TypeScript for the API server
- **Drizzle ORM** for type-safe database operations (ready for PostgreSQL)
- **Zod** for runtime validation and schema definitions
- **In-memory storage** with interface for easy database integration

### Development Tools
- **TypeScript** for type safety across the entire stack
- **ESBuild** for fast bundling
- **Hot Module Replacement** for instant development feedback
- **Replit-specific plugins** for seamless cloud development

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-roadmap-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

### Environment Setup

The application runs with an in-memory database by default. For production use with PostgreSQL:

1. Set up a PostgreSQL database
2. Configure the `DATABASE_URL` environment variable
3. The application is ready for database integration with Drizzle ORM

## Usage Guide

### Creating New Initiatives

1. Click the **"New Initiative"** button in the top-right corner
2. Fill in the initiative details:
   - **Title**: Brief, descriptive name for the initiative
   - **Description**: Detailed explanation of the initiative's goals
   - **Team**: Select the responsible team
   - **Priority**: Choose High, Medium, or Low priority
   - **Start/End Dates**: Define the timeline (quarter is auto-determined)
   - **Assignees**: Add team member initials

3. Click **"Create Initiative"** to add it to the roadmap

### Filtering and Search

- **Team Filters**: Use checkboxes in the sidebar to show/hide specific teams
- **Priority Filters**: Filter initiatives by priority level
- **Search**: Use the search bar to find initiatives by title or description
- **Quick Stats**: View overview metrics in the sidebar

### Visual Organization

- **Timeline Grid**: Initiatives are automatically organized by quarter
- **Team Sections**: Each team has its own row with color-coded indicators
- **Priority Colors**: 
  - Red: High priority
  - Yellow: Medium priority
  - Blue: Low priority
- **Team Colors**:
  - Blue: Engineering
  - Green: Design
  - Purple: Marketing
  - Orange: Product
  - Red: Sales

## Project Structure

```
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── roadmap/       # Roadmap-specific components
│   │   │   └── ui/            # Shadcn/UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and configurations
│   │   ├── pages/             # Route components
│   │   └── index.css          # Global styles and theme variables
│   └── index.html             # HTML entry point
├── server/                    # Backend application
│   ├── index.ts               # Express server setup
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Data storage interface and implementation
│   └── vite.ts                # Vite integration for full-stack development
├── shared/                    # Shared code between frontend and backend
│   └── schema.ts              # Database schema and validation types
└── package.json               # Project dependencies and scripts
```

## API Documentation

### Endpoints

#### GET `/api/initiatives`
Retrieve all initiatives with automatic sorting by quarter, team, and position.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "team": "engineering | design | product | marketing | sales",
    "priority": "high | medium | low",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "quarter": "Q1 | Q2 | Q3 | Q4",
    "assignees": ["string"],
    "position": "number",
    "createdAt": "ISO date string"
  }
]
```

#### POST `/api/initiatives`
Create a new initiative.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "team": "engineering | design | product | marketing | sales",
  "priority": "high | medium | low",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "assignees": ["string"],
  "position": "number"
}
```

#### PATCH `/api/initiatives/:id`
Update an existing initiative.

**Request Body:** Partial initiative object with fields to update.

#### DELETE `/api/initiatives/:id`
Delete an initiative.

**Response:** 204 No Content on success.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

### Architecture Decisions

1. **In-Memory Storage**: Used for rapid prototyping and development. The storage interface makes database integration straightforward.

2. **Shared Schema**: TypeScript types and Zod schemas are shared between frontend and backend to ensure consistency.

3. **Component Architecture**: Modular component design with clear separation of concerns.

4. **State Management**: TanStack Query handles server state, while local component state manages UI interactions.

### Customization

#### Adding New Teams
1. Update the team enum in `shared/schema.ts`
2. Add team colors in `client/src/index.css`
3. Update team options in components as needed

#### Adding New Priority Levels
1. Update the priority enum in `shared/schema.ts`
2. Add priority colors in `client/src/index.css`
3. Update priority options in components

#### Database Integration
1. Configure PostgreSQL connection string
2. Update storage implementation in `server/storage.ts`
3. Run database migrations with Drizzle Kit

## Data Model

### Initiative Schema
```typescript
{
  id: string;              // Auto-generated UUID
  title: string;           // Initiative name
  description: string;     // Detailed description
  team: string;           // Responsible team
  priority: string;       // Priority level
  startDate: string;      // Start date (YYYY-MM-DD)
  endDate: string;        // End date (YYYY-MM-DD)
  quarter: string;        // Auto-calculated quarter
  assignees: string[];    // Team member initials
  position: number;       // Position within team/quarter
  createdAt: Date;        // Creation timestamp
}
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Maintain type safety across the stack
- Write descriptive commit messages
- Test changes thoroughly before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests, please open an issue in the repository or contact the development team.

---

Built with ❤️ for product teams who need powerful, intuitive roadmap planning tools.
