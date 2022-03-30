import Axios from "axios";

const axiosInstance = Axios.create({ baseURL: "http://localhost:4000" });
export default axiosInstance;
