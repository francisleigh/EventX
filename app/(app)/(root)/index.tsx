import { Text } from "~/components/core/Text";
import { PageContainer } from "~/components/core/Layout";
import { useEffect, useState } from "react";
import { Button } from "~/components/core/Button";
import { BottomSheetExample } from "~/components/BottomSheetExample";
import { Event } from "~/components/app/Event";
import { Loading } from "~/components/app/Loading";
import { Link } from "expo-router";
import { getEvents } from "~/db";
import { FeatureHeading } from "~/components/core/FeatureHeading";
import { ClientEventDocument } from "~/types.client";
import { ButtonProps } from "react-native";
import { useSession } from "~/ctx/AuthContext";

export default function Page() {
  const session = useSession();
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<ClientEventDocument[]>([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    setFetchingEvents(true);
    getEvents(session.userId!)
      .then(setEvents)
      .finally(() => setFetchingEvents(false));
  }, [setEvents, setFetchingEvents, refreshKey]);

  const handleSignOut: ButtonProps["onPress"] = () => {
    void session.signOut();
  };

  return (
    <>
      <PageContainer
        onRefresh={() => setRefreshKey((k) => ++k)}
        refreshing={fetchingEvents}
      >
        <FeatureHeading view={"full"}>
          Hi {session.user?.displayName}!
        </FeatureHeading>

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
            pathname: "/event-form",
          }}
          asChild
        >
          <Button icon={<Text.Button>+</Text.Button>}>New event</Button>
        </Link>

        <Button busy={session.authBusy} onPress={handleSignOut}>
          Sign out
        </Button>
        <Link
          href={{
            pathname: "/edit-profile",
          }}
          asChild
        >
          <Button>Edit profile</Button>
        </Link>
      </PageContainer>
    </>
  );
}
