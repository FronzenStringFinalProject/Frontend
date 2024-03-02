import client, {ServiceResponse} from "../../baseRequest.ts";

const uri = "/api/v0/parent/login"


export async function parentLogin(parentId:string,password:string):Promise<ServiceResponse<string>>{
    let resp = await client.post<ServiceResponse<string>>(uri,{
        unique_id:parentId,
        pwd:password
    },{
        method:"POST",
    })

    return resp.data
}