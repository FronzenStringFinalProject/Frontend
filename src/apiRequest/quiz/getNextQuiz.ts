import client from "../baseRequest.ts";

export interface Quiz {
    id: number,
    quiz: string
}

export async function getNextQuiz(token: string) {
    const url = "/api/v0/child/quiz"
    const resp = await client.get<Quiz>(url, {
            headers: {
                "Authorization": token,
                "content-type": "application/json"
            }
        }
    )
    return resp.data
}