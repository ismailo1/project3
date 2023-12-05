// storing url for json data
url = 'http://127.0.0.1:5000/api/v1.0/salaries'
// console log to make sure the data is being read **only for testing**
d3.json(url).then(
    // if promise is fulfilled:
    (data) => console.log(data),
    // if promise is rejected:
    () => console.log('data failed to load')
);
// fetch json data using d3 and console log

// creating a function to display dropdown menu
    // creating dropdown menu with list of countries
    // receiving all country names from data file
    // getting each country name and appending to dropdown menu

    // calling functions when first country is selected

// creating a function when country is changed by user
    // getting value of selection
    // calling functions when country is changed

// console log here

// adding init() to check html page is working **only for testing**
// init();

// creating a function to display dropdown menu
    // fetch json data using d3 and console log
    // creating dropdown menu Expertise level




    // Creating a function for a Horizontal Bar Chart that dynamically updating upon selecting a country, unveiling the top 10 highest-paying job titles in ascending order

    // Creating an interactive Map that evolves with country selection, offering a nuanced understanding of job title density and count globally

    // Creating a Bar Chart that dynamically updates upon selecting a job title, unveiling the top 10 highest-paying countries in ascending order

    // Creating a Line Graph that dynamically updates upon selecting a job title, unveiling the increase of salary level in percentage

    // Creating a Line Chart featuring two lines—salary against job title with individual salary dots, and a second line delineating the correlation between experience level and salary

    // Creating a Line chart that shows the correlation between experience level and salary
