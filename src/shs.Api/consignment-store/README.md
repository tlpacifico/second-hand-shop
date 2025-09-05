# Second Hand Shop - Frontend

This is the frontend application for the Second Hand Shop consignment store management system, built with React, TanStack Router, and Vite.

## Migration from Next.js to TanStack Router

This project has been migrated from Next.js to TanStack Router for the following reasons:

- **Simplified Architecture**: No need for SSR since this is a client-side only application
- **Better Performance**: TanStack Router provides excellent performance for SPA applications
- **Type Safety**: Full TypeScript support with excellent type inference
- **File-based Routing**: Similar to Next.js but with more flexibility
- **Better Developer Experience**: Faster development server and better tooling

## Key Changes Made

### 1. Dependencies
- Removed: `next`, `next-themes`
- Added: `@tanstack/react-router`, `@tanstack/react-router-devtools`, `@tanstack/router-cli`
- Updated: React to v18 for better compatibility

### 2. Project Structure
```
src/
├── routes/           # TanStack Router routes (file-based)
│   ├── __root.tsx    # Root layout
│   ├── index.tsx     # Dashboard page
│   ├── owners.tsx    # Owners page
│   └── items.tsx     # Items page
├── components/       # Reusable components
├── lib/             # Utilities and API client
├── styles/          # Global styles
└── main.tsx         # Application entry point
```

### 3. Configuration Files
- `vite.config.ts` - Vite configuration
- `tanstack-router.config.ts` - TanStack Router configuration
- `tsconfig.json` - Updated for Vite and TanStack Router
- `tailwind.config.ts` - Updated paths for new structure

### 4. Routing Changes
- **Next.js**: `app/page.tsx` → **TanStack Router**: `src/routes/index.tsx`
- **Next.js**: `app/owners/page.tsx` → **TanStack Router**: `src/routes/owners.tsx`
- **Next.js**: `Link href="/path"` → **TanStack Router**: `Link to="/path"`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate-routes` - Generate route tree (auto-run on file changes)
- `npm run generate-api-client` - Generate API client from OpenAPI spec

## Features

- **Dashboard**: Overview of store statistics and recent activity
- **Owners Management**: View and manage consignment item owners
- **Items Management**: Manage consignment items
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Theme switching support
- **Type Safety**: Full TypeScript support

## API Integration

The application integrates with the .NET backend API using a generated API client from OpenAPI specification.

## Contributing

1. Create a new route file in `src/routes/`
2. Run `npm run generate-routes` to update the route tree
3. Test your changes with `npm run dev`

## Migration Notes

### Converting Next.js Pages to TanStack Router Routes

1. **File Structure**: Move from `app/page.tsx` to `src/routes/page.tsx`
2. **Route Definition**: Use `createFileRoute('/path')` instead of file-based routing
3. **Navigation**: Replace `Link href` with `Link to`
4. **Hooks**: Replace Next.js hooks with TanStack Router equivalents:
   - `usePathname()` → `useRouter().state.location.pathname`
   - `useRouter()` → `useRouter()` (TanStack Router version)

### Benefits of the Migration

- **Faster Development**: Vite provides instant hot module replacement
- **Smaller Bundle**: No Next.js runtime overhead
- **Better Performance**: Optimized for client-side rendering
- **Simplified Deployment**: Can be deployed to any static hosting service
- **Type Safety**: Better TypeScript integration with route types
