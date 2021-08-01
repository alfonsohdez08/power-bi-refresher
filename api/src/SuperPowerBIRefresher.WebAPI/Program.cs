using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using SuperPowerBIRefresher.WebAPI;
using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using SuperPowerBIRefresher.WebAPI.Data;
using System.Collections.Generic;

const string CorsPolicyName = "Super_Cors_Policy";

var builder = WebApplication.CreateBuilder(args);

var powerBIAccounts = new PowerBIAccounts();
builder.Configuration.GetSection("PowerBIAccounts").Bind(powerBIAccounts);

builder.Services.AddSingleton(powerBIAccounts);
builder.Services.AddSignalR();

var corsOrigins = new List<string>();
builder.Configuration.GetSection("AllowedOrigins").Bind(corsOrigins);

builder.Services.AddCors(corsOptions =>
{
    corsOptions.AddPolicy(CorsPolicyName, corsPolicyBuilder =>
    {
        corsPolicyBuilder.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins(corsOrigins.ToArray());
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors(CorsPolicyName);

app.MapGet("/", () => "Hello World!");

app.MapGet("/dataset-refresh-statuses", () => Enum.GetValues<RefreshStatus>().Select(r => r.ToString()));

app.MapPost("/refreshes", async ([FromServices] PowerBIAccounts accounts, [FromBody] RefreshDatasetRequest[] requests) =>
{
    var accountIds = new HashSet<string>(requests.GroupBy(r => r.AccountId).Select(r => r.Key));

    var accountApiClients = new Dictionary<string, PowerBIApiClient>();
    foreach (var account in accounts.Accounts)
        if (accountIds.Contains(account.Id))
            accountApiClients[account.Id] = PowerBIApiClient.Create(account);

    foreach (var request in requests)
        await accountApiClients[request.AccountId].RefreshDataset(request.DatasetId);
});

#if DEBUG

app.MapGet("/accounts-datasets", async ([FromServices] PowerBIAccounts accounts) =>
{
    var accountsDatasets = new List<AccountDatasets>();

    foreach (var apiClient in PowerBIApiClient.Create(accounts.Accounts))
    {
        var account = apiClient.Account;
        accountsDatasets.Add(new AccountDatasets()
        {
            AccountId = account.Id,
            AccountDisplayName = account.DisplayName,
            Datasets = await apiClient.GetDatasets()
        });
    }

    return accountsDatasets;
});

#endif

app.MapHub<AccountDatasetHub>("/account-dataset-hub");

app.Run();