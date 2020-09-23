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
import {InputGroupPlugin, TablePlugin } from "bootstrap-vue";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  ProgressPlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
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
  username: undefined,
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
  },
  logout() {
    localStorage.removeItem("username");
    this.username = undefined;
    // axios.get("http://localhost:3000/users/logout");
  }
};


new Vue({
  router,
  data() {
    return {
      store: shared_data,
      API_BASE: "http://localhost:8081"
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
