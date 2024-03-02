import client, {ServiceResponse} from "../baseRequest.ts";

export interface Quiz{
    id:number,
    quiz:string
}

export async function getNextQuiz(token:string):Promise<ServiceResponse<Quiz>>{
    const url = "/api/v0/child/quiz"
    const resp = await client.get<ServiceResponse<Quiz>>(url, {
        headers: {
            "Authorization": token,
            "content-type": "application/json"
        }}
    )
    return resp.data
}