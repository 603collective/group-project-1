let parkNames =[];
let activityOptions={};
let npsData = null;
function getNPA() {
    
    const npsDataString = localStorage.getItem("group-project-1");
    if (npsDataString == null) {
        npsData = [];
    }
    else {
        npsData = JSON.parse(npsDataString);
    };
    if (npsData.length == 0) {


        // fetch request for NPS data
        const requestUrl = 'https://developer.nps.gov/api/v1/parks?limit=466&api_key=HsEM5wqh1GU0weH7jjyZ7gVkuXfcuQkccqRFaGaz';
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })

            //filter National Parks only
            .then(function (data) {
                let nationalParkNum = 0;
                let innerData = data.data;
                for (let i = 0; i < innerData.length; i++) {
                    const parkName = innerData[i].fullName.toLowerCase();
                    if (parkName.includes("national park")) {
                        npsData[nationalParkNum] = innerData[i];
                        nationalParkNum++;
                    }

                }
                
                console.log(npsData);
                localStorage.setItem("group-project-1", JSON.stringify(npsData));
                 
                processNpsData();

                



            });


    } else {processNpsData()};
    
};

getNPA();

function processNpsData(){
    for (let i=0; i < npsData.length; i++){
        const fullName= npsData[i].fullName
        parkNames.push(fullName);
        const activities=[];;
        for (let j= 0; j<npsData[i].activities.length;j++){
            const activityName=npsData[i].activities[j].name;
          activities.push(activityName);
        }
        
        activityOptions[fullName]=activities;
        
        
    }

console.log(parkNames);
console.log(activityOptions);

}