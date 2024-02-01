import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";

type ErrorBoxProps = { error: string | string[] };
export const ErrorBox = ({ error }: ErrorBoxProps) => {
  const e: ErrorBoxProps["error"] = typeof error === "string" ? [error] : error;

  return (
    <Card variant={"error"}>
      {e.map((msg, i) => (
        <Text.Body key={`error_box_message_${i}_${msg}`}>{msg}</Text.Body>
      ))}
    </Card>
  );
};
