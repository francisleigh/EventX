import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { gap } from "~/constants/spacing";
import { Dot } from "~/components/core/Dot";
import { TouchableOpacity, View } from "react-native";

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
};
export const Poll = ({ view, title, items }: PollProps) => {
  return (
    <Card>
      <Text.H2>{title}</Text.H2>
      <Div
        style={{
          gap: gap.xs,
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
              <Div>
                <Text.Body>{item.label}</Text.Body>
                {view === "full" && !!item.link && (
                  <Text.Span style={{ textDecorationLine: "underline" }}>
                    {item.link}
                  </Text.Span>
                )}
              </Div>
              <Div>{view === "full" ? <Dot>{item.votes}</Dot> : <Dot />}</Div>
            </TouchableOpacity>
          );
        })}
      </Div>
    </Card>
  );
};
