// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  chatbot: {
    host: "https://mfood-commerce-01.herokuapp.com",
    version: "v1"
  },
  innoway: {
    // host: "https://m-commerce-cloud-service.appspot.com",
    host: "https://innoway-server.mcommerce.com.vn",
    version: "v1",
    firebase: {
      apiKey: "AIzaSyCV7iiP9I8axVH3zT1AzltHlvcDWYoOySs",
      authDomain: "dashboard-version-2-0.firebaseapp.com",
      databaseURL: "https://dashboard-version-2-0.firebaseio.com",
      projectId: "dashboard-version-2-0",
      storageBucket: "dashboard-version-2-0.appspot.com",
      messagingSenderId: "16906134069"
    },
    uiHost: 'http://dashboard-version-2-0.firebaseapp.com',
    fcmServiceWorkerPath: '/assets/firebase-messaging-sw.js'
  }
};
