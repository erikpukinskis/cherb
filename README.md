Cherb is a simple Node.js chat app I wrote to start playing around with MongoDB on Heroku.

Installation
============

Install Node.js, npm, mongodb, and foreman. Start mongod and run:

    npm install
    foreman start

To deploy on Heroku just install the heroku gem and run:

    heroku create --stack cedar