// 录音管理相关控制接口
// 使用vad模块进行录音切割，按照需求进行录音合并
import {MicVAD} from "@ricky0123/vad-web";
import audioBufferToWav from "audiobuffer-to-wav";

export type RecordState = "Idle" | "Recording" | "ShortBreak" | "Ending" | "Exit"
export type AudioSubmit = (audio: Blob) => void
export type StateHandler = (state: RecordState) => void
export type MicState = (enable: boolean, activate: boolean) => void

export class RecordingManager {
    audioSubmit: AudioSubmit
    outerHandler: StateHandler
    micState?: MicState
    private state: RecordingStateTransformer
    private vad: MicVAD
    private recorded?: Blob
    private timeout?: NodeJS.Timeout

    private constructor(submitAudio: AudioSubmit, handler: StateHandler) {
        this.audioSubmit = submitAudio
        this.outerHandler = handler
        this.state = new RecordingStateTransformer(() => {
        })
    }

    public static async create(submitAudio: AudioSubmit, handler: StateHandler, micState?: MicState): Promise<RecordingManager> {
        const self = new RecordingManager(submitAudio, handler);
        self.micState = micState
        // https://wiki.vad.ricky0123.com/en/docs/user/api
        self.vad = await MicVAD.new({
            onSpeechStart() {
                self.updateMicState(true, true)
                console.log("开始录音，当前状态", self.state.state)
                if (self.timeout) {
                    console.log("清理timeout")
                    //如果有timeout,取消该timeout
                    clearTimeout(self.timeout)
                }
                console.log("start recording")
                self.nextState({recording: true})
            },
            onSpeechEnd(audio) {
                self.updateMicState(true, false)
                console.log("ending recording")
                let new_audio = audioConv(audio)
                if (self.recorded && self.recorded.size > 0) {
                    self.recorded = new Blob([self.recorded, new_audio], {type: new_audio.type})
                } else {
                    self.recorded = new_audio
                }
                // 开启一个短暂等待，如果有多句话
                self.timeout = setTimeout(() => {
                    // 如果什么都没有，进入下个状态
                    self.nextState({recording: false})
                }, 1000)
                self.nextState({recording: false})
            },
        })
        return self
    }

    public stateHandler(state: RecordState) {
        switch (state) {
            case "Idle":
                if (this.timeout)
                    clearTimeout(this.timeout)
                if (this.recorded)
                    this.recorded = undefined
                break
            case "Recording":
            case "ShortBreak":
                break;
            case "Ending":
                this.audioSubmit(this.recorded!)
                this.recorded = undefined
                this.nextState({})
                break;
            case "Exit":
                this.vad.destroy()
                break;

        }
    }

    public pause() {
        this.vad.pause()
        this.updateMicState(false, false)
    }

    public resume() {
        this.vad.start()
        this.updateMicState(true, false)
    }

    public exit() {
        this.nextState({exit: true})

    }

    private updateMicState(enable: boolean, activate: boolean) {
        if (this.micState)
            this.micState(enable, activate)
    }

    private nextState(input: RecordStateTransInput) {
        const state = this.state.nextState(input)
        this.stateHandler(state)
        this.outerHandler(state)
    }

}

interface RecordStateTransInput {
    recording?: boolean,
    enable?: boolean,
    exit?: boolean
}

class RecordingStateTransformer {
    state: RecordState = "Idle"
    handler: (state: RecordState) => void

    constructor(handler: (state: RecordState) => void) {
        this.handler = handler
    }

    nextState(input: RecordStateTransInput): RecordState {
        console.log(this.state, input)
        if (input.exit) {
            this.state = "Exit"
        } else {

            switch (this.state) {
                case "Idle":
                    this.state = "Recording"
                    break

                case "Recording":
                    if (input.recording) {
                        this.state = "Recording"
                    } else {
                        this.state = "ShortBreak"
                    }
                    break;
                case "ShortBreak":
                    if (input.recording) {
                        this.state = "Recording"
                    } else {
                        this.state = "Ending"
                    }
                    break;
                case "Ending":
                    this.state = "Idle"
                    break;
                case "Exit":
                    break
            }
        }
        this.handler(this.state)
        return this.state
    }
}

const audioConv = (audio: Float32Array, rate: number = 16000) => {
    const ctx = new AudioContext()
    const buff = ctx.createBuffer(1, audio.length, rate)
    const channelBuff = buff.getChannelData(0)
    for (let i = 0; i < audio.length; i++) {
        channelBuff[i] = audio[i]
    }
    const waveAudio = audioBufferToWav(buff)

    return new Blob([waveAudio], {type: "audio/wav"})
}