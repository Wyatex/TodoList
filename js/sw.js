self.addEventListener('install', event => {
    console.log('install', event)
    self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log('activate', event)
})

self.addEventListener('fetch', event => {
    console.log('fetch', event)
})
