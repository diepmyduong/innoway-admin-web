function loadScriptInnoway() {
    if (window.innoway2 === undefined) {
        
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://rawgit.com/diepmyduong/innoway2-web-sdk/dev/dist/innoway2.min.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        window.innoway2.init({
            host: "https://innoway2.herokuapp.com/",
            // host: 'http://localhost:3000/',
            brand_id: "3791cbd0-8eeb-11e7-9619-576bbea02309"
        })
    }
}

loadScriptInnoway()