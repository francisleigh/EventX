import { Link, LinkProps, useRouter } from "expo-router";
import { expiresSoon, formatToDate } from "~/util";
import { Card } from "~/components/core/Layout";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Text } from "~/components/core/Text";
import { padding } from "~/constants/spacing";
import { useEventData } from "~/hooks/useEventData";
import { Poll } from "~/components/app/Poll";
import { Loading } from "~/components/app/Loading";
import { Bill } from "~/components/app/Bill";
import { List } from "~/components/app/List";
import { Button } from "~/components/core/Button";
import {
  FeatureHeading,
  FeatureHeadingProps,
} from "~/components/core/FeatureHeading";
import { SeeMore } from "~/components/core/SeeMore";
import { ExpiryDetails } from "~/components/core/ExpiryDetails";
import { EventItemDescription } from "~/components/core/EventItemDescription";

type EventProps = {
  eventId: string;
  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;

export const Event = ({ eventId, view, linkProps }: EventProps) => {
  const { fetching, data, expired, expiresSoon } = useEventData({ eventId });
  const router = useRouter();

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No event data</Text.H1>;

  const noItems = [...data.polls, ...data.bills, ...data.lists].length === 0;

  return (
    <Card
      colorVariant={expiresSoon ? "error" : undefined}
      shadow={view !== "full" && expiresSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <FeatureHeading
        view={view}
        expired={expired}
        expiresSoon={expiresSoon}
        editLinkHref={{
          pathname: "/event-form",
          params: { eventId },
        }}
        threadId={data.threadId}
        eventId={eventId}
      >
        {data.title}
      </FeatureHeading>

      {view === "full" && (
        <>
          {data.description && (
            <EventItemDescription>{data.description}</EventItemDescription>
          )}

          {!!data.start?.toDate && (
            <ExpiryDetails
              title={"Event date"}
              expiry={data.start}
              expired={expired}
            />
          )}

          {!noItems && <Text.H1>Items</Text.H1>}

          {data.polls.map((poll) => (
            <Poll
              key={`event_${data.id}_poll_${poll.id}`}
              eventId={data.id}
              pollId={poll.id}
              linkProps={{
                href: {
                  pathname: "/poll",
                  params: { id: poll.id, eventId: data.id },
                },
              }}
            />
          ))}

          {data.bills.map((bill) => (
            <Bill
              key={`event_${data.id}_bill_${bill.id}`}
              eventId={data.id}
              billId={bill.id}
              linkProps={{
                href: {
                  pathname: "/bill",
                  params: { id: bill.id, eventId: data.id },
                },
              }}
            />
          ))}

          {data.lists.map((list) => (
            <List
              key={`event_${data.id}_lsit_${list.id}`}
              eventId={data.id}
              listId={list.id}
              linkProps={{
                href: {
                  pathname: "/list",
                  params: { id: list.id, eventId: data.id },
                },
              }}
            />
          ))}

          <Link
            href={{
              pathname: "/event-item-form",
              params: {
                eventId,
              },
            }}
            asChild
          >
            <Button icon={<Text.Button>+</Text.Button>}>New item</Button>
          </Link>

          <ExpiryDetails expiry={data?.end} expired={expired} />
        </>
      )}

      <SeeMore linkProps={linkProps} view={view} />
    </Card>
  );
};
