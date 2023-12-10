// storing url for json data
const url = 'http://127.0.0.1:5000/api/v1.0/salaries'
// console log to make sure the data is being read **only for testing**
// console.log(url);

// define myMap
// let myMap;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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




//function to create features to be used in the interactive map
function createFeatures(datascienceData) {
   

    // function to run once for each data in the array
    function onEachFeature(data, layer) {
        // giving each feature a popup describing the job title, company location, salary and expertise level
        layer.bindPopup("<h3>" + data["Job Title"] + "</h3><hr><p>" + data["Company Location"] + "</p><hr><p>" + data["Salary"] + "</p><hr><p>" + data["Expertise Level"] + "</p>");
    }

    // creating a GeoJSON layer containing the features array on the datascienceData object
    function pointToLayer(data, jobTitleCount) {
        let options = {
            radius: data["Salary"] / 10000,
            fillColor: getColor(data["Salary"]),
            color: getColor(data["Salary"]),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        return L.circleMarker(jobTitleCount, options);
    }

    // creating a variable for the GeoJSON layer
    let datascience = L.geoJSON(datascienceData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // sending the datascience layer to the createMap function
    createMap(datascience);
    
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
    
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon } = data[0]; // Extract latitude and 

                const center = [lat, lon];
            
                
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

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
// creating an init function to display dropdown menu with list of job titles, receiving all job titles from data file, and calling functions when job title is changed
function init2() {
    // getting each job title and appending to dropdown menu
    d3.json(url).then(function(data) {
        // console.log(data);
        // creating dropdown menu with list of Job Title
        let dropdown = d3.select("#selDataset");
        // receiving all job titles from Job Title in data file
        let jobtitles = data["Job Title"];
        // getting each job title and appending to dropdown menu
        jobtitles.forEach(function(jobtitle) {
            dropdown.append("option").text(jobtitle).property("value", jobtitle);           
        });
        // calling functions when job title is changed selected
        secondviewvalues(jobtitles[0]);
        console.log(jobtitles[0]);
    }
    )};
    // creating an optionChanged function when job title is changed by user and calling functions when job title is changed
    function optionChanged(passedjobtitle) {
        secondviewvalues(passedjobtitle);
    };  

init2();

// creating a function to be used to display vertical bar chart and line graph
function secondviewvalues(passedjobtitle) {
    // fetch json data using d3 and console log
    d3.json(url).then(function(data) {
        console.log(data);
        // get job title data
        let jobtitles = data["Job Title"];
        console.log(jobtitles);
        // filter data for the job title selected
        let filteredjobtitle = jobtitles.filter(jobtitle => jobtitle === passedjobtitle);
        // get data for bar chart
        let filteredjobtitledata = filteredjobtitle[0].filteredjobtitledata;
        console.log(filteredjobtitledata);
            
        // calling function to display vertical bar chart
        verticalbarchart(filteredjobtitledata);
        // calling function to display line graph
        linegraph(filteredjobtitledata);
    });
};


        
// Creating a function for a Bar Chart that dynamically updates upon selecting a job title, unveiling the top 10 highest-paying countries in ascending order
function verticalbarchart(filteredjobtitledata) {
    console.log(filteredjobtitledata);
        
    // Counting the total number of each country
    let countryCount = {};
    filteredjobtitledata["Company Location"].forEach(function(country) {
        countryCount[country] = (countryCount[country] || 0) + 1;
    });
        
    // Creating the bar chart
    let tracebarchart = {
        x: Object.values(countryCount),
        y: Object.keys(countryCount),
        type: "bar",
        orientation: "h"
    };
    let databarchart = [tracebarchart];
    let layoutbarchart = {
        title: "Top 10 Highest-Paying Countries for " + filteredjobtitledata["Job Title"],
        xaxis: {title: "Salary (USD)"},
        yaxis: {title: "Country"}
    };
    Plotly.newPlot("bar", databarchart, layoutbarchart);
};

// Creating a function for a Line Graph that updates upon selecting a job title, unveiling the increase of salary level in percentage
function linegraph(filteredjobtitledata) {
    console.log(filteredjobtitledata);
        
    // Creating the line graph
    let tracelinegraph = {
        x: filteredjobtitledata["Years of Experience"],
        y: filteredjobtitledata["Salary"],
        type: "line"
    };
    let datalinegraph = [tracelinegraph];
    let layoutlinegraph = {
        title: "Salary Level for " + filteredjobtitledata["Job Title"],
        xaxis: {title: "Years of Experience"},
        yaxis: {title: "Salary (USD)"}
    };
    Plotly.newPlot("line", datalinegraph, layoutlinegraph);
}


*/

console.log(asmndbasf);
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of expertise levels receiving all expertise levels from data file
/*
function init3() {
    // getting each job title and appending to dropdown menu
    d3.json(url).then(function(data) {
        // console.log(data);
        // creating dropdown menu with list of Expertise Level
        let dropdown = d3.select("#selDataset");
        // receiving all expertise levels from Expertise Level in data file
        let expertises = data["Expertise Level"];
        // getting each expertise level and appending to dropdown menu
        expertises.forEach(function(expertise) {
            dropdown.append("option").text(expertise).property("value", expertise);
        });
    });

        // calling function when first expertise level is selected
        thirdchartvalues(expertises[0]);
        console.log(expertises[0]);       
};

// creating an optionChanged function when expertise level is changed by user and calling functions when expertise level is changed
function optionChanged(passedexpertise) {
    thirdchartvalues(passedexpertise);
};

init3();

// creating a function to be used to display line chart featuring salary against job title with individual salary dots that updates upon selecting an expertise level and another line chart that shows the correlation between experience level and salary
function thirdchartvalues(passedexpertise) {
    // fetch json data using d3 and console log
    d3.json(url).then(function(data) {
        console.log(data);
        // filter data for the expertise level selected
        let filteredexpertisedata = data.Data.filter(function(entry) {
            return entry["Expertise Level"] === passedexpertise;
        });
        // get data for line chart
        let filteredexpertisedata2 = filteredexpertisedata[0].filteredexpertisedata;
        console.log(filteredexpertisedata2);
        // calling function to display line chart
        linechart(filteredexpertisedata2);
    });
}
    
// Creating a function for a Line Chart featuring salary against job title with individual salary dots that updates upon selecting an expertise level
function linechart(filteredexpertisedata2) {
    console.log(filteredexpertisedata2);
        
    // Creating the line chart
    let tracelinechart = {
        x: filteredexpertisedata2["Job Title"],
        y: filteredexpertisedata2["Salary"],
        mode: "markers+lines"
    };
    let datalinechart = [tracelinechart];
    let layoutlinechart = {
        title: "Salary for " + filteredexpertisedata2["Expertise Level"],
        xaxis: {title: "Job Title"},
        yaxis: {title: "Salary (USD)"}
    };
    Plotly.newPlot("line", datalinechart, layoutlinechart);
}


// Creating a line chart that shows the correlation between experience level and salary
function linechart2(filteredexpertisedata2) {
    console.log(filteredexpertisedata2);
        
    // Creating the line chart
    let tracelinechart2 = {
        x: filteredexpertisedata2["Years of Experience"],
        y: filteredexpertisedata2["Salary"],
        mode: "markers+lines"
    };
    let datalinechart2 = [tracelinechart2];
    let layoutlinechart2 = {
        title: "Salary for " + filteredexpertisedata2["Expertise Level"],
        xaxis: {title: "Years of Experience"},
        yaxis: {title: "Salary (USD)"}
    };
    Plotly.newPlot("line", datalinechart2, layoutlinechart2);
}

// console log linechart here
console.log(linechart);
// console log linechart2 here
console.log(linechart2);
// console log filteredexpertisedata2 here
console.log(filteredexpertisedata2);
// console log passedexpertise here
console.log(passedexpertise);
// console log filteredexpertisedata here
console.log(filteredexpertisedata);
// console log expertise here
console.log(expertise);


// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
