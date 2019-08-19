var ipcRenderer = require('electron').ipcRenderer;

function StatusBarViewModel(){
    //#region atributtes
    var self = this;
    //#endregion

    var model = {
        Name: ko.observable('OPP2'),
        StatusDescription: ko.observable(''),
        ConnectorId: ko.observable(0),
        StartedAt: ko.observable('01/01/0001'),
        ServiceStatus: ko.observable(0)
        /*  Stopped = 0,
            Stopping = 1,
            Starting = 2,
            Running = 3 */
    };

    var statusBarViewModel = {
        Model: model
    };

    ko.applyBindings(statusBarViewModel);

    ipcRenderer.on('connector-status', function (event,connectorData) {
        console.log(connectorData);
        model.ConnectorId(connectorData.connectorId);
        model.StartedAt(connectorData.startedAt);
        model.ServiceStatus(connectorData.serviceStatus);        

        if(model.ServiceStatus == 3){
            document.getElementById('statusIcon').src = "images/sucess.png";
            model.StatusDescription('Running');
        }else{
            document.getElementById('statusIcon').src = "images/fail.png";
            model.StatusDescription('Not Running');
        }
    });
}

ko.applyBindings(new StatusBarViewModel(), $('#metris-bar'));