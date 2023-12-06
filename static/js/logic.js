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
function map(filteredcountrydata) {

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

console.log("logic.js loaded");

init();

    // getting value of selection and updating views of horizontal bar chart and interactive map


// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of job titles receiving all job titles from data file
    // User selects Job Title from dropdown menu
    // Creating a Bar Chart that dynamically updates upon selecting a job title, unveiling the top 10 highest-paying countries in ascending order
    // Creating a Line Graph that dynamically updates upon selecting a job title, unveiling the increase of salary level in percentage
    // getting each job title and appending to dropdown menu

    // creating an optionChanged function when job title is changed by user and calling functions when job title is changed
    // getting value of selection and updating views of bar chart and line graph

// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// creating an init function to display dropdown menu with list of expertise levels receiving all expertise levels from data file
    // User selects Expertise Level from dropdown menu
    // Creating a function for a Line Chart featuring salary against job title with individual salary dots that dynamically updates upon selecting an expertise level
    // Creating a line chart that shows the correlation between experience level and salary
    // getting each expertise level and appending to dropdown menu

    // creating an optionChanged function when expertise level is changed by user and calling functions when expertise level is changed
    // getting value of selection and updating views of both line charts

// console log init here
// console.log("init");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// adding init() 
// init();
