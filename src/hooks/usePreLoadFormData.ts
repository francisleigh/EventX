import { useEffect, useState } from "react";

type Props<DataShape extends {}> = {
  query: () => Promise<DataShape | undefined>;
};

type RTN<DataShape extends {}> = {
  data: DataShape | undefined;
  preLoadingFormData: boolean;
};
export function usePreLoadFormData<DataShape extends {}>(
  { query }: Props<DataShape>,
  deps: any[] = [],
): RTN<DataShape> {
  const [preLoadingFormData, setPreLoadingFormData] =
    useState<RTN<DataShape>["preLoadingFormData"]>(true);
  const [data, setData] = useState<RTN<DataShape>["data"]>();

  useEffect(() => {
    async function main() {
      setPreLoadingFormData(true);
      try {
        const queryResult = await query();
        setData(queryResult);
      } catch (e) {
        console.log("usePreLoadFormData query error", e);
      } finally {
        setPreLoadingFormData(false);
      }
    }

    void main();
  }, deps);

  return {
    data,
    preLoadingFormData,
  };
}
