import { useState } from "react";
import { ModalTypes } from "../../../components/modal/modals.tsx";
import { useAppState } from "../../../state/app";

export const useBulkDelete = () => {
  const { setCurrentModal } = useAppState();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedRosters, setSelectedRosters] = useState<string[]>([]);

  const toggleDeleting = () => {
    if (deleting) {
      if (selectedRosters.length === 0) {
        setDeleting(false);
        return;
      }
      setCurrentModal(ModalTypes.CONFIRM_BULK_DELETE_ROSTER, {
        rosters: selectedRosters,
        confirm: () => {
          setSelectedRosters([]);
          setDeleting(false);
        },
      });
    } else {
      setDeleting(true);
    }
  };

  const selectRoster = (id: string) => {
    if (selectedRosters.includes(id)) {
      setSelectedRosters(selectedRosters.filter((value) => value !== id));
    } else {
      setSelectedRosters([...selectedRosters, id]);
    }
  };

  return {
    deleting,
    toggleDeleting,
    selectedRosters,
    selectRoster,
  };
};
