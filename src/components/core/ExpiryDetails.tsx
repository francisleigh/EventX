import { Text } from "~/components/core/Text";
import { formatToDate } from "~/util";
import { Card } from "~/components/core/Layout";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { Timestamp } from "@react-native-firebase/firestore/lib/modular/Timestamp";

type Props = {
  expiry: Timestamp | undefined;
} & Pick<UseEventItemDataHookRTN<any>, "expired">;
export const ExpiryDetails = ({ expired, expiry }: Props) => {
  if (!expiry) return null;

  return (
    <Card
      shadow
      spacingVariant={"sm"}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text.Subheading>Due date</Text.Subheading>
      <Text.Span>
        {formatToDate(expiry.toDate())}
        {expired && " - Ended"}
      </Text.Span>
    </Card>
  );
};
