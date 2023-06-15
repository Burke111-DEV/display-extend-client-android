const msgDiv = document.getElementById("msg");
let isMsgDivShowing = false;
let loopRef = null;


const width = window.innerWidth || document.documentElement.clientWidth;
const height = window.innerHeight || document.documentElement.clientHeight;


const showMessageDiv = () => { msgDiv.className = "show"; isMsgDivShowing = true; }
const hideMessageDiv = () => { msgDiv.className = "hide"; isMsgDivShowing = false; }
function displayMessageDiv (duration, delay) {
    if(!delay) delay = 0;
    setTimeout(() => {
        if(loopRef) clearTimeout(loopRef);
        showMessageDiv();
        loopRef = setTimeout(() => {
            if(isMsgDivShowing) hideMessageDiv();
            loopRef = null;
        }, duration);    
    }, delay);
}
function addMsgDivText(text) {
    msgDiv.innerHTML += `<br />${text}`;
    displayMessageDiv(4000, 500);
} 
addMsgDivText("Initializing...");
addMsgDivText(`Screen Size: ${width}x${height}px`);


msgDiv.addEventListener('click', () => {
    if(!isMsgDivShowing) displayMessageDiv(6000);
    else hideMessageDiv();
});

const ctrlsSocket = new WebSocket('ws://localhost:8000');
ctrlsSocket.onopen = () => {
    // Send screen size
    ctrlsSocket.send(JSON.stringify({width: width, height: height}));
    addMsgDivText(`Client Connected.`);
}
ctrlsSocket.onmessage = (event) => {
    const d = JSON.parse(event.data);
    switch(d.cmd) {
        case "START": { // Start stream and canvas.
            addMsgDivText(`Server is starting stream...`);
            RunWsAvcPlayer();
            break;
        }
        default: {
            addMsgDivText(`Something went wrong. Unknown message from server.`);
            break;
        }
    }
}
ctrlsSocket.onclose = () => {
    addMsgDivText("Connection to Server closed.")
}

function RunWsAvcPlayer() {
    //initialize the player, if useWorker: true, than you must have `/Decoder.js` availible at the root of the domain.
    var wsavc = new WSAvcPlayer.default({useWorker:false});

    //append the canvas to the box element, you can style the box element and canvas.
    document.body.appendChild(wsavc.AvcPlayer.canvas);

    //connect to the websocket
    wsavc.connect("ws://127.0.0.1:8008");
    addMsgDivText(`Stream connected.`);
}