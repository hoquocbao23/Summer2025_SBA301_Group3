import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import TicketSearchOverview from "../components/ticket-search/ticketSearchOverview";
import Station from "../components/station/Station";
import StationDetail from "../components/station/StationDetail";
import PassengerPage from "../pages/passenger/passenger-page";
>>>>>>> 33fac717353f5878a683b1b6b61e6577c2c50dca
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
            }
        ]
    }
])
export default router;