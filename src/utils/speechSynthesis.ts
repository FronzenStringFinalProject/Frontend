
export function speaking(text:string,onend:()=>void){
    const words = new SpeechSynthesisUtterance(text)
    words.lang="zh-cn"
    words.rate=1.15
    words.onend = onend
    speechSynthesis.speak(words)
}