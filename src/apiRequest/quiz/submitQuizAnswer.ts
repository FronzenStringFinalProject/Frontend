import client, {ServiceResponse} from "../baseRequest.ts";

const uri = "/api/v0/child/quiz/submit"

export async function submitQuizAnswer(auth:string,id:number,ans:number):Promise<ServiceResponse<boolean>>{
    const resp =  await client.post<
    ServiceResponse<boolean>>(
        uri,{id,ans},{
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
        }
    )
    return  resp.data
}