import Axios from "./Axios";
import vue from "vue"

vue.prototype.$http = Axios
