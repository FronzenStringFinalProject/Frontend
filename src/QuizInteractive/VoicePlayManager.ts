import {Ref, watch} from "vue";


export type DoneCallback = ()=>void
export type SpeakerState=(activate:boolean)=>void
/// 音频播放管理
export class VoicePlayManager{
    private audioElement:HTMLAudioElement
    speakerState?:SpeakerState
    doneCallback:DoneCallback

    private constructor(element:HTMLAudioElement,callback:DoneCallback) {
        this.audioElement=element
        this.doneCallback = callback
    }

    public static async create(element:Ref<HTMLAudioElement|null>,callback:DoneCallback,speakerState?:SpeakerState):Promise<VoicePlayManager>{
        let elementPromise = new Promise<HTMLAudioElement>((resolve)=>{
            if (element.value){
                resolve(element.value)
            }
            watch(element,(element)=>{
                if (element){
                    resolve(element)
                }
            })
        })
        let audioElement = await elementPromise

        const manger =  new VoicePlayManager(audioElement,callback)
        manger.speakerState=speakerState
        return manger
    }

    public async speaking(text:string,playAudioWhenEnd:boolean=false){
        const words = new SpeechSynthesisUtterance(text)
        words.lang="zh-cn"
        words.rate=1.15
        words.onend = ()=>{
            if (playAudioWhenEnd){
                this.audioElement.onpause= ()=>{
                    this.doneCallback()
                    this.updateSpeakerState(false)
                }
                this.audioElement.play()
            }else {
                this.doneCallback()
                this.updateSpeakerState(false)
            }
        }
        speechSynthesis.speak(words)
        this.updateSpeakerState(true)
       }

       private updateSpeakerState(activate:boolean){
        if (this.speakerState)
            this.speakerState(activate)
       }
}