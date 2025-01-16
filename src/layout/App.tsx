import { Outlet as ReactRouterOutlet } from "react-router-dom";
import { Alerts } from "../components/alerts/Alerts.tsx";
import { DrawerContainer } from "../components/drawer/DrawerContainer.tsx";
import { ModalContainer } from "../components/modal/ModalContainer.tsx";
import { Navigation } from "./Navigation.tsx";
import { WithCloudSync } from "./cloud-data-provider/WithCloudSync.tsx";

export const App = () => {
  return (
    <Navigation>
      <main>
        <Alerts />
        <WithCloudSync>
          <ReactRouterOutlet />
        </WithCloudSync>
      </main>
      <aside>
        <DrawerContainer />
        <ModalContainer />
      </aside>
    </Navigation>
  );
};
