Repo for Fuzzy Trader Home Broker web application.

This was originally a project for an employee selection process at bxblue / Brazil.

The webapp runs on Heroku.

-- 1
I first decided to code with Javascript and use a NodeJS web server. Maybe Rails would be nice but there had been many years since I ran the first tutorials.

Then, I started checking how I would automate the test of the application. After some research, I got to Jest. As it says to have mock funcionality and there are many cases with Heroku, it looked like a good choice.

But, even before writing my first simple tests, I decided to check if I would be able to run the tests on Heroku and if the mock functionality would support me.

I saw that automating tests integrated to deployment process on Heroku and using its CI workflow requires paying. As that was not the case and this is just a demo application, I went behind another option.

Studying for a while the Jest documentation, I was able to install Jest on my Heroku machine and confirm that I could run the tests through Heroku command line interface CLI! A very useful feature! Even though I could find out how to do it with little effort, I have to say that I lost hours searching why the command 'jest' threw a bash 'command not found' error. That was not on internet and I had to find that out by myself: "Restart all dynos"! So write it down if you need to run Jest on Heroku CLI!

After getting confident Jest would fit my needs, I was ready to start coding.

-- 2
I then began the TDD writing tests for database operations. It was really hard to make it work as the database operations are all asynchronous (restdb). I was beaten hard by Jest, but at last I could win this first battle and my tests became all green! o/

So, I am now uploading this code to Github and making my first commit to master.

The next fight with Jest will be testing the financial API, mocking Javascript functions.
