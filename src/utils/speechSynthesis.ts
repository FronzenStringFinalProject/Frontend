import {Ref} from "vue";

export function speaking(text:string,speaking:Ref<boolean>,onend:()=>void){
    const words = new SpeechSynthesisUtterance(text)
    words.lang="zh-cn"
    words.rate=1.15
    words.onend = onend
    speaking.value=true;
    speechSynthesis.speak(words)

}