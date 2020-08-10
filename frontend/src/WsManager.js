
const WSURL = ':8000/ws/front';


export default {
    init()
    {
        this.ws = new WebSocket('ws://' + window.location.hostname + WSURL)
        this.ws.onopen = () => {
			console.log('connected')	
        }
        this.ws.onclose = () => {
			console.log("disconnected")
		}
    },
    sendJson(json)
    {
        this.ws.send(JSON.stringify(json));
    }
}

