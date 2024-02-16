import { Touchable, TouchableOpacity, View } from "react-native";
import { Avatar } from "~/components/app/Avatar";
import { useEffect, useState } from "react";
import { Text } from "~/components/core/Text";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { gap } from "~/constants/spacing";

type ListItemProps = {
  title: string;
  quantity?: number;
  quantitySymbol?: string;
  assignee?: string;
  status?: "pending" | "done";
};

export const ListItem = ({
  assignee,
  title,
  quantity,
  quantitySymbol = "x ",
  status = "pending",
}: ListItemProps) => {
  const [avatarSource, setAvatarSource] = useState<string | undefined>(
    assignee ? "https://i.pravatar.cc/300" : undefined,
  );

  useEffect(() => {
    // get and set avatarSource from assignee data
  }, [assignee]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text.Label
        style={{
          textDecorationLine: status === "done" ? "line-through" : "none",
        }}
      >
        {title}
        {!!quantity && ` ${quantitySymbol}${quantity}`}
      </Text.Label>

      <View
        style={{
          flexDirection: "row",
          gap: gap.sm,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {status === "done" && (
          <Ionicons
            name="checkmark-circle-sharp"
            size={24}
            color={colors.success}
          />
        )}

        {status === "pending" && (
          <MaterialIcons name="pending" size={24} color={colors.primary} />
        )}

        <Avatar source={avatarSource ? { uri: avatarSource } : undefined} />
      </View>
    </View>
  );
};
