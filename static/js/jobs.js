//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//VIEW2

// creating an init function to display dropdown menu with list of job titles receiving all job titles from data file
const jobUrl = 'http://127.0.0.1:5000/api/v1.0/salaries'



function initJobTitlesDropdown() {
  let dropdownjobtitle = d3.select("#jobDataset");

  d3.json(jobUrl).then(function(data) {

        // Dummy predefined job titles (replace with your actual data)
        // let jobTitles = ["Software Engineer", "Data Analyst", "Data Scientist"];
        let jobTitles = data["Job Title"]; 
        
        // sort job titles alphabetically
        jobTitles.sort();

        jobTitles.forEach(function(jobTitle) {
            dropdownjobtitle.append("option").text(jobTitle).property("value", jobTitle);
        });

        handleJobTitleChange(jobTitles[0]); // Initialize with the first job title
} );

}


function loadDataForJobTitle(jobTitle) {
    const apiUrljobtitle = `http://127.0.0.1:5000/api/v1.0/job_title/${jobTitle}/top10_countries`;
  
    return fetch(apiUrljobtitle) // Corrected apiUrljobtitle variable used here
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


function handleJobTitleChange(selectedJobTitle) {
    linegraph(selectedJobTitle)
    createBubbleMap(selectedJobTitle)
  
}

initJobTitlesDropdown();

// a line graph that displays the top 10 highest paying countries by selecting JOB TITLE from Dropdown2
// API route: /api/v1.0/job_title/<job_title>/top10_countries
function linegraph(jobTitle) {
    loadDataForJobTitle(jobTitle)
    .then(data => {
      console.log(`Top 10 countries for ${jobTitle}:`, data);
      
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
        text:'Highest Paying Countries for: ' + jobTitle,
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
       
            document.querySelector("#job-line-graph").innerHTML = "";
        
      var chart = new ApexCharts(document.querySelector("#job-line-graph"), options);
      chart.render();
    
    })
    .catch(error => {
      console.error('Error handling job title change:', error);
    });
}


// an interactive bubble map that displays the top 10 highest paying countries,
// API route if you want all countries instead of only top10: /api/v1.0/job_title/<job_title>/all_countries

function createBubbleMap(jobTitle) {
    var queryUrl = `http://127.0.0.1:5000/api/v1.0/job_title/${jobTitle}/all_countries`;

    // performing a GET request to the query URL
    d3.json(queryUrl).then(function (data) {
        console.log(data);

        let salaries = [];
        let countries = [];


        let bubbleMarkers = [];

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


            const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${country}&key=`


            d3.json(apiUrl).then(function (data) {
                console.log(data);

                let lat = data.results[0].geometry.lat;
                let lon = data.results[0].geometry.lng;



            
                let bubbleMarker = L.circleMarker([lat, lon], {
                    radius: salary / 10000, // Adjust radius calculation based on salary
                    color: 'white',
                    fillColor: 'red',
                    fillOpacity: 0.6
                }).bindPopup(`<strong>Country:</strong> ${country}<br><strong>Salary (USD):</strong> ${salary}`);



                bubbleMarkers.push(bubbleMarker);
                
                createMapJob(bubbleMarkers);

            });

        }       
      

    });
}


// function to get coordinates for a country


let myJobMap;

// function to create map
function createMapJob(bubbleMarkers) {

    console.log(bubbleMarkers);
    // defining darkmap layer
    let darkmap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
    });

    if (myJobMap) {
        myJobMap.remove();
    }

    // creating a layer group made from the job title markers array, passing it into the createMapJob function
    let bubbleMapLayer = L.layerGroup();

    console.log(bubbleMarkers);
    // adding the job title markers to the layer group
    bubbleMarkers.forEach(marker => {
        bubbleMapLayer.addLayer(marker);
    });


    // creating the map with darkmap as the initial layer
    myJobMap = L.map("job-map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [darkmap, bubbleMapLayer]
    });

  

    // creating a base layers object
    let baseLayers = {
        "Dark Map": darkmap
    };

    // creating an overlay layers object
    let overlayLayers = {
        "Job Salaries": bubbleMapLayer
    };

    // adding layer control with base and overlay layers
    L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(myJobMap);
}


console.log("logic.js loaded")
 