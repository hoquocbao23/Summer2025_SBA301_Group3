import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";

import TicketSearchOverview from "../components/ticket-search/TicketSearchOverview";

import TicketPage from "../pages/ticket/TicketPage";

import PassengerPage from "../pages/passenger/passenger-page";
import DashboardLayout from "../pages/dashboard/dashboard-layout";
import CustomerDashboard from "../pages/dashboard/customer/customer-dashboard";
import PromotionDashboard from "../pages/dashboard/promotion/promotion-dashboard";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "/tickets",
                element: <TicketPage/>,
                children: [
                    {
                        index: true,
                        element: <TicketSearchOverview/>
                    }
                ]
            },
            {
                path: "/passenger",
                element: <PassengerPage/>
            }
        ]
    },
    {
        path: "/dashboard",
        element: <DashboardLayout/>,
        children: [
            {
                path: "customers",
                element: <CustomerDashboard/>
            },
            {
                path: "promotions",
                element: <PromotionDashboard/>
            }
        ]
    }
])
export default router;