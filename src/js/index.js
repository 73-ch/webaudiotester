import WebAudioTester from "./WebAudioTester.js";

(function () {
    const test = new WebAudioTester();


    // setTimeout(test.triggerOsc("start"),3000);

    let play = document.querySelector("#play");
    let stop = document.querySelector("#stop");
    let change = document.querySelector("#change");

    play.onclick = () => {
        test.triggerOsc("start");
    };

    stop.onclick = () => {
        test.triggerOsc("stop");
    };

    change.onclick = () => {
        test.changeOscType("square");
    };

})();