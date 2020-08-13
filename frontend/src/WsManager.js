const WSURL = ':8000/ws/front'

export default class WsManager {

    static instance = null;
    
    /**
     * @returns {WsManager}
     */
    static getInstance() {
        if (WsManager.instance == null) {
            WsManager.instance = new WsManager();
            WsManager.instance.init()
        }
        return this.instance;
    }

    init()
    {
        this.ws = new WebSocket('ws://' + window.location.hostname + WSURL)
        this.ws.onopen = () => {
			console.log('connected')	
        }
        this.ws.onclose = () => {
			console.log("disconnected")
		}
    }
    sendJson(json)
    {
        this.ws.send(JSON.stringify(json));
    }
}

