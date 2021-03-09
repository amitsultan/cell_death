import Main from "./pages/Home-Page";
import VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("./pages/Home-Page"),
  },
  {
    path: "/Home",
    name: "home",
    component: () => import("./pages/Home-Page"),
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
];


export default routes;
