import { v4 } from "uuid";
import { AlertTypes } from "../../../components/alerts/alert-types.tsx";
import { Slice } from "../../Slice.ts";
import { ApplicationState } from "../index.ts";

export type AlertState = {
  activeAlerts: {
    type: AlertTypes;
    id: string;
    context?: Record<string, unknown>;
  }[];
  triggerAlert: (type: AlertTypes, context?: Record<string, unknown>) => void;
  dismissAlert: (id: string) => void;
};

const initialState = {
  activeAlerts: [],
};

export const alertSlice: Slice<ApplicationState, AlertState> = (set) => ({
  ...initialState,

  triggerAlert: (type, context) =>
    set(
      ({ activeAlerts }) => ({
        activeAlerts: [...activeAlerts, { type, id: v4(), context }],
      }),
      undefined,
      "TRIGGER_ALERT",
    ),
  dismissAlert: (id: string) =>
    set(
      ({ activeAlerts }) => ({
        activeAlerts: activeAlerts.filter((alert) => alert.id !== id),
      }),
      undefined,
      "DISMISS_ALERT",
    ),
});
