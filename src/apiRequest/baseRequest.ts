import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 50000
})

axiosClient.interceptors.response.use(function (response) {
    response.data = ResponseResult.success(response.data.body);
    return response
}, (error) => {
    console.log(error)
    console.log(error.response.data)
    console.log(error.response.status)
    const response = error.response
    response.data = ResponseResult.failure(response.data["error-message"])
    return response
})

export type AxiosResult<T> = AxiosResponse<ResponseResult<T>>

export class ResponseResult<T> {
    private payload?: T
    private message: string = ""

    static success<T>(payload: T): ResponseResult<T> {
        let result = new ResponseResult<T>()
        result.payload = payload
        return result
    }

    static failure<T>(error: string): ResponseResult<T> {
        let result = new ResponseResult<T>()
        result.message = error
        return result
    }

    isOk() {
        return this.payload != undefined
    }

    expect(): T {
        if (this.isOk()) {
            return this.payload!
        } else {
            throw new Error(`Request Failure: ${this.message}`)
        }
    }

    async getOr(reject: (error: string) => Promise<void>) {
        if (this.isOk()) {
            return this.payload!
        } else {
            await reject(this.message)
        }
    }
}

class RequestClient{
    async get<T>(url:string,config?:AxiosRequestConfig){
        return await axiosClient.get<ResponseResult<T>>(url, config)
    }

    async post<T>(url:string,data?:any,config?:AxiosRequestConfig){
        return await axiosClient.post<ResponseResult<T>>(url,data,config)
    }

    async delete<T>(url:string,config?:AxiosRequestConfig){
        return await axiosClient.delete<ResponseResult<T>>(url,config)
    }
}

const client = new RequestClient()

export default client

