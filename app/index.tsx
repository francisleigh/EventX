import { Link } from "expo-router";
import { Text as RNText, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/core/Text";
import { Button } from "~/components/core/Button";
import { Card, PageContainer } from "~/components/core/Layout";
import { Poll } from "~/components/app/Poll";

export default function Page() {
  return (
    <PageContainer>
      <Text.H1>Hi Ellen!</Text.H1>
      <PageContainer.InnerContent>
        <Card>
          <Text.H2>Hi Ellen!</Text.H2>
        </Card>

        <Poll
          linkProps={{
            href: { pathname: "/details", params: { name: "Dan" } },
          }}
          title={"Where shall we go?"}
          items={[
            {
              id: "1",
              label: "Same as 2023",
              link: `www.vrbo.com/1234abc`,
            },
            {
              id: "2",
              label: "Umbrian Castle",
              link: `www.vrbo.com/abcd1`,
            },
          ]}
        />

        <Card shadow>
          <Text.Body>Hi Ellen!</Text.Body>
          <Text.Span>Hi Ellen!</Text.Span>
          <Button onPress={() => {}}>Hi Ellen!</Button>
        </Card>
        <Card shadow>
          <Text.Body>Hi Ellen!</Text.Body>
          <Text.Span>Hi Ellen!</Text.Span>
          <Button onPress={() => {}}>Hi Ellen!</Button>
        </Card>
      </PageContainer.InnerContent>

      <Link
        asChild
        href={{ pathname: "/details", params: { name: "Dan" } }}
        style={{
          borderWidth: 1,
          borderColor: "red",
          padding: 20,
          pointerEvents: "auto",
        }}
      >
        <Button>Show Details</Button>
      </Link>
    </PageContainer>
  );
}
