import client from "../baseRequest.ts";

export async function child_check(auth: string) {
    await client.post<null>("/api/v0/child/check", {}, {
            headers: {
                Authorization: auth
            }
        }
    )
}

export async function child_can_check(auth:string){
    const resp = await client.get<boolean>(
        "/api/v0/child/check/available",
        {headers:{
            Authorization:auth
            }}
    )

    return resp.data


}

