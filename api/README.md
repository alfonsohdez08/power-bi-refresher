# Super Power BI Refresher API

This is a simple ASP.NET Core Web API that acts as a wrapper for the Power BI Rest API. It allows you perform the following operations:

- Get all the dataset refresh statuses.
- Get all the datasets - including its latest refresh information - for the Power BI accounts setted up.
- Trigger a dataset refresh.

## Prerequisites

- ASP.NET Core 3.1.

## Configuration

First of all, the API interact with the Power BI Rest API on behalf of all the Power BI accounts that you plan to use. So in order to setup the accounts, please refer to the following section in the API application settings file _(appsettings.json)_:

```json
"PowerBiConfiguration": {
    "ApiClients": [
      {
        "DisplayName": "Client/Account #1",
        "PowerBiApiCredentials": {
          "ClientId": "API_CLIENT_ID",
          "Username": "ACCOUNT_USERNAME",
          "Password": "ACCOUNT_PASSWORD"
        }
      },
      {
        "DisplayName": "Client/Account #2",
        "PowerBiApiCredentials": {
          "ClientId": "API_CLIENT_ID",
          "Username": "ACCOUNT_USERNAME",
          "Password": "ACCOUNT_PASSWORD"
        }
      }
    ]
  }
```

The `PowerBiConfiguration` object has a property called `ApiClients` which holds all the accounts that would be used in the application. See the table below for a understand much better the structure of this object:

Property | Description |
---------|-------------|
`DisplayName` | It is the friendly name used to identify this account in the UI. |
`PowerBiApiCredentials.ClientId` | The API Client ID obtained when registering a Power BI application |
`PowerBiApiCredentials.Username` | The Power BI username |
`PowerBiApiCredentials.Password` | The Power BI user password |

After you have setup your Power BI accounts, then you can refer to the `AllowedOrigin` configurable property. This property would hold the URL where the UI/frontend is hosted - this value is used to build the API CORS policy.

## Installation

This is an ASP.NET Core application, so you have to choices to deploy it: as a simple console application, or as a web application in your IIS server. Just make sure you understand the configuration section above in order to setup properly the application.


