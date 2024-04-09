import client from "../../baseRequest.ts";

export interface ChildBase {
    ability: number;
    cid: number;
    name: string;
}

export async function getChildBaseInfo(auth: string, childId: number){
    const resp = await client.get<ChildBase>("/api/v0/parent/children", {
        method: "GET", headers: {
            "Authorization": auth,
        },params:{cid:childId}
    })

    return resp.data
}