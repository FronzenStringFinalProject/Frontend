
export function speaking(text:string,onend:()=>void){
    const words = new SpeechSynthesisUtterance(text)
    words.lang="zh-cn"
    words.onend = onend
    speechSynthesis.speak(words)
}