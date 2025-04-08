# Curiosity Report

## An uninformed dip into the pool SQL Injection attacks.

As I looked into the chaos testing deliverable, I saw that chaos would begin at a randomly designated time for each student. Being the curious student that I am, I wanted to see if I could find that time before the event happened and thought that at the very least I would be able to learn something for my curiosity report. I will note that I have never tried any form of SQL injection before this, and have only learned about them briefly in other classes. I might have been wiser to try this after the penetration testing deliverable but the timing didn't work for that.

## Stages

-   Initial Research of SQL Injection
-   Vulnerability analysis
-   Attempted Attack
-   Analysis

> Initial Research of SQL Injection:
> I've heard briefly about various website attack strategies before. DDOS and SQL Injection are some popular ones, and I very basically know the gist of the attack. I learned in CS 240 that SQL sanitation needs to take place and that you should never just dump whatever input a user gives you into a sql statement. While looking online, I saw that if you are able to find a compromised sql statement on a website, you can add another sql statement by using an input like, "or 1=1; SELECT _ FROM [TABLE] WHERE [CONDITION]; --" This is because adding the initial 1=1 would fit into other sql statements, for example if you put a username in an input and the SQL resolves to, "SELECT _ FROM USERS WHERE username=" then you can set that to true and insert whatever you'd like afterwards.

> Vulnerability analysis:
> Now that I knew the theory behind sql injection, I needed to find my way in to the database through a poorly designed input. I noticed that the repositories for all class tools are public on GitHub, so I could use these to analyze and search for vulnerabilities. As I analyzed the sql statements in database.js, I saw the question marks that I thought would possibly be avenues for attack. I thought I remembered something about them being safe but I couldn't quite remember.

> Attempted Attack:
> I decided to try and select all records from the chaos table by using the login. I added sql queries to the username and password fields but kept getting an unauthorized error. I then tried from the terminal, with a curl command straight to the login endpoint with a valid authentication token. I continually got this same error and wasn't able to figure it out. Eventually, I decided that my attacks weren't going to work and I went about my business. (Chaos went fine regardless of the fact that I wasn't able to find out my time beforehand. Rest assured that had I found out my time I would have still completed the assignment in its entirety. I thought that it would be a fun attempt for my curiosity assignment before properly learning about it in the final deliverable.)

> Analysis:
> After my chaos testing deliverable finished, I decided to see why my attack was unsuccessful. The first mistake was that had I been able to access the class database, I hadn't yet said on the autograder that I was ready for chaos so no entry would have been in the table for me anyway. I also found out that the '?' in the queries that I was unsure about are automatically sanitized by mysql so that is possibly why my query didn't go through. This explains the error response as whatever I typed could have been treated normally and still wouldn't be a valid login in the database. While this is one way to keep your data safe, I believe that a fully secure application will have layers of prompt validation in multiple different parts of the code to ensure that nefarious prompts don't make it that deep in your system. Checking in the front end, services, middleware, and finally right before your query is executed is a way to make sure that you beat the hackers at their own game. This is something that I hope to refine and use against my teammate in the penetration testing assignment.

All this to say that had the school sanitized their queries, Bobby Drop Tables wouldn't have been successful and would have led that child to a life of misery with a name like that.
