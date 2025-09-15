# Tap4Impact

## Overview

Tap4Impact is a modern donation platform supporting the Agri Securitas Trust Fund's mission to create safer rural environments for South African agricultural communities. The platform enables easy tap-to-give donations through QR codes and provides transparent tracking of donation impact across various agricultural safety projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens following agricultural/trust themes
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Simple token-based admin authentication middleware
- **Password Security**: bcrypt for password hashing with 12 salt rounds
- **API Design**: RESTful endpoints with comprehensive error handling and validation

### Database Schema
- **Users**: Admin user accounts with username/password authentication
- **Donations**: Individual donation records with amount, donor info, payment method, and project association
- **Projects**: Agricultural safety initiatives with funding targets, current amounts, locations, and status tracking
- **System Stats**: Aggregated platform metrics including total raised, donor count, and project count

### Design System
- **Color Palette**: Agricultural green primary (142 69% 58%) with professional blue accents (200 89% 47%)
- **Typography**: Inter font family with consistent hierarchy
- **Component Philosophy**: Card-based layouts with elevation effects, consistent spacing using Tailwind units
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Security Architecture
- **Admin Authentication**: Environment-variable based token system for write operations
- **Input Validation**: Zod schemas for all API inputs with UUID validation middleware
- **CORS and Security Headers**: Production-ready security configurations
- **SSL Support**: Conditional SSL for production PostgreSQL connections

## External Dependencies

### Database
- **PostgreSQL**: Primary database with Neon serverless hosting support
- **Drizzle Kit**: Database migration and schema management

### Payment Processing
- **Stripe**: Payment processing infrastructure with React Stripe.js integration
- **Multi-currency Support**: Built-in support for ZAR, USD, EUR, and other international currencies

### Third-Party Services
- **Google Fonts**: Inter font family for consistent typography
- **Facebook Video Embed**: Integrated video content for platform demonstration
- **QR Code Integration**: Support for tap-to-give QR code functionality

### Development Tools
- **Vite**: Fast development server with HMR and optimized builds
- **Replit Integration**: Development environment compatibility with Replit-specific plugins
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production bundling for server-side code