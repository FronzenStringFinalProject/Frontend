import client from "../../baseRequest.ts";

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

export default async function getChildrenList(token: string){
    const resp = await client.get<ChildrenListItem[]>(
        "/api/v0/parent/children/all", {
        headers: {
            "Authorization": token
        }
    })

    return resp.data
}