const http = require('http');
//const electron = require('electron');
//const path = require('path');

const main = require('../main.js');

setInterval(getConnectorStatus, 1000);

//let tray = null;  
//tray = new electron.Tray(path.join(__dirname, '../images/connectorPaused.png'));

/****************************
 * Functions
****************************/

function getConnectorStatus(){

    http.get('http://localhost:9100/api/connector/status', (resp) => {
        console.log("PASSOU");   
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Process the result.
        resp.on('end', () => {
            var connectorData = JSON.parse(data);

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

