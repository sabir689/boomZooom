import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router"
import { router } from './Router/router.jsx'
import 'aos/dist/aos.css'
import Aos from 'aos'
import AuthProvider from './AuthContext/AuthProvider.jsx'
Aos.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-urbanist max-w-7xl mx-auto bg-[#eef2f3]'>
     <AuthProvider>
       <RouterProvider router={router} />
     </AuthProvider>
    </div>
  </StrictMode>,
)
