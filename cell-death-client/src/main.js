import Vue from "vue";
import Home from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import routes from "./routes";
import Vuelidate from "vuelidate";

Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.use(Vuelidate);
Vue.use(VueAxios, axios);
const router = new VueRouter({
  routes,
});

// BootStrap Start
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vBlur from "v-blur";

Vue.use(vBlur);
import {InputGroupPlugin, TablePlugin } from "bootstrap-vue";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  FormFilePlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  ProgressPlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormFilePlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  ProgressPlugin,
  InputGroupPlugin,
  TablePlugin
].forEach((x) => Vue.use(x));
// BootStrap End


const shared_data = {
  email: sessionStorage.getItem("email") ? sessionStorage.getItem("email") : undefined,
  login(email) {
    sessionStorage.setItem("email", email);
    this.email = email;
  },
  logout() {
    sessionStorage.removeItem("email");
    this.email = undefined;
    // axios.get("http://localhost:3000/users/logout");
  },
};

router.beforeEach((to, from, next) => {
  let userIsLogged = shared_data.email ? true : false;
  let noAccessForLoggedIn = ["register", "login"];
  if (noAccessForLoggedIn.includes(to.name) && userIsLogged) {
    // Redirect user to homepage
    return next({ path: "/" });
  }
  // Let the user pass
  return next();
});
console.log(process.env)
new Vue({
  router,
  data() {
    return {
      store: shared_data,
      API_BASE: process.env.VUE_APP_API_BASE
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(Home),
}).$mount("#app");
