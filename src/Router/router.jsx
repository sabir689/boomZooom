import { createBrowserRouter } from "react-router"
import rootLayout from "../Layouts/rootLayout"
import homepage from "../Pages/homePage/homepage"
import AuthLayout from "../Layouts/AuthLayout"
import LogIn from "../Pages/Auth/LogIn"
import Register from "../Pages/Auth/Register"
import Coverage from "../Pages/Coverage/Coverage"
import SendParcel from "../Pages/SendParcel/SendParcel"
import PrivateRoute from "../routes/PrivateRoute"
import DashboardLayout from "../Layouts/DashboardLayout"
import MyParcels from "../Pages/Dashboard/MyParcels"
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
                path: 'coverage',
                Component: Coverage
            },
            {
                path: 'sendParcel',
                element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
            },
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
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                path: 'myParcels', // This results in /dashboard/myParcels
                element: <MyParcels />
            }
        ]
    }
])