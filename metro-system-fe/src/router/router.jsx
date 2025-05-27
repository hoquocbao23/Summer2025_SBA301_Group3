import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import BookingSummary from "../components/ticket-summary/BookingSummary";
import TicketSearchOverview from "../components/ticket-search/TicketSearchOverview";
import TicketLayout from "../pages/layout/TicketLayout";
import TicketPage from "../pages/ticket/TicketPage";

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
        ]
    }
])
export default router;