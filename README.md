> # It is a work in progress!

# Super Power BI Refresher

A web application that aggregates all the refreshable datasets from a personal workspace (called [*My Workspace*](https://docs.microsoft.com/en-us/power-bi/fundamentals/service-basic-concepts#workspaces)) for the Power BI accounts configured. Each account might represent a client in your organization, so you can fully visualize all your clients' datasets in a single place. Also, you can refresh a dataset for a specific account if required.

## Scope

..

## Installation

...

## Why you would use this application?

This tool would be really helpful when you need to monitor/handle multiple Power BI accounts. You would have all your Power BI accounts datasets in a single place so... 

# Technologies/tools used

- React + Typescript for UI.
- Web API with ASP.NET Core (C#).
- Tailwind CSS.
- SignalR.
- React Toastify.
- Tippy JS.

# Feature roadmap

- [x] When the latest refresh of a dataset has failed, show the error message as a popover.
- [x] Cache bearer tokens in the server side, so avoid fetching a brand new token for every request that goes to the Power BI Rest API.
- [x] Add License to this project.
- [x] When submitting a bulk dataset refresh, show a toast notification that says that the requests have been sent.
- [x] Enhance README. Document how to setup the application, how it works behind the scene and how can be deployed.

# Resources

- [Power BI REST API documentation](https://docs.microsoft.com/en-us/rest/api/power-bi/)
