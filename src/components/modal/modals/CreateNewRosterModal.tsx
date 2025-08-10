import { Button, DialogActions, DialogContent, Tab, Tabs } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  MouseEvent,
  PropsWithChildren,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import { useAppState } from "../../../state/app";
import {
  CreateMatchedPlayRoster,
  CreateMatchedPlayRosterHandlers,
} from "../../common/create-roster/CreateMatchedPlayRoster.tsx";
import {
  CreateSiegeRoster,
  CreateSiegeRosterHandlers,
} from "../../common/create-roster/CreateSiegeRoster.tsx";
import {
  ImportRoster,
  ImportRosterHandlers,
} from "../../common/create-roster/ImportRoster.tsx";

export const CreateNewRosterModal = () => {
  const { closeModal } = useAppState();

  const [activeTab, setActiveTab] = useState("regular");
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const regRef = useRef<CreateMatchedPlayRosterHandlers>(null);
  const sieRef = useRef<CreateSiegeRosterHandlers>(null);
  const impRef = useRef<ImportRosterHandlers>(null);

  function createNewRoster(e: MouseEvent) {
    switch (activeTab) {
      case "regular":
        return regRef.current.handleCreateRoster(e);
      case "siege":
        return sieRef.current.handleCreateRoster(e);
      case "custom":
        return null;
      case "import":
        return impRef.current.handleImportRoster(e);
    }
  }

  function TabPanel(props: PropsWithChildren<{ value: string }>) {
    const { children, value } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== activeTab}
        id={`${value}-tab`}
        aria-labelledby={`${value}-tab`}
      >
        {value === activeTab && <Stack gap={1}>{children}</Stack>}
      </div>
    );
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange}>
          <Tab value="regular" label="Regular (Matched Play)" wrapped />
          <Tab value="siege" label="Siege" />
          <Tab value="custom" label="Custom" />
          <Tab value="import" label="Import roster" wrapped />
        </Tabs>
        <TabPanel value="regular">
          <CreateMatchedPlayRoster ref={regRef} />
        </TabPanel>
        <TabPanel value="siege">
          <CreateSiegeRoster ref={sieRef} />
        </TabPanel>
        <TabPanel value="import">
          <ImportRoster ref={impRef} />
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={createNewRoster}
          data-test-id="dialog--submit-button"
        >
          Create roster
        </Button>
      </DialogActions>
    </>
  );
};
