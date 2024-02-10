export type UseEventItemDataHookRTN<T extends {}> = {
  fetching: boolean;
  data: T;

  expired: boolean;
  expiresSoon: boolean;
};
