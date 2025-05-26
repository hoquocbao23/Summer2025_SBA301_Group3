import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import BookingSummary from "../components/ticket-summary/BookingSummary";
import TicketSearchOverview from "../components/ticket-search/ticketSearchOverview";
import Station from "../components/station/Station";
import StationDetail from "../components/station/StationDetail";

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
                element: <TicketSearchOverview/>
            },
            {
                path: "/stations",
                element: <Station/>
            },
            {
                path:"/station-detail",
                element: <StationDetail/>
            }
        ]
    }
])
export default router;