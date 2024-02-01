import { Text } from "~/components/core/Text";
import { PageContainer } from "~/components/core/Layout";
import { useEffect, useMemo, useState } from "react";
import { getEvents } from "~/tempdb";
import { Button } from "~/components/core/Button";
import { BottomSheetExample } from "~/components/BottomSheetExample";
import { Event } from "~/components/app/Event";
import { Loading } from "~/components/app/Loading";
import { Link } from "expo-router";

export default function Page() {
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<Awaited<typeof getEvents> | {}>({});

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setFetchingEvents(false));
  }, [setEvents]);

  return (
    <>
      <PageContainer>
        <Text.H1>Hi Ellen!</Text.H1>

        <PageContainer.InnerContent>
          {fetchingEvents ? (
            <Loading />
          ) : (
            Object.entries(events).map(([eventId, event]) => (
              <Event
                key={eventId}
                eventId={eventId}
                linkProps={{
                  href: { pathname: "/event", params: { id: eventId } },
                }}
              />
            ))
          )}
        </PageContainer.InnerContent>

        {/*<BottomSheetExample />*/}

        <Link
          href={{
            pathname: "/new-event",
          }}
          asChild
        >
          <Button icon={<Text.Button>+</Text.Button>}>New event</Button>
        </Link>
      </PageContainer>
    </>
  );
}
