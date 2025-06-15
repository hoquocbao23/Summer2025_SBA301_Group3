import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/home";
import TicketSearchOverview from "../components/ticket-search/TicketSearchOverview";
import Station from "../components/station/Station";
import StationDetail from "../components/station/StationDetail";
import PassengerPage from "../pages/passenger/passenger-page";
import Login from "../pages/login/Login";
import SignUp from "../pages/login/signin";
import TicketPage from "../pages/ticket/TicketPage";
import DashboardLayout from "../pages/dashboard/dashboard-layout";
import CustomerDashboard from "../pages/dashboard/customer/customer-dashboard";
import PromotionDashboard from "../pages/dashboard/promotion/promotion-dashboard";
import AdminStationManager from "../pages/dashboard/station/station-dashboard";
import AdminRouteManager from "../pages/dashboard/route/route-dashboard";
import MetroServiceStatus from "../components/route/RouteOverview";
import TicketTypeDashboard from "../pages/dashboard/ticket-type/ticket-type-dashboard";
import PaymentSuccess from "../components/payment/PaymentSuccess";
import PaymentFailed from "../components/payment/PaymentFailed";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/tickets",
        element: <TicketPage />,
        // children: [
        //   {
        //     index: true,
        //     element: <TicketSearchOverview />,
        //   },
        //   // {
        //   //   path: "passenger",
        //   //   element: <PassengerPage />,
        //   // },
        // ],
      },
      {
        path: "/stations",
        element: <Station />,
      },
      {
        path: "/stations/:id",
        element: <StationDetail />,
      },
      
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signin",
        element: <SignUp />,
      },
      {
        path: "/routes",
        element: <MetroServiceStatus />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment-failed",
        element: <PaymentFailed />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "customers",
        element: <CustomerDashboard />,
      },
      {
        path: "promotions",
        element: <PromotionDashboard />,
      },
      {
        path: "stations",
        element: <AdminStationManager/>
      },
      {
        path: "routes",
        element: <AdminRouteManager/>
      },
      {
        path: "ticket-type",
        element: <TicketTypeDashboard/>
      }
    ],
  },
]);

export default router;
