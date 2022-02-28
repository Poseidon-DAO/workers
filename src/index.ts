import handler from './handler'

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handler.handle(event.request))
})
