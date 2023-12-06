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
    d3.json(url).then(function(data) {
        // get country names data
        let countries = data["Company Location"];
        // filter data by country selected
        let filteredcountry = data.filter(row => row["Company Location"] === passedcountry);
        let filteredcountrydata = filteredcountry[0];
        console.log(filteredcountrydata);
        // calling function to display horizontal bar chart
        horizontalbarchart(filteredcountrydata);
        // calling function to display interactive map
        map(filteredcountrydata);
    });
};

init();


    // Creating a function for a Horizontal Bar Chart that dynamically updating upon selecting a country, unveiling the top 10 highest-paying job titles in ascending order
    // Creating an interactive Map that evolves with country selection, offering a nuanced understanding of job title density and count globally
    // User selects Country from dropdown menu


 
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
