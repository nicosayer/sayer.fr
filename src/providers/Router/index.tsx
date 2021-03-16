import React, { ReactNode } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { DEFAULT_ROOT_ID } from "providers/RootId";

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:relativeId">{children}</Route>
        <Route render={() => <Redirect to={`/${DEFAULT_ROOT_ID}`} />} />
      </Switch>
    </BrowserRouter>
  );
};
