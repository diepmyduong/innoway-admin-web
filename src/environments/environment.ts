// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  chatbot: {
    host: "http://localhost:5000",
    version: "v1"
  },
  innoway: {
    host: "http://localhost:3000",
    version: "v1",
    firebase: {
      apiKey: "AIzaSyCV7iiP9I8axVH3zT1AzltHlvcDWYoOySs",
      authDomain: "dashboard-version-2-0.firebaseapp.com",
      databaseURL: "https://dashboard-version-2-0.firebaseio.com",
      projectId: "dashboard-version-2-0",
      storageBucket: "dashboard-version-2-0.appspot.com",
      messagingSenderId: "16906134069"
    },
    uiHost: 'http://localhost:4200'
  }
};
