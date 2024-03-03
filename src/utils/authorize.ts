const AUTH_KEY = "PARENT_AUTHORIZE"

class AuthorizeManager {
    private static AUTHORIZE_TOKEN: string | null

    public static authorized(): boolean {
        if (this.AUTHORIZE_TOKEN===null && localStorage.getItem(AUTH_KEY)!==null){
            this.AUTHORIZE_TOKEN = localStorage.getItem(AUTH_KEY)
        }
        return AuthorizeManager.AUTHORIZE_TOKEN !== null
    }

    public static getToken(): string {
        if (this.AUTHORIZE_TOKEN) {
            return this.AUTHORIZE_TOKEN
        } else if (localStorage.getItem(AUTH_KEY)) {
            this.AUTHORIZE_TOKEN = localStorage.getItem(AUTH_KEY)
            return this.AUTHORIZE_TOKEN!
        } else {
            throw new Error("Unauthorized")
        }
    }

    public static setToken(token: string) {
        this.AUTHORIZE_TOKEN = token
        localStorage.setItem(AUTH_KEY,token)
    }

    public static clearToken() {
        this.AUTHORIZE_TOKEN = null
        localStorage.removeItem(AUTH_KEY)
    }
}

export default AuthorizeManager