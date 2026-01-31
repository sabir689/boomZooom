import { createBrowserRouter } from "react-router"
import rootLayout from "../Layouts/rootLayout"
import homepage from "../Pages/homePage/homepage"
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
])