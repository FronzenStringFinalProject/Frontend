import {Quiz} from "../apiRequest/quiz/getNextQuiz.ts";
import {Ref} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import {State} from "./ansCollector.ts";

export interface AudioResult {
    ans?: number,
    negative: boolean,
    positive: boolean
}

export class StateManager {
    // 外部提供接口
    // 题目获取
    fetchQuiz: () => Promise<Quiz>
    // 提交音频
    submitAudio: (audio: Blob) => Promise<AudioResult>
    // 提交答案
    submitAnswer: (answer?: number) => Promise<boolean>

    // 本地状态
    audioPlaying: Ref<boolean>
    speaking: Ref<boolean>
    pause: Ref<boolean>
    exit: Ref<boolean>

    //内部状态
    currentTimeout?: NodeJS.Timeout

    // 外部组件
    voiceActiveDetection: MicVAD
    audioElement: HTMLAudioElement

    // 外部状态提交
    emitMic: (enable: boolean, speaking: boolean) => void
    emitPlaying: (playing: boolean) => void

    //状态机状态
    state: State = "Begin"

    constructor( // 外部提供接口
        fetchQuiz: () => Promise<Quiz>,
        submitAudio: (audio: Blob) => Promise<AudioResult>,
        submitAnswer: (answer?: number) => Promise<boolean>,
        audioPlaying: Ref<boolean>,
        speaking: Ref<boolean>,
        pause: Ref<boolean>,
        exit: Ref<boolean>,
        voiceActiveDetection: MicVAD,
        audioElement: HTMLAudioElement,
        emitMic: (enable: boolean, speaking: boolean) => void,
        emitPlaying: (playing: boolean) => void
    ) {
        this.fetchQuiz = fetchQuiz
        this.submitAudio = submitAudio
        this.submitAnswer = submitAnswer
        this.audioPlaying = audioPlaying
        this.speaking = speaking
        this.pause = pause
        this.exit = exit
        this.voiceActiveDetection = voiceActiveDetection
        this.audioElement = audioElement
        this.emitMic = emitMic
        this.emitPlaying = emitPlaying


    }

    static async create(
        fetchQuiz: () => Promise<Quiz>,
        submitAudio: (audio: Blob) => Promise<AudioResult>,
        submitAnswer: (answer?: number) => Promise<boolean>,
        audioPlaying: Ref<boolean>,
        speaking: Ref<boolean>,
        pause: Ref<boolean>,
        exit: Ref<boolean>,
        audioElement: HTMLAudioElement,
        emitMic: (enable: boolean, speaking: boolean) => void,
        emitPlaying: (playing: boolean) => void
    ): Promise<StateManager> {
        const voiceActiveDetection = await MicVAD.new({})
        return new StateManager(fetchQuiz,
            submitAudio,
            submitAnswer,
            audioPlaying,
            speaking,
            pause,
            exit,
            voiceActiveDetection,
            audioElement,
            emitMic,
            emitPlaying,
        )
    }
}