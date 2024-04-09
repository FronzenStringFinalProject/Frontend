import client from "../baseRequest.ts";

const uri = "/api/v0/child/quiz/submit"

export async function submitQuizAnswer(auth: string, id: number, ans?: number) {
    const resp = await client.post<
        boolean>(
        uri, {id, ans}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
        }
    )
    return resp.data
}