import Main from "./pages/Home-Page";
// import Profile from "./pages/Profile-Page";
import VueRouter from "vue-router";

// import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/Profile",
    name: "ProfilePage",
    component: () => import("./pages/Profile-Page"),
  },
  {
    path: "/Login",
    name: "login",
    component: () => import("./pages/Login-Page"),
  },
  {
    path: "/Register",
    name: "register",
    component: () => import("./pages/Register-Page"),
  },
  {
    path: "/Experiments",
    name: "Experiments",
    component: () => import("./pages/Experiments-Page"),
  },
  {
    path: "/RequestExperiment",
    name: "requestPage",
    component: () => import("./pages/requestExperiment-page"),
  },
  {
    path: "/About",
    name: "AboutPage",
    component: () => import("./pages/About-Page"),
  },
  {
    path: "/Contact",
    name: "ContactPage",
    component: () => import("./pages/Contact-Page"),
  },
  
  // {
  //     path: "*",
  //     name: "notFound",
  //     component: NotFound,
  // },
];


export default routes;
