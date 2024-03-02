import axios from "axios";

const  client = axios.create({
    baseURL:"http://127.0.0.1:8000",
    timeout:50000
})

export default client
export interface ServiceResponse<T> {
    body: T;
}

