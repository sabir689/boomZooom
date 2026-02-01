import { createBrowserRouter } from "react-router"
import rootLayout from "../Layouts/rootLayout"
import homepage from "../Pages/homePage/homepage"
import AuthLayout from "../Layouts/AuthLayout"
import LogIn from "../Pages/Auth/LogIn"
export const router = createBrowserRouter([
    {
        path: "/",
        Component: rootLayout,
        children: [
            {
                index: true,
                Component: homepage
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [{

            path:'login',
            Component:LogIn
        }


        ]
    }
])