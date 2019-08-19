const http = require('http');

setInterval(getConnectorStatus, 1000);

import { mainTestFileOpen } from "../main";

/****************************
 * Functions
****************************/

function getConnectorStatus(){

    http.get('http://localhost:9100/api/connector/status', (resp) => {
        console.log("PASSOU");    

        let data = '';

        mainTestFileOpen();
    
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Process the result.
        resp.on('end', () => {
            var connectorData = JSON.parse(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
}
