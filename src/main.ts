import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueSocketIO from "vue-socket.io-extended";
import { io } from "socket.io-client";
import "./styles.css";

Vue.config.productionTip = false;

const socket = io("http://localhost:5000", { autoConnect: false});
Vue.use(VueSocketIO, socket, { store });

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
