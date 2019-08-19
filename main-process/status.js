const http = require('http');
const main = require('../main.js');

// Will get status every 1 second
setInterval(getConnectorStatus, 1000);

/****************************
 * Functions
****************************/

function getConnectorStatus(){

    http.get('http://localhost:9100/api/connector/status', (resp) => { 
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Process the result.
        resp.on('end', () => {
            var connectorData = JSON.parse(data);
            main.sendMessage('connector-status', connectorData);

            //Refresh tray status icon
            if(connectorData.serviceStatus == 3){
                main.setImage('images/connectorRunning.png');
            }else if(connectorData.serviceStatus == 0){
                main.setImage('images/connectorPaused.png');
            }else if(connectorData.serviceStatus == 1){
                main.setImagesetImage('images/connectorStopping.png');
            }else{
                main.setImage('images/connectorStarting.png');
            }
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
}