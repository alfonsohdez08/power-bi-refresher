import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Switch, Route } from "react-router-dom";

import ClientDatasetDashboardPage from "./pages/ClientDatasetDashboardPage";
import ConfirmBulkRefreshPage from "./pages/ConfirmBulkRefreshPage";
import BulkRefreshProvider from "./BulkRefreshContext";

function App() {
  return (
    <Switch>
      <Route
        path="/clients/:clientId/datasets/:datasetId/refresh-history/view"
        exact
      />
      <BulkRefreshProvider>
        <>
          <Route path={["/confirm-bulk-refresh"]} exact>
            <ConfirmBulkRefreshPage />
          </Route>
          <Route path={["/"]} exact>
            <ClientDatasetDashboardPage />
          </Route>
        </>
      </BulkRefreshProvider>
    </Switch>
  );
}

export default App;
