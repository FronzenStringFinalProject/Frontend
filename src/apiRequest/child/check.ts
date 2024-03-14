import client, {ServiceResponse} from "../baseRequest.ts";

export async function child_check(auth: string): Promise<ServiceResponse<null>> {
    const res = await client.post<ServiceResponse<null>>("/api/v0/child/check", {}, {
            headers: {
                Authorization: auth
            }
        }
    )
}

