// Cat GPS records are independent. Never merge points from different cats.
window.CAT_GPS_DATA=window.CAT_GPS_DATA||{
 narlia:{trackerId:'IAJVTCCE',source:'existing-Narlia-DATA'},
 dante:{trackerId:null,rawPoints:[],cleanedPoints:[],days:[]},
 amara:{trackerId:null,rawPoints:[],cleanedPoints:[],days:[]}
};
// Future tracker imports must explicitly identify the cat before populating its arrays.
