const AUTH_KEY = "PARENT_AUTHORIZE"
const AUTH_STATE_KEY = "AUTH_STATE"

class AuthorizeManager {
    private static AUTHORIZE_TOKEN: string | null
    private static CurrentState: "Child" | "Parent" | "NoLogin" = "NoLogin"

    public static authorized(): boolean {
        if (this.AUTHORIZE_TOKEN === null && localStorage.getItem(AUTH_KEY) !== null) {
            this.AUTHORIZE_TOKEN = localStorage.getItem(AUTH_KEY)
        }
        return AuthorizeManager.AUTHORIZE_TOKEN !== null
    }

    public static AuthorizeState(): "Child" | "Parent" | "NoLogin" {
        const auth_state = localStorage.getItem(AUTH_STATE_KEY);
        if (auth_state) {
            switch (auth_state) {
                case "Child":
                case "Parent":
                    this.CurrentState = auth_state
                    break
            }
        }
        return this.CurrentState
    }

    public static SwitchState(state: "Child" | "Parent" | "NoLogin"): void {
        AuthorizeManager.CurrentState = state
        localStorage.setItem(AUTH_STATE_KEY, state)
    }

    public static isParent(): boolean {
        return this.CurrentState == "Parent"
    }

    public static isChild(): boolean {
        return this.CurrentState == "Child"
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
        localStorage.setItem(AUTH_KEY, token)
        this.SwitchState("Parent")
    }

    public static clearToken() {
        this.AUTHORIZE_TOKEN = null
        localStorage.removeItem(AUTH_KEY)
        this.SwitchState("NoLogin")
    }
}

export default AuthorizeManager