// resources/js/ziggy.ts
import { Config as ZiggyConfig } from 'ziggy-js'

export const Ziggy: ZiggyConfig = {
  url: 'http://localhost',
  port: 8000,
  defaults: {},
  routes: {
    home: { uri: '/', methods: ['GET', 'HEAD'] },
    dashboard: { uri: 'dashboard', methods: ['GET', 'HEAD'] },
    'residentregister.store': { uri: 'resident/register', methods: ['POST'] },
    // …all the other routes…
  },
}
