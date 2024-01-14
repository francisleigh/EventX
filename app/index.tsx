import { Text } from "~/components/core/Text";
import { PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";
import { List } from "~/components/app/List";
import { useEffect, useMemo, useState } from "react";
import { getTempDBEntries } from "~/tempdb";
import { Bill } from "~/components/app/Bill";
import { ActivityIndicator } from "react-native";
import { colors } from "~/constants/colors";
import { Button } from "~/components/core/Button";

export default function Page() {
  const [fetchingDbEntries, setFetchingDbEntries] = useState<boolean>(true);
  const [dbEntries, setDbEntries] =
    useState<Awaited<typeof getTempDBEntries>>();

  useEffect(() => {
    getTempDBEntries()
      .then(setDbEntries)
      .finally(() => setFetchingDbEntries(false));
  }, [setDbEntries]);

  const polls = useMemo(
    () => (dbEntries?.polls ? Object.entries(dbEntries.polls) : []),
    [dbEntries],
  );
  const lists = useMemo(
    () => (dbEntries?.lists ? Object.entries(dbEntries.lists) : []),
    [dbEntries],
  );
  const bills = useMemo(
    () => (dbEntries?.bills ? Object.entries(dbEntries.bills) : []),
    [dbEntries],
  );

  return (
    <PageContainer>
      <Text.H1>Hi Ellen!</Text.H1>

      <PageContainer.InnerContent>
        {fetchingDbEntries ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {!!polls.length &&
              polls.map(([id, pollData]) => (
                <Poll
                  key={id}
                  {...pollData}
                  linkProps={{
                    href: { pathname: "/poll", params: { id } },
                  }}
                />
              ))}

            {!!lists.length &&
              lists.map(([id, listData]) => (
                <List
                  key={id}
                  {...listData}
                  linkProps={{
                    href: { pathname: "/list", params: { id } },
                  }}
                />
              ))}

            {!!bills.length &&
              bills.map(([id, billData]) => (
                <Bill
                  key={id}
                  {...billData}
                  linkProps={{
                    href: {
                      pathname: "/bill",
                      params: { id },
                    },
                  }}
                />
              ))}
          </>
        )}
      </PageContainer.InnerContent>
      <Button icon={<Text.Button>+</Text.Button>}>Add new item</Button>
    </PageContainer>
  );
}
