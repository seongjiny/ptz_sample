const express = require("express");
const app = express(); 
const Cam = require('./lib/onvif').Cam;
const cors = require('cors');
app.use(cors({
    origin: '*',
}));
let HOSTNAME = '192.100.0.121';
let PORT = 80;
let USERNAME = 'test';
let PASSWORD = 'vkdlvmxmfl1!';
let g_cam_obj;
let listenPort = 3000;

function connectCam() {
    console.log("connectCam()");
    new Cam({
        hostname: HOSTNAME,
        username: USERNAME,
        password: PASSWORD,
        port: PORT,
    }, function(err) {
        if (err) {
            console.log("****************   ERROR OCCURRED   ***************");
            console.log(err);
            return;
        }
        g_cam_obj = this;
        return;
    });

}

async function move(x,y,zoom) {
    if(g_cam_obj) {
        g_cam_obj.relativeMove({x: x,y:y,zoom:zoom});
    } else {
        console.log("Cam is not connected yet");
    }
}

function printPosition(res) {
    g_cam_obj.getStatus(function(err, status, xml) {
        if(err) {
            console.log(err);
            return;
        }
        console.log(status.position)
        res.send(status.position);
    });
}


function getUris() {
    console.log("getSnapshot(): ");
    g_cam_obj.getSnapshotUri(function (err, uri, xml){
        if(err) {
            console.log(err);
            return;
        }
        console.log("[snapshot uri] : " + uri.uri);
    });
    g_cam_obj.getStreamUri(function(err, uri, xml) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("[stream uri]: "+ uri.uri);
    });
    
}

app.get('/', (req,res) => {
    connectCam();
    res.status(200).send("Reinitialized connecting to Cam.");
});


app.get('/left', (req,res) => {
    move(-0.1,0,0);
    res.sendStatus(200);
});

app.get('/right', (req,res) => {
    move(0.1,0,0);
    res.sendStatus(200);
});

app.get('/up', (req,res) => {
    move(0,0.1,0);
    res.sendStatus(200);
});

app.get('/down', (req,res) => {
    move(0,-0.1,0);
    res.sendStatus(200);
});

app.get('/zoomin', (req,res) => {
    move(0,0,0.1);
    res.sendStatus(200);
});

app.get('/zoomout', (req,res) => {
    move(0,0,-0.1);
    res.sendStatus(200);
});

app.get('/pos', (req,res) => {
    if(g_cam_obj) {
        printPosition(res);
    } else {
        res.sendStatus(404);
    }
});

app.get('/uri', (req,res) => {
   if(g_cam_obj) {
    getUris(res);
    res.sendStatus(200);
   } else {
    res.sendStatus(404);
   }
});

app.get('/test', (req, res) => {
    console.log("Test Successful");
    res.status(200).send("TEST");
});

app.listen(listenPort, () => {
    console.log("onvif CCTV PTZ WebServer Ready!");
    connectCam();
});


// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })