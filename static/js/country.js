// storing url for json data
const url = 'http://127.0.0.1:5000/api/v1.0/salaries'
// console log to make sure the data is being read **only for testing**
// console.log(url);

// define myMap
// let myMap;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// VIEW1

// creating an init function to display dropdown menu with list of countries receiving all country names from data file
function initCountriesDropdown() {
 
    // User selects Country from dropdown menu
    // getting each country name and appending to dropdown menu
    d3.json(url).then(function(data) {
        console.log(data);
        // creating dropdown menu with list of Country
        let dropdown = d3.select("#selDataset");
        // receiving all country names from countries in data file
        let countries = data["Company Location"];
        // sort countries alphabetically
        countries.sort();
        // getting each country name and appending to dropdown menu
        countries.forEach(function(country) {
            dropdown.append("option").text(country).property("value", country);
        });
        // calling function when first country is selected
        handleCountryChange(countries[0]);
        console.log(countries[0]);
    });
};

initCountriesDropdown();

// defining a function to be used to display a Horizontal Bar Chart that updates upon selecting a country, and x-axis giving top 10 highest paying salaries and y-axis giving these job titles in ascending order
function horizontalbarchart(salariesArray, passedcountry) {

    const top10salariesURL = `http://127.0.0.1:5000/api/v1.0/country/${passedcountry}/top10_job_titles`
    // fetch json data using d3 and console log

    d3.json(top10salariesURL).then(function(data) {
        console.log(data);
        let salaries = [];
        let jobTitlesArray = [];
        for (let key in data.max_salary) {
            if (data.max_salary.hasOwnProperty(key)) {
                salaries.push(data.max_salary[key][1]);
                jobTitlesArray.push(data.max_salary[key][0]);
            }
        }
        console.log(salaries);
        console.log(jobTitlesArray);
    
        var options = {
            series: [{
              name: "Salary (USD)",
              data: salaries
            }],
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
              }
            },
            title: {
              
                text:`Highest Salary Job Titles for: ${passedcountry}`,
                align: 'left'
              },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: jobTitlesArray,
              title: {
                text: 'Salaries in USD', // Label for X-axis
                style: {
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Arial, sans-serif'
                }
              }
            },
            yaxis: {
                title: {
                  text: 'Job Titles', // Label for Y-axis
                  style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Arial, sans-serif',
                    margin: 20

                  }
                }
              },
            colors: ['#FF5733', '#337DFF', '#33FF57', '#FF33E6', '#FFFF33', '#33FFFF', '#8A2BE2', '#FF8C00', '#00CED1', '#FF1493'], // Ten different hexadecimal color codes
          };
          
    
          
      const countryBarElement = document.querySelector("#country-bar");
        countryBarElement.innerHTML = "";
      var chart = new ApexCharts(countryBarElement, options);
      chart.render();

    });
    
}

// Move the horizontalbarchart function outside of the handleCountryChange function
function handleCountryChange(passedcountry) {

    top10salaries(passedcountry);
    JobTitlesAndCount(passedcountry);
}

function top10salaries(passedcountry) {
    d3.json(url).then(function(data) {
        console.log(data);
        // filter data for the country selected
        let filteredcountrydata = data.Data.filter(function(entry) {
            return entry["Company Location"] === passedcountry;
        });
        // console.log(filteredcountrydata);
        if (filteredcountrydata.length > 0) {
            // Extracting salaries for the selected country
            let salariesArray = filteredcountrydata.map(entry => entry["Salary in USD"]);
            horizontalbarchart(salariesArray, passedcountry);
        // // calling function to display interactive map
            // createMap(filteredcountrydata);    
        } else {
            console.log("No data available for the selected country.");
        }
    });
}


// creating a function to determine the color of the marker based on the salary
function getColor(salary) {
    switch (true) {
        case salary > 200000:
            return "#FF0000";
        case salary > 150000:
            return "#FFA500";
        case salary > 100000:
            return "#FFFF00";
        case salary > 50000:
            return "#008000";
        case salary > 25000:
            return "#0000FF";
        default:
            return "#4B0082";
    }
}

// Creating a function for an interactive Map that evolves with country selection, offering understanding of job title density and count globally

//get jobs titles and count
function JobTitlesAndCount(passedcountry) {
    const jobTitlesURL = `http://127.0.0.1:5000/api/v1.0/country/${passedcountry}/job_title_counts`

    d3.json(jobTitlesURL).then(function(data) {
        console.log(data);

        let count = 0;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {

                   count+= data[key].count
            
                }
            }
        createMap(count, passedcountry);
    }

    )

}

let myMap;
function createMap(count, passedcountry) {
    // Adding a tile layer (the background map image) to our map
    let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: `&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors`
    });

    // defining a basemaps object to hold our base layers
    let baseMaps = {
        "Street Map": streetmap
    };


    // Creating our map, giving it the streetmap and jobTitleMarkers layers to display on load

    if (myMap) {
        myMap.remove();
    }

    createMapUI(passedcountry, streetmap, baseMaps,count);


};


function createMapUI(countryName, streetmap, baseMaps, count) {
    
  //  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}`;

  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${countryName}&key=`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data) {
                console.log(data.results);
                const { lat, lng } = data.results[0].geometry; // Extract latitude and 

                const center = [lat, lng];
            
                
                    // Creating a layer group to hold markers for job titles
                    let jobTitleMarkers = L.layerGroup();

                    
                        const marker = L.marker(center)
                            .bindPopup(`Total Jobs in ${countryName}: ${count}`)
                            .addTo(jobTitleMarkers);
                



                    // Adding jobTitleMarkers to the overlayMaps
                    let overlayMaps = {
                        "Job Titles": jobTitleMarkers
                    };

               
                myMap = L.map("country-map", {
                    center: center,
                    zoom: 2,
                    layers: [streetmap, jobTitleMarkers]
                });

                // Creating a layer control
                // Passing in our baseMaps and overlayMaps
                // Adding the layer control to the map
                L.control.layers(baseMaps, overlayMaps, {
                    collapsed: false
                }).addTo(myMap);

            } else {
                console.error('Country coordinates not found');
            }
        })
        .catch(error => console.error('Error fetching country coordinates:', error));
}

// console.log(map);

console.log("logic.js loaded");





