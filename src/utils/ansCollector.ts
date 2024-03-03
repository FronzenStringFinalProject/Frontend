import {ref, Ref, watch, WatchCallback, WatchOptions} from "vue";

export type State =
    "Begin"
    | "GenIntroAsk"
    | "WaitIntro"
    | "ConvIntroRequire"
    | "GenIntro"
    | "FetchQuiz"
    | "GenQuizSound"
    | "WaitAns"
    | "ConvAns"
    | "UndetectedAns"
    | "GenAnsCheck"
    | "WaitCorrect"
    | "Submit"
    | "Unknown"
    | "Pause"
    | "Exit"

export type RecordState = "Idle" | "Recording" | "Done"
export type QuizAnswerState = "NoDetect" | "Detected" | "Unknown"
export type NeedIntro = boolean

export interface StateInput {
    recordState?: RecordState,
    quizState?: QuizAnswerState,
    needIntro: NeedIntro,
    requestPause: boolean,
    exit?: boolean
}

export class StateForward {
    private state: Ref<State> = ref("Begin")

    getState(): State {
        return this.state.value
    }

    watchState(cb: WatchCallback, ops: WatchOptions) {
        watch(this.state, cb, ops)
    }

    nextState({recordState, quizState, requestPause, exit, needIntro}: StateInput): State {
        console.log(recordState, quizState, requestPause, exit, this.state.value)
        if (requestPause) {
            this.state.value = "Pause"
            return this.state.value
        } else if (exit) {
            this.state.value = "Exit"
            return this.state.value
        } else {

            switch (this.state.value) {
                case "Begin":
                    this.state.value = "GenIntroAsk"
                    break;
                case "GenIntroAsk":
                    this.state.value = "WaitIntro"
                    break
                case "WaitIntro":
                    if (recordState === undefined || recordState == "Idle") {
                        this.state.value = "FetchQuiz"
                    } else if (recordState == "Recording") {
                        this.state.value = "WaitIntro"
                    } else {
                        this.state.value = "ConvIntroRequire"
                    }
                    break
                case "ConvIntroRequire":
                    if (needIntro === undefined || needIntro) {
                        this.state.value = "GenIntro"
                    } else {
                        this.state.value = "FetchQuiz"
                    }
                    break
                case "GenIntro":
                    this.state.value = "FetchQuiz"
                    break
                case "FetchQuiz":
                    this.state.value = "GenQuizSound"
                    break;
                case "GenQuizSound":
                    this.state.value = "WaitAns"
                    break;
                case "WaitAns":
                    if (recordState === undefined || recordState == "Idle") {
                        this.state.value = "GenQuizSound"
                    } else if (recordState == "Recording") {
                        this.state.value = "WaitAns"
                    } else {
                        this.state.value = "ConvAns"
                    }
                    break;
                case "ConvAns":
                    if (quizState == "Detected") {
                        this.state.value = "GenAnsCheck"
                    } else if (quizState == "NoDetect") {
                        this.state.value = "UndetectedAns"
                    } else {
                        this.state.value = "Unknown"
                    }
                    break;
                case "UndetectedAns":
                    this.state.value = "GenQuizSound"
                    break
                case "GenAnsCheck":
                    this.state.value = "WaitCorrect"
                    break;
                case "WaitCorrect":
                    if (recordState === undefined || recordState == "Idle") {
                        this.state.value = "Submit"
                    } else if (recordState == "Recording") {
                        this.state.value = "WaitCorrect"
                    } else {
                        this.state.value = "ConvAns"
                    }
                    break;
                case "Submit":
                    this.state.value = "FetchQuiz"
                    break;
                case "Unknown":
                    this.state.value = "FetchQuiz"
                    break
                case "Pause":
                    this.state.value = "FetchQuiz"
                    break
                case "Exit":
                    break
            }
            return this.state.value
        }
    }
}