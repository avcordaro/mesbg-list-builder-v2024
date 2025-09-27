import { Outlet as ReactRouterOutlet } from "react-router-dom";
import { DrawerContainer } from "../components/drawer/DrawerContainer.tsx";
import { ModalContainer } from "../components/modal/ModalContainer.tsx";
import { Alerts } from "../components/notifications/Alerts.tsx";
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
