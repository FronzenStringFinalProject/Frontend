import client, {ServiceResponse} from "../baseRequest.ts";

export async function getChildSpecMonthCheckRecord(authorize: string, month: number, year: number): Promise<ServiceResponse<string[]>> {
    const resp = await client.get<ServiceResponse<string[]>>("/api/v0/child/check/month",
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