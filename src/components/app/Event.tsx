import { Link, LinkProps } from "expo-router";
import { expiresSoon, formatToDate } from "~/util";
import { Card } from "~/components/core/Layout";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { padding } from "~/constants/spacing";
import { useMemo } from "react";
import { useEventData } from "~/hooks/useEventData";
import { Poll } from "~/components/app/Poll";
import { Loading } from "~/components/app/Loading";
import { Bill } from "~/components/app/Bill";
import { List } from "~/components/app/List";

type EventProps = {
  eventId: string;
  view?: "full";
  linkProps?: LinkProps<any>;
};

export const Event = ({ eventId, view, linkProps }: EventProps) => {
  const { fetching, data } = useEventData({ eventId });

  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No event data</Text.H1>;

  const willExpireSoon = !!data.start && expiresSoon(data.start.toDate());

  return (
    <Card
      variant={willExpireSoon ? "error" : undefined}
      shadow={view !== "full" && willExpireSoon}
      style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
    >
      <TitleBasedOnView>
        {data.title}{" "}
        {willExpireSoon && (
          <>
            {" "}
            <MaterialCommunityIcons
              name="clock-alert"
              size={24}
              color={colors.detail}
            />
          </>
        )}
      </TitleBasedOnView>

      {view === "full" && (
        <>
          {data.description && (
            <Card shadow>
              <Text.H2>Description</Text.H2>
              <Text.Span>{data.description}</Text.Span>
            </Card>
          )}

          {!!data.start.toDate() && (
            <Card shadow>
              <Text.H2>Event date</Text.H2>
              <Text.Body>{formatToDate(data.start.toDate())}</Text.Body>
            </Card>
          )}

          <Text.H1>Items</Text.H1>
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
        </>
      )}

      {!!linkProps && view !== "full" && (
        <Link {...linkProps}>
          <Div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingVertical: padding.sm,
            }}
          >
            <Text.Span>See more</Text.Span>
            <AntDesign name="arrowright" size={24} color={colors.primary} />
          </Div>
        </Link>
      )}
    </Card>
  );
};
