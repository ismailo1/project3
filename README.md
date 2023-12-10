# Salaries in Data World

Project 3 - Group 1 by Ismail Omer, Yargi Kilinc, Archit Hallan, Tania Barrera

We are delighted to present Project 3, a comprehensive exploration tailored for employers, job seekers in the data realm, individuals contemplating joining a bootcamp, and esteemed global HR companies.

Our sophisticated visuals provide profound insights:

**By Selecting COUNTRY from Dropdown1**

1.	a horizontal bar chart that displays the top 10 highest-paying job titles 

> **API route:** `/api/v1.0/country/<country_name>/top10_job_titles`
> 
> **API route if you want all job titles instead of only top10:** `/api/v1.0/country/<country_name>/all_job_titles`

2.	an interactive Map displaying total number of all job titles with a popup marker (TANIA - PLS CREATE AN API ROUTE),

**By Selecting JOB TITLE from Dropdown2**

3.	a bar chart that displays the top 10 highest paying countries

> **API route:** `/api/v1.0/job_title/<job_title>/top10_countries`

4.	an interactive bubble map that displays the top 10 highest paying countries,

> **API route if you want all countries instead of only top10:** `/api/v1.0/job_title/<job_title>/all_countries`

**By Selecting EXPERIENCE LEVEL from Dropdown3**

5.	a bar chart that displays Top10 highest paying countries for that experience level 

> **API route:** `/api/v1.0/experience_level/<experience_level_name>/top10_countries`

6.	an interactive bubble map that displays the salaries for the experience level selected for all countries 

> **API route:** `/api/v1.0/experience_level/<experience_level_name>/all_countries`

![image](https://github.com/ismailo1/project3/assets/142269763/c0015b2a-1c6d-4eb8-948e-b20085f859a7)


This initiative serves as your compass for well-informed decisions in hiring, job seeking, bootcamp considerations, and global HR strategies.

![image](https://github.com/ismailo1/project3/assets/142269763/f32a5946-e8c9-4451-aab3-e94490ec2b0d)


## How to

To visualize the dashboard, clone the repository into your machine and run the app.py flask application using `python app.py` from Terminal. The Home page (i.e. `/`) will display the dashboard.

Additionaly, you can access the API via this same application. For route explanation go to the `/api/v1.0/` page.


---

## References

Head photo rights belongs to https://www.digitalvidya.com/blog/data-science-jobs/
