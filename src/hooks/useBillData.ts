import { ClientBillDocument } from "~/types.client";
import { useEffect, useMemo, useState } from "react";
import { getBillPayments, getEventItem } from "~/db";
import { BillRootDocument, PollRootDocument } from "~/types.firestore";
import { expiresSoon, hasExpired } from "~/util";
import { UseEventItemDataHookRTN } from "~/types.hooks";

type RTN = UseEventItemDataHookRTN<ClientBillDocument> & {};
export const useBillData = ({
  eventId,
  billId,
}: {
  eventId: string;
  billId: string;
}) => {
  const [fetching, setFetching] = useState<RTN["fetching"]>(true);
  const [data, setData] = useState<RTN["data"]>();

  const getData = async () => {
    setFetching(true);
    try {
      const bill = (await getEventItem(
        eventId,
        billId,
      )) as unknown as BillRootDocument;

      const nextData: RTN["data"] = {
        ...bill,
        type: "bill",
        id: billId,
        payments: [],
      };

      const billPayments = await getBillPayments(eventId, billId);
      if (billPayments) nextData.payments = billPayments;

      setData(nextData);
    } catch (e) {
      console.log("useBillData getData error", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [billId, eventId]);

  const expired = useMemo(() => {
    if (!data) return false;

    return hasExpired(data.expiry.toDate());
  }, [data]);
  const willExpireSoon = useMemo(() => {
    if (!data || expired) return false;

    return expiresSoon(data.expiry.toDate());
  }, [data, expired]);

  return {
    fetching,
    data,

    expired,
    expiresSoon: willExpireSoon,
  };
};
