import { WithID } from "~/types.client";
import { sHeight } from "~/constants/layout";
import {
  Calendar as FlashCalendar,
  toDateId,
} from "@marceloterreiro/flash-calendar";
import { Card } from "~/components/core/Layout";
import {
  BillRootDocument,
  ListRootDocument,
  PollRootDocument,
} from "~/types.firestore";

type OverviewCalendarProps = {
  range: { start: Date; end: Date };

  events: (
    | WithID<BillRootDocument>
    | WithID<PollRootDocument>
    | WithID<ListRootDocument>
  )[];
};

export const OverviewCalendar = (props: OverviewCalendarProps) => {
  return (
    <Card style={{ flex: 1, height: sHeight * 0.39 }}>
      <FlashCalendar
        calendarActiveDateRanges={props.events.map((e) => ({
          startId: toDateId(e.expiry.toDate()),
          endId: toDateId(e.expiry.toDate()),
        }))}
        calendarMonthId={toDateId(props.range.start)}
        calendarMinDateId={toDateId(props.range.start)}
        calendarMaxDateId={toDateId(props.range.end)}
        // calendarInitialMonthId={toDateId(props.range.start)}
        onCalendarDayPress={(dateId) => console.log("change", dateId)}
      />
    </Card>
  );
};
