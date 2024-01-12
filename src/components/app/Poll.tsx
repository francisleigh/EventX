import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { gap, padding } from "~/constants/spacing";
import { Dot } from "~/components/core/Dot";
import { TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Link, LinkProps } from "expo-router";

type PollItem = {
  id: string;
  label: string;
  link?: string;
  votes?: number;
};

type PollProps = {
  view?: "full";
  title: string;
  items: PollItem[];
  linkProps: LinkProps<any>;
};
export const Poll = ({ view, title, items, linkProps }: PollProps) => {
  return (
    <Card>
      <Text.H2>{title}</Text.H2>
      <Div
        style={{
          gap: gap.sm,
        }}
      >
        {items.map((item) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                view !== "full" && { pointerEvents: "none" },
              ]}
            >
              <View
                style={{
                  padding: 0,
                  paddingVertical: 0,
                  paddingTop: 0,
                }}
              >
                <Text.Body>{item.label}</Text.Body>
                {view === "full" && !!item.link && (
                  <Text.Span style={{ textDecorationLine: "underline" }}>
                    {item.link}
                  </Text.Span>
                )}
              </View>
              <Div>{view === "full" ? <Dot>{item.votes}</Dot> : <Dot />}</Div>
            </TouchableOpacity>
          );
        })}
      </Div>

      {!!linkProps && (
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
