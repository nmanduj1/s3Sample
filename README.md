# Upsolved s3 Sample
This is a small Koa server that generates certificates.  It then compiles these plus any requested images into a pdf and uploads this pdf through the AWS-SDK to S3. It uses Node 10.13.0 and Koa 2.

## Set up
To run this project locally || Check it out on Heroku!

Locally:
1. First run `yarn` to install dependencies.
2. Add `.env` file with emailed variables.
3. Run `yarn start` to initialize server.

Heroku:
1. Skip all previous steps
2. Head to Sample Requests!

## Try it out!
The Koa server has a route at /certificates/generate that accepts the following parameters:
* firstName (String)
* lastName (String)
* title (String)
* urlArray (Array of Strings)

## Sample Requests
Below are some local sample requests:
* ``` curl 'http://localhost:3001/certificates/generate?firstName=Sandy&lastName=Russell&title=Underwater%20Basket%20Weaving&urlArray=https://i.ytimg.com/vi/Z6tf5l_6zJw/maxresdefault.jpg&urlArray=http://images.bwog.com/wp-content/uploads/2011/11/underwater-basket-weaving-300x225.jpeg' ```

* ``` curl 'http://localhost:3001/certificates/generate?firstName=Rosy&lastName=McDonald&title=Advanced%20Pumpkin%20Carving&urlArray=https://www.teambonding.com/wp-content/uploads/2014/09/seasonal-team-building-pumpkin-carving.jpg&urlArray=https://cdn.onekindesign.com/wp-content/uploads/2017/10/Creative-Halloween-Pumpkin-Carving-Ideas-022-1-Kindesign.jpg' ```

Below are the same requests made to Heroku:
* ``` curl 'https://s3-sample-project.herokuapp.com/certificates/generate?firstName=Sandy&lastName=Russell&title=Underwater%20Basket%20Weaving&urlArray=https://i.ytimg.com/vi/Z6tf5l_6zJw/maxresdefault.jpg&urlArray=http://images.bwog.com/wp-content/uploads/2011/11/underwater-basket-weaving-300x225.jpeg' ```

* ``` curl 'https://s3-sample-project.herokuapp.com/certificates/generate?firstName=Rosy&lastName=McDonald&title=Advanced%20Pumpkin%20Carving&urlArray=https://www.teambonding.com/wp-content/uploads/2014/09/seasonal-team-building-pumpkin-carving.jpg&urlArray=https://cdn.onekindesign.com/wp-content/uploads/2017/10/Creative-Halloween-Pumpkin-Carving-Ideas-022-1-Kindesign.jpg' ```
