import axios from "axios";

const  client = axios.create({
    baseURL:"http://127.0.0.1:4523/m1/4020587-0-default",
    timeout:50000
})

export default client
export interface ServiceResponse<T> {
    data: T;
}

