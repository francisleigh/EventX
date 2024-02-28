import { gap } from "~/constants/spacing";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Text } from "~/components/core/Text";
import { View } from "react-native";
import { EventItemSchemaType } from "~/types.schema";

type Props = {} & Partial<Pick<EventItemSchemaType, "type">>;

export const EventItemTypeHeader = ({ type }: Props) => {
  let title;
  let icon = null;

  if (!type) return null;

  if (type === "poll") {
    title = "Poll";
    icon = <FontAwesome5 name="poll-h" size={24} color={colors.primary} />;
  }
  if (type === "list") {
    title = "List";
    icon = <MaterialIcons name="list" size={24} color={colors.primary} />;
  }
  if (type === "bill") {
    title = "Bill";
    icon = (
      <FontAwesome6 name="money-bill-1" size={24} color={colors.primary} />
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: gap.sm,
        alignItems: "center",
        opacity: 0.6,
      }}
    >
      {icon}
      <Text.Label bold>{title}</Text.Label>
    </View>
  );
};
