import client, {ServiceResponse} from "../baseRequest.ts";

export async function child_check(auth: string): Promise<void> {
    await client.post<ServiceResponse<null>>("/api/v0/child/check", {}, {
            headers: {
                Authorization: auth
            }
        }
    )
}

export async function child_can_check(auth:string):Promise<boolean>{
    const resp = await client.get<ServiceResponse<boolean>>(
        "/api/v0/child/check/available",
        {headers:{
            Authorization:auth
            }}
    )

    return resp.data.body


}

