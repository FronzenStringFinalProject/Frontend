import client, {ServiceResponse} from "../../baseRequest.ts";

export interface ChildrenListItem {
    /**
     * 孩子水平
     */
    ability: number;
    /**
     * 孩子ID
     */
    cid: number;
    /**
     * 孩子姓名
     */
    name: string;
}

export default async function getChildrenList(token: string): Promise<ServiceResponse<ChildrenListItem[]>> {
    const resp = await client.get<ServiceResponse<ChildrenListItem[]>>("/api/v0/parent/children", {
        headers: {
            "Authorization": token
        }
    })

    return resp.data
}