# ECOMMERCE STORE API 


#### Motivation

My motivation for this project was mainly to push myself farther than I had ever gone before as a self- taught   software developer. Before working on this project I had only ever worked on smaller sample projects and while I learnt something from each of them I had never really gone out of my comfort zone.

Building this project served to push me ahead and also  the project provides a real world solution to the problem of product shopping, especially in these times where it seems everything has gone virtual and is now done over the internet without the need to step out.

The most important thing I learnt here was mainly the fact that while we as developer’s love to build exciting stuff, we must never forget that at the end of the day we are building for real people and so we have to make the project as accessible and easily understood as possible.

Also I had to learn to sit back and actually plan, draw schema’s and write out project todo’s  that sketched out the whole project in a wide overview before actually setting out to code to minimize the number of mistakes I made earlier on and also to help me foresee roadblocks and issue’s that might crop up later in the process.


### Features:
Method : Token Authentication
-   Products route
-   “New this week”  product route 
-	Cart routes
-	Favorites product route
-   Product search routes
-   Application Users (signup and login) routes
-   Product reviews route


#### Future Plans:

1. Real-time customer service app
2. Cron job to automatically delete carts that have been inactive for a number of days


#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value
5. Add JWT_SECRET value
6. Add JWT_LIFETIME value

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit


