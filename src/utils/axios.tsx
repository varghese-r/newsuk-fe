import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4242",
});

export default instance;
