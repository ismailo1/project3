// storing url for json data
const url = 'http://127.0.0.1:5000/api/v1.0/salaries'
// console log to make sure the data is being read **only for testing**
console.log(url);

// define myMap
// let myMap;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of countries receiving all country names from data file
function init1() {
    // User selects Country from dropdown menu
    // getting each country name and appending to dropdown menu
    d3.json(url).then(function(data) {
        console.log(data);
        // creating dropdown menu with list of Country
        let dropdown = d3.select("#selDataset");
        // receiving all country names from countries in data file
        let countries = data["Company Location"];
        // getting each country name and appending to dropdown menu
        countries.forEach(function(country) {
            dropdown.append("option").text(country).property("value", country);
        });
        // calling function when first country is selected
        firstchartvalues(countries[0]);
        console.log(countries[0]);
    });
    };


// creating an optionChanged function when country is changed by user and calling functions when country is changed
function optionChanged(passedcountry) {
    firstchartvalues(passedcountry);
};

// console.log("init1");

init1();

// defining a function to be used to display a Horizontal Bar Chart that updates upon selecting a country, and x-axis giving top 10 highest paying salaries and y-axis giving these job titles in ascending order
function horizontalbarchart(salariesArray, passedcountry) {
    // Sorting salaries in descending order
    salariesArray.sort((a, b) => b - a);
    // Selecting the top 10 highest paying salaries
    let topSalaries = salariesArray.slice(0, 10);
    // Extracting job titles for the selected salaries
    let jobTitlesArray = [];
    topSalaries.forEach(function(salary) {
        let index = salariesArray.indexOf(salary);
        jobTitlesArray.push(jobTitlesArray[index]);
    });
    // Creating the bar chart
    let tracebarchart = {
        x: topSalaries,
        y: jobTitlesArray,
        type: "bar",
        orientation: "h"
    };
    let databarchart = [tracebarchart];
    let layoutbarchart = {
        title: "Top 10 Highest-Paying Job Titles in " + passedcountry,
        yaxis: { title: "Salary (USD)" },
        xaxis: { title: "Job Title" }
    };
    Plotly.newPlot("bar", databarchart, layoutbarchart);
}


console.log(horizontalbarchart);
// calling function to display horizontal bar chart
horizontalbarchart(salariesArray, passedcountry);

// Move the horizontalbarchart function outside of the firstchartvalues function
function firstchartvalues(passedcountry) {
    // fetch json data using d3 and console log
    d3.json(url).then(function(data) {
        console.log(data);
        // filter data for the country selected
        let filteredcountrydata = data.Data.filter(function(entry) {
            return entry["Company Location"] === passedcountry;
        });

        if (filteredcountrydata.length > 0) {
            // Extracting salaries for the selected country
            let salariesArray = filteredcountrydata.map(entry => entry["Salary"]);
            
            // calling function to display horizontal bar chart
            horizontalbarchart(salariesArray, passedcountry);
            // // calling function to display interactive map
            // createMap(filteredcountrydata);
        } else {
            console.log("No data available for the selected country.");
        }
    });
}

console.log(horizontalbarchart);

// calling function to display horizontal bar chart
horizontalbarchart(salariesArray, passedcountry);

// init1();

// console log salariesArray here
console.log(salariesArray);

// console log passedcountry here
console.log(passedcountry);



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
function createMap(datascience) {
    console.log(datascience);

    // Adding a tile layer (the background map image) to our map
    let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: `&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors`
    });

    let darkmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: `Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.`
    });

    // defining a basemaps object to hold our base layers
    let baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
        
    // creating overlay object to hold our overlay layer
    let overlayMaps = {
        "Job Title Density": jobtitledensity
    };
    
    // creating our map, giving it the streetmap and jobtitledensity layers to display on load
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: [streetmap, jobtitledensity]
    });
    
            
    // creating a layer control
    // passing in our baseMaps and overlayMaps
    // adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};

// console.log(map);

console.log("logic.js loaded");





// console log init here
// console.log("init1");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

    console.log(verticalbarchart);
    console.log(linegraph);

    console.log("logic.js loaded");


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of expertise levels receiving all expertise levels from data file
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
        // get expertise level data
        let expertises = data["Expertise Level"];
        // filter data for the expertise level selected
        let filteredexpertise = expertises.filter(expertise => expertise === passedexpertise);
        // get data for line chart
        let filteredexpertisedata = filteredexpertise[0].filteredexpertisedata;
        console.log(filteredexpertisedata);
            
        // calling function to display line chart
        linechart(filteredexpertisedata);
    });
};   

    
// Creating a function for a Line Chart featuring salary against job title with individual salary dots that updates upon selecting an expertise level
function layoutlinechart2(filteredexpertisedata) {
    console.log(filteredexpertisedata);
        
    // Creating the line chart
    let tracelinechart = {
        x: filteredexpertisedata["Job Title"],
        y: filteredexpertisedata["Salary"],
        type: "line"
    };
    let datalinechart = [tracelinechart];
    let layoutlinechart = {
        title: "Salary Level for " + filteredexpertisedata["Expertise Level"],
        xaxis: {title: "Job Title"},
        yaxis: {title: "Salary (USD)"}
    };
    Plotly.newPlot("line", datalinechart, layoutlinechart);
}
// Creating a line chart that shows the correlation between experience level and salary
function linechart2(filteredexpertisedata) {
    console.log(filteredexpertisedata);
        
    // Creating the line chart
    let tracelinechart2 = {
        x: filteredexpertisedata["Years of Experience"],
        y: filteredexpertisedata["Salary"],
        type: "line"
    };
    let datalinechart2 = [tracelinechart2];
    let layoutlinechart2 = {
        title: "Salary Level for " + filteredexpertisedata["Expertise Level"],
        xaxis: {title: "Years of Experience"},
        yaxis: {title: "Salary (USD)"}
    };
    Plotly.newPlot("line", datalinechart2, layoutlinechart2);
}

console.log(linechart);
console.log(linechart2);


console.log("logic.js loaded");

// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

