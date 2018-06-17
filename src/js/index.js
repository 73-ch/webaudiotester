import WebAudioTester from "./WebAudioTester.js";
import createAudioNode from "./createAudioNode.js";

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

    let context = new AudioContext();

    fetch("./js/audio_nodes.json").then((response) => {
        return response.json()
    }).then((json) => {
        let test2 = new createAudioNode(context, json);

        setTimeout(()=>{
            console.log(test2.getNodes());
        }, 10000);
    });

})();