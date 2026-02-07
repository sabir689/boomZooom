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
import Payment from "../Pages/Dashboard/Payment"
import UpdateParcel from "../Pages/Dashboard/UpdateParcel"
import PaymentHistory from "../Pages/Dashboard/PaymentHistory"
import TrackParcel from "../Pages/Dashboard/TrackParcel"
import BeARider from "../Pages/Dashboard/BeARider"
import PendingRiders from "../Pages/Dashboard/PendingRiders"
import RiderStats from "../Pages/Dashboard/riderStats"
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
            {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>
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
            },
            {
                path: 'payment/:id',
                Component: Payment
            },
            {
                path: 'update-parcel/:id',
                element: <UpdateParcel />
            },
            {
                path: 'payment-history',
                element: <PaymentHistory />
            },
            {
                path: 'track/:id', 
                element: <TrackParcel />
            },
            {
                path: 'riderStats',
                element: <RiderStats></RiderStats>
            },
            {
                path: 'pendingRiders',
                element: <PendingRiders></PendingRiders>
            },
            
        ]
    }
])