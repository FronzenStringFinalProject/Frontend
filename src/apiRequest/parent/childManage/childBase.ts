import client, {ServiceResponse} from "../../baseRequest.ts";

export interface ChildBase {
    ability: number;
    cid: number;
    name: string;
}

export async function getChildBaseInfo(auth: string, childId: number): Promise<ServiceResponse<ChildBase>> {
    const resp = await client.get<ServiceResponse<ChildBase>>("/api/v0/parent/children", {
        method: "GET", headers: {
            "Authorization": auth,
        },params:{cid:childId}
    })

    return resp.data
}