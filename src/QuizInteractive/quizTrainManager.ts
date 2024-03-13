// 题目练习管理
// 1 管理音频录制与播放
import {RecordingManager, StateHandler} from "./RecordingManager.ts";
import {VoicePlayManager} from "./VoicePlayManager.ts";
import {Ref} from "vue";
import {id} from "vuetify/locale";
import {speaking} from "../utils/speechSynthesis.ts";

export type QuizTrainState =
// 开始
    "Begin" |
    // 获取题目
    "FetchQuiz" |
    // 合成题目声音
    "SpeakingQuiz" |
    // 录制答案
    "RecordAns" |
    // 识别语言
    "ConvAns" |
    // 没听到答案
    "ConfuseAns" |
    // 答案确认
    "ConfirmAns" |
    // 确认内容录制
    "RecordConfirm" |
    // 确认内容识别
    "ConvConfirm" |
    //提交答案
    "Submit" |
    // 合成激励语音
    "SpeakingActivate" |
    // 暂停
    "Pause" |
    // 退出
    "Exit"

export type TimeoutState = "Timeout" | "Activate"

export interface FetchedQuiz {
    id: number,
    quiz_speak: string,
    quiz_display: string
}

export interface AudioResult {
    ans?: number
    negative: boolean,
    positive: boolean
}

export type FetchQuiz = () => Promise<FetchedQuiz>
export type SubmitQuiz = (id: number, ans?: number) => Promise<boolean>
export type ConvAudio = (audio: Blob) => Promise<AudioResult>

export class QuizTrainManager {
    private fetchQuiz: FetchQuiz
    private submitQuiz: SubmitQuiz
    private convAudio: ConvAudio

    private recording: RecordingManager
    private playing: VoicePlayManager
    private state: QuizTrainState = "Begin"

    private doneCallbackResolver: () => void

    private currentQuiz?: FetchedQuiz
    private currentTimeout?: NodeJS.Timeout
    private currentAns?: number
    private audioBlob?: Blob




    private constructor(
        record: RecordingManager,
        playing: VoicePlayManager,
        fetchQuiz: FetchQuiz,
        submitQuiz: SubmitQuiz,
        convAudio: ConvAudio
    ) {
        this.recording = record
        this.playing = playing
        this.fetchQuiz = fetchQuiz
        this.submitQuiz = submitQuiz
        this.convAudio = convAudio
    }

    public static async create(
        stateHandle: StateHandler,
        audioElement: Ref<HTMLAudioElement | null>,
        fetchQuiz: FetchQuiz,
        submitQuiz: SubmitQuiz,
        convAudio: ConvAudio
    ): Promise<QuizTrainManager> {
        const record = await RecordingManager.create(() => {
        }, ()=>{})
        const playing = await VoicePlayManager.create(audioElement, () => {
        })
        let self = new QuizTrainManager(record, playing, fetchQuiz, submitQuiz, convAudio)
        self.recording.outerHandler = (state) => {
            console.log(state)

            if (state == "Recording" && self.currentTimeout) {
                clearTimeout(self.currentTimeout)
                self.currentTimeout=undefined
            }


            stateHandle(state)
        }
        self.recording.audioSubmit = (audio: Blob) => {
            self.audioBlob = audio
            self.nextState({startSpeaking: true})
        }
        self.playing.doneCallback = () => {
            if (self.doneCallbackResolver)
                self.doneCallbackResolver()
        }
        return self
    }

    private async speaking(word: string, playAudio: boolean = false) {
        this.recording.pause()
        await this.playing.speaking(word, playAudio)
        await new Promise<void>((resolve) => {
            this.doneCallbackResolver = resolve
        })
        console.log("Speaking Done")
        this.recording.resume()
    }

    public pause(){
        this.nextState({pause:true})
    }
    public resume(){
        this.nextState({pause:false})
    }

    public exit(){
        this.nextState({exit:true})
    }


