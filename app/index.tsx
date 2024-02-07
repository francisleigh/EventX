import { Text } from "~/components/core/Text";
import { PageContainer } from "~/components/core/Layout";
import { useEffect, useState } from "react";
import { Button } from "~/components/core/Button";
import { BottomSheetExample } from "~/components/BottomSheetExample";
import { Event } from "~/components/app/Event";
import { Loading } from "~/components/app/Loading";
import { Link } from "expo-router";
import { getEvents } from "~/db";
import { temp_userid } from "~/tempuser";

export default function Page() {
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<Awaited<typeof getEvents>>();

  useEffect(() => {
    getEvents(temp_userid)
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
            events?.map((event) => (
              <Event
                key={event.id}
                eventId={event.id}
                linkProps={{
                  href: { pathname: "/event", params: { id: event.id } },
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
