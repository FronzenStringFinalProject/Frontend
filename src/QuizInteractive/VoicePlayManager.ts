import {Ref, watch} from "vue";


export type DoneCallback = ()=>void
/// 音频播放管理
export class VoicePlayManager{
    private audioElement:HTMLAudioElement
    doneCallback:DoneCallback

    private constructor(element:HTMLAudioElement,callback:DoneCallback) {
        this.audioElement=element
        this.doneCallback = callback
    }

    public static async create(element:Ref<HTMLAudioElement|null>,callback:DoneCallback):Promise<VoicePlayManager>{
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

        return new VoicePlayManager(audioElement,callback)
    }

    public async speaking(text:string,playAudioWhenEnd:boolean=false){
        const words = new SpeechSynthesisUtterance(text)
        words.lang="zh-cn"
        words.rate=1.15
        words.onend = ()=>{
            if (playAudioWhenEnd){
                this.audioElement.onpause= ()=>{
                    this.doneCallback()
                }
                this.audioElement.play()
            }else {
                this.doneCallback()
            }
        }
        speechSynthesis.speak(words)
    }
}