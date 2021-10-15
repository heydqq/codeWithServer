const { spawn,exec,fork } = require('child_process');
const path = require('path');
// const find = spawn('find',['.','-type','f']);
// const wc = spawn('wc',['-l']);

// find.stdout.pipe(wc.stdin);
// wc.stdout.on('data',(data) => {
//     console.log(`Number of files ${data}`)
// })

// exec('find . -type f | wc -l',(err,stdout,stderr) => {
//     console.log(`Number of files${stdout}`)
// })

// process.stdout.on('data',(data) => {
//     console.log(data)
// })
// const child = spawn('find',['.','-type','f'],{
//     // stdio:'inherit'
// })

// child.stdout.pipe(process.stdout)

// let child = fork(path.join(__dirname,'ipc-child'));
// child.on('message',(m) => {
//     console.log('Parent got message:',m);
// })
// child.send({hello:'helloWorld'});

let child = spawn('node',[path.join(__dirname,'ipc-child')]);
child.stdin.setDefaultEncoding('utf8');
child.stdin.write(JSON.stringify({
    type:'handshake',
    payload:'你好呀'
}))

child.stdout.on('data',(chunk) => {
    let data = chunk.toString();
  let message = JSON.parse(data);
  console.log(`${message.type} ${message.payload}`);
})