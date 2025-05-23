import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import BookingSummary from "../components/ticket-summary/BookingSummary";
import TicketSearchOverview from "../components/ticket-search/ticketSearchOverview";
import TicketLayout from "../pages/layout/TicketLayout";

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
                element: <TicketLayout/>,
                children: [
                    {
                        index: true,
                        element: <TicketSearchOverview/>
                    },
                ]
            },
        ]
    }
])
export default router;