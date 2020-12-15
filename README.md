Repo for Fuzzy Trader Home Broker web application.

This was originally a project for an employee selection process at bxblue / Brazil.

The webapp runs on Heroku.

# 1
I first decided to code with Javascript and use a NodeJS web server. Maybe Rails would be nice but there had been many years since I ran the first tutorials.

Then, I started checking how I would automate the test of the application. After some research, I got to Jest. As it says to have mock funcionality and there are many cases with Heroku, it looked like a good choice.

But, even before writing my first simple tests, I decided to check if I would be able to run the tests on Heroku and if the mock functionality would support me.

I saw that automating tests integrated to deployment process on Heroku and using its CI workflow requires paying. As that was not the case and this is just a demo application, I went behind another option.

Studying for a while the Jest documentation, I was able to install Jest on my Heroku machine and confirm that I could run the tests through Heroku command line interface CLI! A very useful feature! Even though I could find out how to do it with little effort, I have to say that I lost hours searching why the command 'jest' threw a bash 'command not found' error. That was not on internet and I had to find that out by myself: "Restart all dynos"! So write it down if you need to run Jest on Heroku CLI!

After getting confident Jest would fit my needs, I was ready to start coding.

# 2
I then began the TDD writing tests for database operations. It was really hard to make it work as the database operations are all asynchronous (restdb). I was beaten hard by Jest, but at last I could win this first battle and my tests became all green! o/

So, I am now uploading this code to Github and making my first commit to master.

The next fight with Jest will be testing the financial API, mocking Javascript functions.

# 3
Ok, automating tests of the assets quotation API was easy. I didn't mock anything, as I tested only the API operation. Mocking will be used to test application rules based on assets prices. That's what will come next.

# 4
Finished automating tests for all the application. The main functions uses the DB and assets modulos, this last one has been mocked with fixed assets prices/quotations.

It was really hard to automate the test of high level operations (exposed to the application) as they are essentially asynchronous. Again, I had to struggle with Jest. Fortunately, all my tests are green! I am covering all the expected operations of the application. Yes, I made the screen prototype.

# 5
Next step is to connect the application (HTML page) to my functions and provide some front end automated tests to guarantee it is working fine (maybe Selenium).

# 6
Done! App page connecting to tested services through the NodeJS server. Lost to much time changing the list operations to be recursive and bring all prices at once.
Finally, I couln't dinamically set messages on the page and didn't have time to finish the automated integration test with Selenium.
One real problem with this app is that the quotation API (alphavantage.co) often blocks my requests and I don't get prices! In these cases, I am setting prices to 999.99 and avoiding trades. After some 15 ou 20 seconds, the service allows me more requests.

