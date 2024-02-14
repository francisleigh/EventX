import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap } from "~/constants/spacing";
import { View } from "react-native";

type ErrorBoxProps = { error: string | string[] };
export const ErrorBox = ({ error }: ErrorBoxProps) => {
  const e: ErrorBoxProps["error"] = typeof error === "string" ? [error] : error;

  return (
    <Card variant={"error"}>
      <Text.Subheading>Error</Text.Subheading>
      {e.map((msg, i) => (
        <Text.Span key={`error_box_message_${i}_${msg}`}>{msg}</Text.Span>
      ))}
    </Card>
  );
};
