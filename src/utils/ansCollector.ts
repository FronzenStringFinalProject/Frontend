import {ref, Ref, watch, WatchCallback, WatchOptions} from "vue";

export type State =
    "Begin"
    | "FetchQuiz"
    | "GenQuizSound"
    | "WaitAns"
    | "ConvAns"
    | "GenAnsCheck"
    | "WaitCorrect"
    | "Submit"
    | "Unknown"

export type RecordState = "Idle" | "Recording" | "Done"
export type QuizAnswerState = "NoDetect" | "Detected" | "Unknown"

export class StateForward {
    private state: Ref<State> = ref("Begin")

    getState(): State {
        return this.state.value
    }

    watchState(cb: WatchCallback, ops: WatchOptions) {
        watch(this.state, cb, ops)
    }

    nextState(recordState: RecordState = "Idle", quizState: QuizAnswerState = "Unknown"): State {
        switch (this.state.value) {
            case "Begin":
                this.state.value = "FetchQuiz"
                break;
            case "FetchQuiz":
                this.state.value = "GenQuizSound"
                break;
            case "GenQuizSound":
                this.state.value = "WaitAns"
                break;
            case "WaitAns":
                if (recordState == "Idle") {
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
                    this.state.value = "GenQuizSound"
                } else {
                    this.state.value = "Unknown"
                }
                break;
            case "GenAnsCheck":
                this.state.value = "WaitCorrect"
                break;
            case "WaitCorrect":
                if (recordState == "Idle") {
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
        }
        return this.state.value
    }
}