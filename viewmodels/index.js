var ipcRenderer = require('electron').ipcRenderer;

function StatusBarViewModel(){
    //#region atributtes
    var self = this;
    //#endregion

    var Model = {
        Name: ko.observable('OPP2'),
        StatusDescription: ko.observable(''),
        ConnectorId: ko.observable(0),
        StartedAt: ko.observable('01/01/0001'),
        ServiceStatus: ko.observable(0),
        LastSetupAt: ko.observable('01/01/0001'),
        CanStop: ko.observable(0),
        CanStart: ko.observable(0)
    };

    self.Model = Model;
    
    ipcRenderer.on('connector-status', function (event,connectorData) {
        Model.ConnectorId(connectorData.connectorId);
        Model.StartedAt(connectorData.startedAt);
        Model.StartedAt(connectorData.lastSetupAt);
        Model.ServiceStatus(connectorData.serviceStatus);
        Model.LastSetupAt(connectorData.lastSetupAt);   
        Model.CanStop(connectorData.canStop);   
        Model.CanStart(connectorData.canStart);   

        switch(Model.ServiceStatus){
            case 0: // Stopped = 0 
                document.getElementById('statusIcon').src = "images/fail.png";
                Model.StatusDescription('Stopped');
                break;
            case 1: // Stopping = 1 
                document.getElementById('statusIcon').src = "images/fail.png";
                Model.StatusDescription('Stopping');
                break;
            case 2: // Starting = 2
                document.getElementById('statusIcon').src = "images/sucess.png";
                Model.StatusDescription('Starting');
                break;
            case 3: // Running = 3
                document.getElementById('statusIcon').src = "images/sucess.png";
                Model.StatusDescription('Running');
                break;
            default:
                document.getElementById('statusIcon').src = "images/sucess.png";
                Model.StatusDescription('Running');
                break;
        }
    });
}

ko.applyBindings(new StatusBarViewModel(), document.getElementById('metris-bar'));