import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import { ThemeProvider } from '../components/theme-provider'
import '../styles/globals.css'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  ),
})
