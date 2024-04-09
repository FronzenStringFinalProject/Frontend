import client from "../../baseRequest.ts";

export interface ChildBase {
    ability: number;
    cid: number;
    name: string;
}

export async function getChildBaseInfo(auth: string, childId: number) {
    const resp = await client.get<ChildBase>("/api/v0/parent/children", {
        method: "GET", headers: {
            "Authorization": auth,
        }, params: {cid: childId}
    })

    return resp.data
}


export async function createChild(auth: string, childName: string) {
    const resp = await client.post<number>("/api/v0/parent/children",
        {name: childName}
        , {headers: {Authorization: auth,}}
    );
    return resp.data
}

export async function deleteChild(auth: string, childId: number) {
    await client.delete("/api/v0/parent/children", {
        headers: {Authorization: auth,},
        data: {cid: childId}
    })
}