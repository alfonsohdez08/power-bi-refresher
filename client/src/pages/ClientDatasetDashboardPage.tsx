import React from "react";

import PageLayout from "../components/PageLayout";
import ClientDatasetDashboard from "../components/clientDatasetDashboard";

import API from "../api/Api";
import Client from "../api/models/Client";
import Env from "../Env";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import RefreshDashboardButton from "../components/RefreshDashboardButton";
import BulkRefreshButtonsContainer from "../components/BulkRefreshButtonsContainer";

export default function ClientDatasetDashboardPage(): JSX.Element {
  const [clients, setClients] = React.useState<Client[]>([] as Client[]);
  const [refreshStatuses, setRefreshStatuses] = React.useState<string[]>(
    [] as string[]
  );
  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [refreshingDashboard, setRefreshingDashboard] = React.useState(true);

  React.useEffect(() => {
    API.getRefreshStatuses().then((statuses) => setRefreshStatuses(statuses));
  }, []);

  React.useEffect(() => {
    const newConnection: HubConnection = new HubConnectionBuilder()
      .withUrl(`${Env.ApiBaseUrl}/client-hub`)
      .build();

    newConnection.on("getClient", (client: Client) => {
      setClients((previousClients) => [...previousClients, client]);
    });

    newConnection.on("finishSendingClients", () => {
      setRefreshingDashboard(false);
    });

    setHubConnection(newConnection);

    return () => {
      console.log("disconnecting :(");
      hubConnection?.stop();
    };
  }, []);

  React.useEffect(() => {
    hubConnection?.start().then((result) => {
      console.log("Connected! :)");

      updateClientsDashboard();
    });
  }, [hubConnection]);

  React.useEffect(() => {
    if (refreshingDashboard) {
      setClients([]);
      updateClientsDashboard();
    }
  }, [refreshingDashboard]);

  const updateClientsDashboard = () => {
    if (hubConnection && hubConnection.state === HubConnectionState.Connected) {
      hubConnection?.send("GetClients");
    }
  };

  return (
    <PageLayout headerText="Clients Dashboard">
      <div className="pt-4 space-y-4">
        <div className="flex items-center">
          <div>
            <BulkRefreshButtonsContainer />
          </div>
          <div className="flex flex-grow justify-end">
            <div>
              <RefreshDashboardButton
                loading={refreshingDashboard}
                onClick={() => setRefreshingDashboard(true)}
              />
            </div>
          </div>
        </div>
        <div>
          <ClientDatasetDashboard
            clients={clients}
            refreshStatuses={refreshStatuses}
          />
        </div>
      </div>
    </PageLayout>
  );
}
