var messagesRef = new Firebase('https://onlab.firebaseio.com/');

//the unique id
var uuid=generateUUID();
//The sensor's values
var accelerationX = null;
var accelerationY = null;
var accelerationZ = null;

var rotationAlpha = null;
var rotationBeta = null;
var rotationGamma = null;

var lightSensor = null;
var proximity = null;

var geoLocationLatitude = null;
var geoLocationLongitude = null;


// --- Accelerometer and Rotation
if (window.DeviceMotionEvent != undefined) {
    window.ondevicemotion = function (e) {
        accelerationX = e.accelerationIncludingGravity.x;
        accelerationY = e.accelerationIncludingGravity.y;
        accelerationZ = e.accelerationIncludingGravity.z;
        if (e.rotationRate) {
            rotationAlpha = e.rotationRate.alpha;
            rotationBeta = e.rotationRate.beta;
            rotationGamma = e.rotationRate.gamma;
        }
    }
}

// --- Light sensor
window.addEventListener('devicelight', function (e) {
    lightSensor = e.value;
});

// --- Proximity
window.addEventListener('deviceproximity', function (e) {
    proximity = e.value;
});


// --- GeoLocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, fail);
}

function success(position) {
    geoLocationLatitude = position.coords.latitude;
    geoLocationLongitude = position.coords.longitude;
}

function fail() {
    //No operation
}


var myInterval = setInterval(function () {
    refresh()
}, 1000);

var i = 0;
function refresh() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail);
    }
    // the actual time
    var time = new Date().getTime().toString();
    document.getElementById("version").innerHTML = uuid+" "+(i++);
    //send the data to the server
    messagesRef.push({uuid:uuid,
                      time:time,
                      accelerations: {x: accelerationX, y: accelerationY, z: accelerationZ},
                      accelerations: {x: accelerationX, y: accelerationY, z: accelerationZ},
                      rotation: {alpha: rotationAlpha,beta:rotationBeta,gamma:rotationGamma},
                      light: lightSensor,
                      proximity:proximity,
                      location:{latitude:geoLocationLatitude,longitude:geoLocationLongitude}
                    });
}

//generating unique id
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};




