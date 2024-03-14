import client, {ServiceResponse} from "../baseRequest.ts";

/**
 * 连续打卡天数
 */
export interface ChildCheckInfo {
    /**
     * 连续打卡
     */
    continual: number;
    /**
     * 累计打卡
     */
    total: number;
}

export async function getChildCheckInfo(authorize: string): Promise<ServiceResponse<ChildCheckInfo>> {
    const resp = await client.get<ServiceResponse<ChildCheckInfo>>("/api/v0/child/check", {headers: {Authorization: authorize}})

    return resp.data
}