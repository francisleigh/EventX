import { useEffect, useState } from "react";

type Props<DataShape extends {}> = {
  query: () => Promise<DataShape | undefined>;
};

type RTN<DataShape extends {}> = {
  data: DataShape | undefined;
  preLoadingFormData: boolean;
};
export function usePreLoadFormData<DataShape extends {}>({
  query,
}: Props<DataShape>): RTN<DataShape> {
  const [preLoadingFormData, setPreLoadingFormData] =
    useState<RTN<DataShape>["preLoadingFormData"]>(true);
  const [data, setData] = useState<RTN<DataShape>["data"]>();

  useEffect(() => {
    async function main() {
      setPreLoadingFormData(true);
      try {
        await query();
      } catch (e) {
        console.log("usePreLoadFormData query error", e);
      } finally {
        setPreLoadingFormData(false);
      }
    }

    void main();
  }, [query]);

  return {
    data,
    preLoadingFormData,
  };
}
