class AudioPlayer {
    audioCtx: AudioContext;
    audioBuffer: any;
    constructor(){
        this.audioCtx = new AudioContext();
        this.audioBuffer = null;
        this.start()
    }

    async start (){
        let ans = await this.getBuffer();
        this.audioBuffer = await this.audioCtx.decodeAudioData(ans,()=>{
            console.log('success');
        },() => {
            console.log('er')
        })
    }

    async play(){
        const sourceNode = this.audioCtx.createBufferSource();
        sourceNode.buffer = this.audioBuffer;
        sourceNode.connect(this.audioCtx.destination);
        sourceNode.start(0)
    }

    getBuffer = () => {
        return fetch('./ring1.mp3')
        .then(res => res.arrayBuffer());
    }
}
let audioInstance = new AudioPlayer()
audioInstance.audioCtx.onstatechange = (e) => {
    console.log(e);
}
document.getElementById('play').onclick = () => {
    audioInstance.play()
}