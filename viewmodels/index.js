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

    ipcRenderer.on('connector-data', function (event,connectorData) {
        self.connectorId(connectorData.connectorId);
        self.startedAt(connectorData.startedAt);
        self.serviceStatus(connectorData.serviceStatus);        

        if(self.serviceStatus() == 3){
            document.getElementById('statusIcon').src = "../images/sucess.png";
            self.StatusDescription('Running');
        }else{
            document.getElementById('statusIcon').src = "../images/fail.png";
            self.StatusDescription('Not Running');
        }
    });
}

ko.applyBindings(new StatusBarViewModel(), $('#metris-bar'));