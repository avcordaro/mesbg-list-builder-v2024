import { ModalTypes } from "../../../components/modal/modals.tsx";
import { charts } from "../../../constants/charts.ts";
import { useAppState } from "../../../state/app";
import { NavItem } from "./NavItemLink.tsx";

export const useChartMenuItems = () => {
  const { setCurrentModal } = useAppState();
  return Object.entries(charts).map(
    ([key, name]) =>
      ({
        icon: <></>,
        label: name,
        action: () => {
          setCurrentModal(ModalTypes.CHART, {
            selectedChart: key,
            title: charts[key],
          });
        },
        active: false,
      }) as NavItem,
  );
};
