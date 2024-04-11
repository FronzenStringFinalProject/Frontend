import client, {ResponseResult} from "../../baseRequest.ts";

export async function parentGetChildSpecMonthCheckRecord(auth: string, cid: number, month: number, year: number): Promise<ResponseResult<string>[]> {
    const resp = await client.get<string[]>("/api/v0/parent/children/check",{
        headers:{
            Authorization: auth,
        },
        params:{
            cid,
            month,year
        }
    });
    return resp.data
}

export interface CheckInInfo{
    "total": number,
    "continual": number
}

export async function parentGetCheckinInfo(auth: string, cid: number, ): Promise<ResponseResult<CheckInInfo>> {
    const resp = await client.get<CheckInInfo>("/api/v0/parent/children/statical/check", {
        headers:{
            Authorization: auth,
        },
        params:{
            cid
        }
    })
    return resp.data
}