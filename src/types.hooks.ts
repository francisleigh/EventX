import { ClientEventDocument } from "~/types.client";

export type UseEventItemDataHookRTN<T extends {}> = {
  fetching: boolean;
  data: T;

  parentEventData: ClientEventDocument | undefined;
  parentExpired: boolean;

  expired: boolean;
  expiresSoon: boolean;

  canEdit: boolean;
};
