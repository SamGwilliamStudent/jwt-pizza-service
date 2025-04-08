# Incident: 2025-04-08

## Summary

> [!NOTE]
> Today at around 11:00 AM MDT, my JWT Pizza Service experienced an outage. This was due to the factory failing which didn't allow my users to have full functionality. After trying a few things, I was able to identify a solution that helped my site regain full functionality.

```md
Between the hour of 9:30 and 11:30 MDT, 1 User experienced an outage in the pizza factory that didn't allow for full functionality. This was triggered by an unknown bug in the factory code that my service depended on.

The service is still completely reliant on the factory for verificaiton, and unless factory functionlaity is added into my service code, I would need to find a new way to remedy this solution. Possibly, providing more useful error messages would allow the user to be more informed from the front end.
```

## Detection

> [!NOTE]
> A notification was sent by Grafana at around 10 AM warning me that the normal latency levels that I had previously established were being exceeded and triggered a warning. Due to another bug in the code, it took a little bit longer to fix but the solution was eventually discovered.

```md
This incident was detected when the GRAFANA ALERTS were triggered and Sam was paged.

Factory logging wasn't implemented correctly which increased the response time by roughly 1 to 1.5 hours. Sam initially deployed what he thought was a fix, but then was unsure if his alerting was wrong or his code. After digging around he found the solution. Factory logging needs to be analyzed to ensure quick response times in the future.
```

## Impact

> [!NOTE]
> Thankfully, this issue was detected before users complained and there was no significant customer fallout.

```md
For nearly 2 hours this outage was live and affected everyone that would have been using the application. Thankfully, no users were online at the time and a developer found a fix before major issues.
```

## Timeline

> [!NOTE]
> Incident Timeline below

```md
All times are UTC.

Monday April 7

-   _3:30_ - Grafana alerts initialized and on call schedule completed
-   _4:00_ - Factory Logging altered

Tuesday April 8

-   _1:45_ - Early false alarm alert triggered due to lack of data.
-   _8:00_ - Developer initiate test traffic
-   _9:30_ - Initial Grafana latency alert triggered
-   _10:00_ - Developer investigated outage but saw no issues in factory logging
-   _11:00_ - More changes were made to factory logging logic when developer was worried he was missing something after the inital alarm.
-   _11:30_ - Developer decided to check http logs
-   _11:45_ - URL discovered and chaos was solved.
```

## Response

> [!NOTE]
> Sam responded to this incident starting at around 9:00

```md
After receiving a page around 9:30 AM, Sam came online at 9:35 in {SYSTEM WHERE INCIDENT INFO IS CAPTURED}.
```

## Root cause

> [!NOTE]
> Issues with the factory integration can be better resolved.

```md
In the future, if there is an issue that the factory is experiencing, our code should better handle that and make sure that we have proper fallback techniques.

Another update should be made to the logging to give us access through factory logs to what the issues is.
```

## Resolution

> [!NOTE]
> Chaos was solved when the engineer put a URL into the search bar which sent a message to the factory to report pizza failure.

```md
Upon recieving this http response and analzying it,

{"authorized":true,"path":"/api/order","method":"POST","statusCode":500,"reqBody":"{\"franchiseId\":1,\"storeId\":1,\"items\":[{\"menuId\":1,\"description\":\"Veggie\",\"price\":0.05}]}","resBody":"{\"message\":\"Failed to fulfill order at factory\",\"reportPizzaCreationErrorToPizzaFactoryUrl\":\"https://cs329.cs.byu.edu/api/report?apiKey=5958d93c9ec047fa813807d4777069d7&fixCode=484ade8c2f6340bc8dfff63de5feab04\"}"}

Sam put the report pizza creation error link in the nav bar which solved the issues.
```

## Prevention

> [!NOTE]
> To prevent another slow response to a factory outage, factory logging needs to be improved.

```md
I was logging the wrong thing from factory and found the issue through the https logs. I would have found it far faster if the response from the factory was being logged in its entirety. I mistakenly logged part of the request.
```

## Action items

> [!NOTE]
> Sam will work to improve factory logging.

```md
1. Improve factory logging
1. Introduct failsafe in case of factory outage.
```
