import { HomeIcon, WorkflowIcon, Settings } from "lucide-react";
import Index from "./pages/Index.jsx";
import Workflow from "./pages/Workflow.jsx";
import NavManagement from "./pages/NavManagement.jsx";

/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
{
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
},
{
    title: "我的工作流",
    to: "/workflow",
    icon: <WorkflowIcon className="h-4 w-4" />,
    page: <Workflow />,
},
{
    title: "导航管理",
    to: "/nav-management",
    icon: <Settings className="h-4 w-4" />,
    page: <NavManagement />,
},
];
