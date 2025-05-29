import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
<<<<<<< HEAD
import BookingSummary from "../components/ticket-summary/BookingSummary";
import TicketSearchOverview from "../components/ticket-search/ticketSearchOverview";
import Station from "../components/station/Station";
import StationDetail from "../components/station/StationDetail";
import PassengerPage from "../pages/passenger/passenger-page";
import Login from "../pages/login/Login";
import SignUp from "../pages/login/signin";
=======

import TicketSearchOverview from "../components/ticket-search/TicketSearchOverview";

import TicketPage from "../pages/ticket/TicketPage";

import PassengerPage from "../pages/passenger/passenger-page";
import DashboardLayout from "../pages/dashboard/dashboard-layout";
import CustomerDashboard from "../pages/dashboard/customer/customer-dashboard";
import PromotionDashboard from "../pages/dashboard/promotion/promotion-dashboard";
>>>>>>> f948c293ed410ccda5fda3a5dbd52c768f838d4e
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
                path: "/stations",
                element: <Station/>
            },
            {
                path:"/station-detail",
                element: <StationDetail/>
            },{
                path: "/passenger",
                element: <PassengerPage/>
            },{
                path:"/login",
                element:<Login/>
            },{
                path:"/signin",
                element:<SignUp/>
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