self.addEventListener('message',(e) => {
    console.log('service worker receive message', e.data);
    e.waitUntil (
        self.clients.matchAll().then((clients ) => {
            clients.forEach(element => {
                element.postMessage(e.data);
            });
        })
    )
})