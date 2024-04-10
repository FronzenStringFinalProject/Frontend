import client, {ResponseResult} from "../baseRequest.ts";

export async function getChildSpecMonthCheckRecord(authorize: string, month: number, year: number): Promise<ResponseResult<string[]>> {
    const resp = await client.get<string[]>("/api/v0/child/check/month",
        {
            headers: {
                Authorization: authorize
            },
            params: {
                month, year
            }
        })

    return resp.data
}