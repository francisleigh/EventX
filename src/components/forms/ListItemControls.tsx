import { Button } from "~/components/core/Button";
import { useCallback, useState } from "react";
import { assignUserToListItem, updateListItem } from "~/db";
import { ErrorBox } from "~/components/app/ErrorBox";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { gap } from "~/constants/spacing";
import { useListData } from "~/hooks/useListData";
import { temp_userid } from "~/tempuser";
import { ListItemDocument } from "~/types.firestore";
import { Loading } from "~/components/app/Loading";
import { Text } from "~/components/core/Text";

export const ListItemControlsForm = ({
  eventId,
  listId,
  listItemId,
  onRefetchData,
}: {
  eventId: string;
  listId: string;
  listItemId: string;
  onRefetchData?: () => any;
}) => {
  const router = useRouter();
  const { expired, data, fetching } = useListData({ eventId, listId });

  const [assigningUser, setAssigningUser] = useState<boolean>(false);
  const [changingStatus, setChangingStatus] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>();

  const listItemData = data?.items?.find((item) => item.id === listItemId);
  const userIsAssignee = listItemData?.userId === temp_userid;

  const handleAssign = useCallback(
    async (assign: boolean) => {
      setAssigningUser(true);
      try {
        await assignUserToListItem(
          eventId,
          listId,
          listItemId,
          assign ? temp_userid : "",
        );
        onRefetchData && onRefetchData();
      } catch (e) {
        console.log("ListItemControlsForm -> handleAssign error", e);
        if (typeof e === "string") {
          setSubmissionError(e as string);
        }
      } finally {
        setAssigningUser(false);
      }
    },
    [listItemData, setAssigningUser, setSubmissionError, onRefetchData],
  );

  const handleStatusChange = useCallback(
    async (nextStatus: ListItemDocument["status"]) => {
      setChangingStatus(true);
      try {
        await updateListItem(eventId, listId, listItemId, {
          status: nextStatus,
        });

        onRefetchData && onRefetchData();
      } catch (e) {
        console.log("ListItemControlsForm -> handleStatusChange error", e);
        if (typeof e === "string") {
          setSubmissionError(e as string);
        }
      } finally {
        setChangingStatus(false);
      }
    },
    [setChangingStatus, setSubmissionError, onRefetchData],
  );

  if (fetching) {
    return <Loading />;
  }

  console.log("EXPIRED", expired);
  console.log("listItemData", listItemData);

  if (expired || !listItemData) {
    router.back();

    return null;
  }

  return (
    <>
      {!!submissionError && <ErrorBox error={submissionError} />}

      <Button
        busy={assigningUser}
        onPress={() => handleAssign(!userIsAssignee)}
      >
        {userIsAssignee ? "Un-assign yourself" : "Assign yourself to this item"}
      </Button>

      <View style={{ gap: gap.sm }}>
        <Text.Label bold>Status</Text.Label>
        <View
          style={{ flexDirection: "row", gap: gap.xs, alignItems: "center" }}
        >
          <View style={{ flex: 1 }}>
            <Button
              busy={changingStatus}
              selected={listItemData.status === "pending"}
              onPress={() => handleStatusChange("pending")}
            >
              Pending
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              busy={changingStatus}
              selected={listItemData.status === "done"}
              onPress={() => handleStatusChange("done")}
            >
              Done
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};
