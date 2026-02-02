import { createBrowserRouter } from "react-router"
import rootLayout from "../Layouts/rootLayout"
import homepage from "../Pages/homePage/homepage"
import AuthLayout from "../Layouts/AuthLayout"
import LogIn from "../Pages/Auth/LogIn"
import Register from "../Pages/Auth/Register"
import Coverage from "../Pages/Coverage/Coverage"
export const router = createBrowserRouter([
    {
        path: "/",
        Component: rootLayout,
        children: [
            {
                index: true,
                Component: homepage
            },
            {
                path:'coverage',
                Component:Coverage
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {

                path: 'logIn',
                Component: LogIn
            },
             {

                path: 'register',
                Component: Register
            }


        ]
    }
])