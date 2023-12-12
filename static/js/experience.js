//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// VIEW3

const expUrl = 'http://127.0.0.1:5000/api/v1.0/salaries'

function initExperienceLevelsDropdown() {
  let dropdownexperiencelevel = d3.select("#expDataset");

    // Load experience levels from API
    d3.json(expUrl).then(function(data) {


  // Dummy data of experience levels
  // let experienceLevels = ["Beginner", "Intermediate", "Advanced"]; 
  let experienceLevels = data["Expertise Level"];

  experienceLevels.forEach(function(experienceLevel) {
    dropdownexperiencelevel.append("option").text(experienceLevel).property("value", experienceLevel);
  });


  handleExperienceLevelChange(experienceLevels[0]); // Initialize with the first experience level

})
}


function loadDataForExperienceLevel(experienceLevel) {


    const apiUrl = `http://127.0.0.1:5000/api/v1.0/experience_level/${experienceLevel}/top10_countries`
  
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  

function handleExperienceLevelChange(selectedExperienceLevel) {
  lineExperienceGraph(selectedExperienceLevel)
  createBubbleMap2(selectedExperienceLevel)
}

initExperienceLevelsDropdown();


// a line chart that displays Top10 highest paying countries for that experience level by selecting EXPERIENCE LEVEL from Dropdown3
// API route: /api/v1.0/experience_level/<experience_level_name>/top10_countries
function lineExperienceGraph(experience) {
    loadDataForExperienceLevel(experience)
    .then(data => {
      console.log(`Top 10 Experience for ${experience}:`, data);
      
    let salaries = [];
    let countries = [];

    for (let key in data.max_salary) {
        if (data.max_salary.hasOwnProperty(key)) {
            salaries.push(data.max_salary[key][1]);
            countries.push(data.max_salary[key][0]);
        }
    }

      

      var options = {
        series: [{
          name: "Salary (USD)",
          data: salaries
      }],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text:'Highest Paying Countries for Expertise: ' + experience,
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: countries,
      }
      };

      // remove previous chart if it exists
       
            document.querySelector("#experience-line-chart").innerHTML = "";
        
      var chart = new ApexCharts(document.querySelector("#experience-line-chart"), options);
      chart.render();
    
    })
    .catch(error => {
      console.error('Error handling job title change:', error);
    });
}

// an interactive bubble map that displays the salaries for the experience level selected for all countries
// API route: /api/v1.0/experience_level/<experience_level_name>/all_countries

function createBubbleMap2(experienceLevel2) {
  var queryUrl2 = `http://127.0.0.1:5000/api/v1.0/experience_level/${experienceLevel2}/all_countries`
  

  // performing a GET request to the query URL
  d3.json(queryUrl2).then(function (data) {
      console.log(data);

      let salaries = [];
      let countries = [];


      let bubbleMarkers2 = [];

      for (let key in data.max_salary) {
          if (data.max_salary.hasOwnProperty(key)) {
              let salary = data.max_salary[key][1];
              let country = data.max_salary[key][0];

              salaries.push(salary);
              countries.push(country);

          }
      }

      // creating a marker for each country
      for (let i = 0; i < countries.length; i++) {

          let salary = salaries[i];
          let country = countries[i];
  


          const apiUrl2 = `https://api.opencagedata.com/geocode/v1/json?q=${country}&key=`


          d3.json(apiUrl2).then(function (data) {
              
            const {lat, lng} = data.results[0].geometry;

              



          
              let bubbleMarker2 = L.circleMarker([lat, lng], {
                  radius: salary / 10000, // Adjust radius calculation based on salary
                  color: 'white',
                  fillColor: 'purple',
                  fillOpacity: 0.6
              }).bindPopup(`<strong>Country:</strong> ${country}<br><strong>Salary (USD):</strong> ${salary}`);



              bubbleMarkers2.push(bubbleMarker2);
              
              createMapExperience(bubbleMarkers2);

          });

      }       
    

  });
}


// function to get coordinates for a country


let myExperienceMap;

// function to create map
function createMapExperience(bubbleMarkers2) {


  // defining darkmap layer NO
  // changing map to streetmap for a better view
  let darkmap2 = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: `&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors`
});

  if (myExperienceMap) {
      myExperienceMap.remove();
  }

  // creating a layer group made from the job title markers array, passing it into the createMapJob function
  let bubbleMapLayer2 = L.layerGroup();


  // adding the job title markers to the layer group
  bubbleMarkers2.forEach(marker => {
      bubbleMapLayer2.addLayer(marker);
  });


  // creating the map with darkmap as the initial layer
  myExperienceMap = L.map("experience-map", {
      center: [37.09, -95.71],
      zoom: 3,
      layers: [darkmap2, bubbleMapLayer2]
  });



  // creating a base layers object
  let baseLayers2 = {
      "Dark Map2": darkmap2
  };

  // creating an overlay layers object
  let overlayLayers2 = {
      "Job Salaries2": bubbleMapLayer2
  };

  // adding layer control with base and overlay layers
  L.control.layers(baseLayers2, overlayLayers2, { collapsed: false }).addTo(myExperienceMap);
}


console.log("logic.js loaded")