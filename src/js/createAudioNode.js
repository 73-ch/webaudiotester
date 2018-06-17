export default class {
    constructor(context, json) {
        this.context = context;

        this.json = json;

        this.buffers = {};

        this.nodes = {};


        // jsonが正しく作られているかをチェック
        this.json_tugs = ["name", "node_type", "out"]; // audio_nodesに対してチェックする要素

        if (this.json.hasOwnProperty("load_files")) {
            this.jsonCheck().then(() => {
                let loadings = [];
                for (let file of this.json.load_files) {
                    loadings.push(new Promise((resolve, reject) => {
                        if (file.hasOwnProperty("path")) {
                            this.loadFile(file.path).then((response) => {
                                this.context.decodeAudioData(response).then((buffer) => {
                                    this.buffers[file.buffer_name] = buffer;
                                    resolve();
                                }, () => {
                                    console.error("decode error");
                                });
                            });
                        }
                    }));
                }
                Promise.all(loadings).then(() => {
                    for (let an of this.json.audio_nodes) {
                        if (an.node_type == "buffer_source") this.createBufferSources(an);
                    }
                    this.connectAudioNodes();
                });
            });
        }

        for (let an of this.json.audio_nodes) {
            switch (an.node_type) {
                case "oscillator":
                    this.createOscillator(an);
                    break;

                case "gain":
                    this.createGain(an);
                    break;
            }
        }
    }

    // jsonのデータチェック用関数
    jsonCheck() {
        return new Promise((resolve, reject) => {
            if (!this.json.hasOwnProperty("audio_nodes")) console.error('json does not have audio_nodes.');
            for (let n of this.json.audio_nodes) {
                for (let i = 0; i < this.json_tugs.length; i++) {
                    if (!n.hasOwnProperty(this.json_tugs[i])) console.error('json does not have ' + this.json_tugs[i].toString());
                }
            }
            resolve();
        });
    }

    loadFile(path) {
        return fetch(path).then((response) => {
            return response.arrayBuffer();
        });
    }

    createOscillator(audio_node) {
        let osc = this.context.createOscillator();
        this.setParams(osc, audio_node.params);
        this.nodes[audio_node.name] = osc;
    }

    createGain(audio_node) {
        let gain = this.context.createGain();
        this.setParams(gain, audio_node.params);
        this.nodes[audio_node.name] = gain;
    }

    createBufferSources(audio_node) {
        let buffer_source = this.context.createBufferSource();
        this.setParams(buffer_source, audio_node.params);
        buffer_source.buffer = this.buffers[audio_node.params.buffer];
        this.nodes[audio_node.name] = buffer_source;
    }

    setParams(target, params) {
        for (let p in params) {
            try {
                target[p] = params[p];
            } catch (e) {
                if (p === "buffer") continue;
                target[p].value = params[p];
            }
        }
    }

    connectAudioNodes() {
        for (let an of this.json.audio_nodes) {
            if (an.hasOwnProperty("out")) {
                if (an.out === "destination") {
                    this.nodes[an.name].connect(this.context.destination);
                } else {
                    try {
                        this.nodes[an.name].connect(this.nodes[an.out]);
                    } catch (e) {
                        this.nodes[an.name].connect(this.nodes[an.out][an.out_sub]);
                    }
                }
            } else {
                console.error("audio nodes does not have out");
            }
        }
    }

    getNodes() {
        // debug

        // for (let n in this.nodes) {
        //     try {
        //         this.nodes[n].start();
        //     } catch (e) {
        //
        //     }
        // }
        return this.nodes;
    }
}