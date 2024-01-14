import { Touchable, TouchableOpacity, View } from "react-native";
import { Avatar } from "~/components/app/Avatar";
import { useEffect, useState } from "react";
import { Text } from "~/components/core/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";

type ListItemProps = {
  id: string;
  title: string;
  quantity?: number;
  quantitySymbol?: string;
  assignee?: string;
  status?: "pending" | "done";
};

export const ListItem = ({
  id,
  assignee,
  title,
  quantity,
  quantitySymbol = "x ",
  status = "pending",
  onItemPress,
}: ListItemProps & { onItemPress?: (item: ListItemProps) => any }) => {
  const [avatarSource, setAvatarSource] = useState<string | undefined>(
    assignee ? "https://i.pravatar.cc/300" : undefined,
  );

  useEffect(() => {
    // get and set avatarSource from assignee data
  }, [assignee]);

  return (
    <TouchableOpacity
      activeOpacity={onItemPress ? undefined : 1}
      onPress={() =>
        onItemPress && onItemPress({ id, assignee, title, quantity, status })
      }
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text.Body
        style={{
          textDecorationLine: status === "done" ? "line-through" : "none",
        }}
      >
        {title}
        {!!quantity && ` ${quantitySymbol}${quantity}`}
      </Text.Body>

      {status === "done" && (
        <Ionicons
          name="checkmark-circle-sharp"
          size={24}
          color={colors.success}
        />
      )}

      <Avatar source={avatarSource ? { uri: avatarSource } : undefined} />
    </TouchableOpacity>
  );
};
