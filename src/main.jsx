import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router"
import { router } from './Router/router.jsx'
import 'aos/dist/aos.css'
import Aos from 'aos'
import AuthProvider from './AuthContext/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // Import this

// Initialize AOS outside the render to prevent re-initialization
Aos.init({
    duration: 800,
    once: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Container moved here or kept depending on your design preference */}
        <div className='font-urbanist max-w-7xl mx-auto bg-[#eef2f3] min-h-screen'>
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
      {/* This only shows up in development mode, not production */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)