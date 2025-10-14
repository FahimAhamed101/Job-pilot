/* eslint-disable no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
 
import NewPassword from "../page/Auth/NewPassword/NewPassword";
import Otp from "../page/Auth/Otp/Otp";
import SignIn from "../page/Auth/SignIn/SignIn";
import DashboardHome from "../page/AdminDashboardHome/DashboardHome";
import PersonalInformationPage from "../page/PersonalInformation/PersonalInformationPage";
 import Register from "../page/Auth/Register/Register";

// import AddItemPage from "../page/AddItem/AddItemPage";
import Notification from "../component/Main/Notification/Notification";


 
import EditPersonalInformationPage from "../page/EditPersonalInformationPage/EditPersonalInformationPage";
 
import AdminRoutes from "./AdminRoutes";
 
import AdminTable from "../page/Admin/AdminTable";
import AnalystTable from "../page/Analyst/Analyst";
import Users from "../component/Main/Users/Users";
import Applied from "../page/Applied/Applied";
import Library from "../page/Laibarry/Laibary";
import Payments from "../page/Payment/Payment";
import ContentTable from "../page/content/Content";
import Job from "../page/Job/Job";
import ForgotPassword from "../page/Auth/ForgetPassword/ForgetPassword";
import Settings from "../component/Main/Settings/Settings";
import RecrutiterTable from "../page/Admin/RecrutiterTable";



const router = createBrowserRouter([
  {
    path: "/",
    element: (
    <AdminRoutes>
         <MainLayout />
    </AdminRoutes>
     
    ),
   
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: '/',
        element: <DashboardHome />,
      },
        {
        path: '/superadmin/dashboard',
        element: <DashboardHome />,
      },
      {
        path:'admin',
        element:<AdminTable/>
      },
       {
        path:'/Recruiters',
        element:<RecrutiterTable/>
      },
      {
        path:'analyst',
        element:<AnalystTable/>
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path:"jobs",
        element:<Job/>
      },
      {
        path:"applied",
        element:<Applied/>
      },
      {
        path:"laibary",
        element:<Library/>
      },
      {
        path:'payments',
        element:<Payments/>
      },
      
      {
        path:"content",
        element:<ContentTable/>
      },
       

      {
        path: "personal-info",
        element: <PersonalInformationPage />,
      },
      {
        path: "edit-personal-info",
        element: <EditPersonalInformationPage />,
      },
      
      
      {
        path: "/notification",
        element: <Notification />,
      },

      {
        path:"/setting",
        element:<Settings/>
      }
      
    ],
  },
  {
    path: "/auth",
    errorElement: <h1>Auth Error</h1>,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
 {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword/>,
      },
      {
        path: "otp/:email",
        element: <Otp />,
      },
      {
        path: "new-password/:email",
        element: <NewPassword />,
      },
    ],
  },
]);

export default router;
