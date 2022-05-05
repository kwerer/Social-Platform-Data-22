import Axios from "axios";

const axiosInstance = Axios.create({ baseURL: "http://localhost:4001" });
export default axiosInstance;
