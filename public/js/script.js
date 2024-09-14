const socket=io(); // iski vajah se connectionn request backedn pe jati hai
if(navigator.geolocation){ // navigator hmare browser mei inbuilt hota hai jo hmme btata hai hmara browser kya kya kr skta hai
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;
        console.log("Emitting location", { latitude, longitude });
        socket.emit("send-location",{latitude,longitude}); // hmne ye socket emit kiya hai backend pe accept krna pdega
    },(error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000, // for timeout setting
        maximumAge:0, // for caching , 0 means koi save nahi sidha dubara data lena
    }
);
}
const map=L.map("map").setView([0,0],16); // setting a map with coordinates 0,0 pr ye hmme map ni dikhayega and zoom level 15
// map dekhne ke liye phele css set kro and
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Vansh Tech"
}).addTo(map);

// creating empty object markers
const markers={};
// markers ko front end pe dikhana hai
socket.on("recieve-location",(data)=>{
    const{id, latitude, longitude}=data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        // agr marker already hai ton update
        markers[id].setLatLng([latitude,longitude]);
    }else{
        // agr marker nhi hai ton nya bna do
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})