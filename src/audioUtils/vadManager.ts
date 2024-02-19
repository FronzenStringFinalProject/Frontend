import {MicVAD} from "@ricky0123/vad-web";

class VadManager{
    vad:MicVAD
    onActivate:(state:boolean)=>void
    onSpeaking:(state:boolean)=>void

    constructor(onActivate:(state:boolean)=>void, onSpeaking:(state:boolean)=>void) {
        this.onActivate=onActivate
        this.onSpeaking=onSpeaking
    }

    async vadInit(){
        const onSpeaking = this.onSpeaking;

        this.vad = await MicVAD.new({
            onSpeechStart() {

            },
            onSpeechEnd(audio) {

            },
        })
    }
}