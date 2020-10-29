const WSURL = ':8000/ws/front'

export default class WsManager {

    static instance = null;
    
    constructor() {
        this.ws = new WebSocket('ws://' + window.location.hostname + WSURL)
        this.ws.onopen = () => {
			console.log('connected')	
        }
        this.ws.onclose = () => {
			console.log("disconnected")
        }
    }

    /**
     * @returns {WsManager}
     */
    static getInstance() {
        if (WsManager.instance == null) {
            WsManager.instance = new WsManager();
        }
        return this.instance;
    }

    sendJson(json)
    {
        this.ws.send(JSON.stringify(json));
    }
}
