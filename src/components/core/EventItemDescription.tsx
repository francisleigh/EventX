import { Text } from "~/components/core/Text";
import { Card } from "~/components/core/Layout";

export const EventItemDescription = ({ children }: { children: string }) => {
  return (
    <Card shadow>
      <Text.Subheading>Description</Text.Subheading>
      <Text.Span>{children}</Text.Span>
    </Card>
  );
};
