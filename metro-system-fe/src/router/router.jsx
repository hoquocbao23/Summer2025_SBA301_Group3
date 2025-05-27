import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";

import TicketSearchOverview from "../components/ticket-search/TicketSearchOverview";
import TicketPage from "../pages/ticket/TicketPage";
import PaymentMethodList from "../components/passenger/PaymentMethodList";
import PassengerPage from "../pages/passenger/passenger-page";

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
    }
])
export default router;