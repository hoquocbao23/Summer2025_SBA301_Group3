import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import BookingSummary from "../components/ticket-summary/BookingSummary";
import TicketSearchOverview from "../components/ticket-search/ticketSearchOverview";
import Station from "../components/station/Station";
import StationDetail from "../components/station/StationDetail";
import PassengerPage from "../pages/passenger/passenger-page";
import Login from "../pages/login/Login";
import SignUp from "../pages/login/signin";
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
    }
])
export default router;