    public nextState({correct, startSpeaking, confirm, pause, exit, ignorance, confuse}: {
        // 答案是否正确
        correct?: boolean,
        // 是否开始回答
        startSpeaking?: boolean,
        // 是否确认答案
        confirm?: boolean,
        // 暂停
        pause?: boolean,
        // 退出
        exit?: boolean,
        // 这题不会
        ignorance?: boolean,
        // 没听到答案
        confuse?: boolean
    }) {
        console.log("currentState :",this.state)
        if (pause) {
            this.state = "Pause"
        } else if (exit) {
            this.state = "Exit"
        } else {

            switch (this.state) {
                case "Begin":
                    this.state = "FetchQuiz"
                    break;
                case "FetchQuiz":
                    this.state = "SpeakingQuiz"
                    break;
                case "SpeakingQuiz":
                    this.state = "RecordAns"
                    break;
                case "RecordAns":
                    // 如果已经开始过回答，进行语音识别
                    if (startSpeaking)
                        this.state = "ConvAns"
                    else
                        // 没听到答案，重复题目
                        this.state = "SpeakingQuiz"
                    break;
                case "ConvAns":
                    // 如果不会，提交当前题目
                    if (ignorance)
                        this.state = "Submit"
                        // 没听到答案，请求重新回答
                    else if (confuse)
                        this.state = "ConfuseAns"
                        // 其他情况确认答案，下题
                    else
                        this.state = "ConfirmAns"
                    break;
                case "ConfuseAns":
                    this.state = "RecordAns"
                    break
                case "ConfirmAns":
                    this.state = "RecordConfirm"
                    break;
                case "RecordConfirm":
                    // 如果有回答，语音识别回答
                    if (startSpeaking)
                        this.state = "ConvConfirm"
                    else
                        // 没有回答，视为确认
                        this.state = "Submit"
                    break;
                case "ConvConfirm":
                    // 确认结果，提交
                    if (confirm)
                        this.state = "Submit"
                    else
                        // 更新答案，进行确认
                        this.state = "ConfirmAns"
                    break;
                case "Submit":
                    // 提交结果正确，进行激励
                    if (correct)
                        this.state = "SpeakingActivate"
                    else
                        // 下一题
                        this.state = "FetchQuiz"
                    break;
                case "SpeakingActivate":
                    this.state = "FetchQuiz"
                    break;
                case "Pause":
                    // 暂停，保持暂停
                    if (pause!=undefined && !pause)
                        this.state = "FetchQuiz"
                    else
                        //否则获取下一题
                        this.state = "Pause"
                    break;
                case "Exit":
                    break;
            }
        }
        this.nextHandle()
    }

    private nextHandle() {
        // console.log(`handling state ${this.state}`)
        switch (this.state) {
            case "Begin":
                this.nextState({})
                break;
            case "FetchQuiz":
                // 清空上一轮状态
                this.currentAns=undefined
                this.currentQuiz=undefined
                this.currentTimeout=undefined
                this.audioBlob=undefined
                // 获取题目
                this.fetchQuiz()
                    .then((quiz) => {
                        this.currentQuiz = quiz
                        this.nextState({})
                    })
                break;
            case "SpeakingQuiz":
                this.speaking(`请问${this.currentQuiz?.quiz_speak}等于多少？`, true)
                    .then(() => {
                        this.nextState({})
                    })
                break;
            case "RecordAns":
            case "RecordConfirm":
                this.recording.resume()
                this.currentTimeout = setTimeout(() => {
                    this.nextState({})
                    this.recording.pause()
                }, 3000)
                break;
            case "ConvAns":
                this.convAudio(this.audioBlob)
                    .then((result) => {
                        console.log(result)
                        //提交语音后清空
                        this.audioBlob=undefined
                        // 消极，否定，表示不会。
                        if (result.negative) {
                            this.nextState({ignorance: true})
                        } else if (result.ans) {

                            // 识别到答案，提交
                            this.currentAns = result.ans
                            this.nextState({})
                        } else {
                            // 其他情况
                            this.nextState({confuse: true})
                        }
                    })
                break;
            case "ConfuseAns":
                this.speaking(`抱歉，没听清。请复述你的答案`, true)
                    .then(() => {
                        this.nextState({})
                    })
                break
            case "ConfirmAns":
                this.speaking(`你的这道题答案是${this.currentAns}, 对嘛？`, true)
                    .then(() => {
                        this.nextState({})
                    })
                break;

            case "ConvConfirm":
                this.convAudio(this.audioBlob)
                    .then((result) => {
                        //提交语音后清空
                        this.audioBlob=undefined
                        // 积极答案，表示确认
                        if (result.positive) {
                            this.nextState({confirm: true})
                        } else if (result.ans) {
                            //提供新答案
                            this.currentAns = result.ans
                            this.nextState({})
                        } else {
                            //其他情况
                            this.nextState({})
                        }
                    })
                break;
            case "Submit":
                this.submitQuiz(this.currentQuiz?.id,this.currentAns)
                    .then((correct)=>{
                        this.nextState({correct})
                    })
                break;
            case "SpeakingActivate":
                this.speaking("太棒了，你又获得了100积分",false)
                    .then(()=>{
                        this.nextState({})
                    })
                break;
            case "Pause":
            case "Exit":
                break;

        }
    }
}
