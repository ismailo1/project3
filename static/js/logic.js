// storing url for json data
const url = 'http://127.0.0.1:5000/api/v1.0/salaries'
// console log to make sure the data is being read **only for testing**
console.log(url);

// fetch json data using d3 and console log
d3.json(url).then(function(data) {
    console.log(data);
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of countries receiving all country names from data file
function init () {
    // User selects Country from dropdown menu
    // getting each country name and appending to dropdown menu
    d3.json(url).then(function(data) {
        // console.log(data);
        // creating dropdown menu with list of Company Location
        let dropdown = d3.select("#selDataset");
        // receiving all countries from Company Location in data file
        let countries = data["Company Location"];
        // getting each country name and appending to dropdown menu
        countries.forEach(function(country) {
            dropdown.append("option").text(country).property("value", country);           
        });
        // calling function when first country is selected
        firstchartvalues(countries[0]);
        console.log(countries[0]);       
    }
    )};

// creating an optionChanged function when country is changed by user and calling functions when country is changed
function optionChanged(passedcountry) {
    firstchartvalues(passedcountry);
};

console.log("init");

// creating a function to be used to display horizontal bar chart and interactive map
function firstchartvalues(passedcountry) {
    // fetch json data using d3 and console log
    d3.json(url).then(function(data) {
        console.log(data);
        // get country names data
        let countries = data["Company Location"];
        // filter data for the country selected
        let filteredcountry = countries.filter(country => country === passedcountry);
        // get data for bar chart
        let filteredcountrydata = filteredcountry[0].filteredcountrydata;
        console.log(filteredcountrydata);
        
        // calling function to display horizontal bar chart
        horizontalbarchart(filteredcountrydata);
        // calling function to display interactive map
        map(filteredcountrydata);
    });
};

    // Creating a function for a Horizontal Bar Chart that dynamically updating upon selecting a country, unveiling the top 10 highest-paying (salaries) job titles in ascending order
function horizontalbarchart(filteredcountrydata) {
    console.log(filteredcountrydata);
    
    // Counting the total number of each job title
    let jobTitleCount = {};
    filteredcountrydata["Job Title"].forEach(function(jobTitle) {
        jobTitleCount[jobTitle] = (jobTitleCount[jobTitle] || 0) + 1;
    });
    
    // Creating the bar chart
    let tracebarchart = {
        x: Object.values(jobTitleCount),
        y: Object.keys(jobTitleCount),
        type: "bar",
        orientation: "h"
    };
    let databarchart = [tracebarchart];
    let layoutbarchart = {
        title: "Top 10 Highest-Paying Job Titles in " + filteredcountrydata["Company Location"],
        xaxis: {title: "Salary (USD)"},
        yaxis: {title: "Job Title"}
    };
    Plotly.newPlot("bar", databarchart, layoutbarchart);
};

console.log(horizontalbarchart);

    // Creating a function for an interactive Map that evolves with country selection, offering understanding of job title density and count globally
function map() {
    
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

console.log(map);

console.log("logic.js loaded");

    // init();


// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of job titles, receiving all job titles from data file, and calling functions when job title is changed
function init () {
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

    console.log("init");

    // creating a function to be used to display vertical bar chart and line graph
    function secondviewvalues(passedjobtitle) {
        // fetch json data using d3 and console log
        d3.json(url).then(function(data) {
            console.log(data);
            // get job title data
            let jobtitles = data["Job Title"];
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

// init();

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of expertise levels receiving all expertise levels from data file
function init() {
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

    console.log("init");

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
    function linechart(filteredexpertisedata) {
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

// adding init() 
init();
