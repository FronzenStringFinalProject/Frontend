import client from "../../baseRequest.ts";

const uri = "/api/v0/parent/login"


export async function parentLogin(parentId:string,password:string){
    let resp = await client.post<string>(uri,{
        unique_id:parentId,
        pwd:password
    },{
        method:"POST",
    })

    return resp.data
}