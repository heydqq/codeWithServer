// process.on('message',(m) => {
//     console.log('child got message:',m);
// })
// process.send({
//     foo:'bar'
// })
process.stdin.on('data', (chunk) => {
    let data = chunk.toString();
    let message = JSON.parse(data);
    switch (message.type) {
      case 'handshake':
        // 子进程-发
        process.stdout.write(JSON.stringify({
          type: 'message',
          payload: message.payload + ' : hoho'
        }));
        break;
      default:
        break;
    }
  });