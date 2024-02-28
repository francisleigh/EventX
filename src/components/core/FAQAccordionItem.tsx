import { ClientFAQDocument } from "~/types.client";
import { Text } from "~/components/core/Text";
import { Card } from "~/components/core/Layout";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useCallback, useState } from "react";
import { padding } from "~/constants/spacing";

type Props = {
  faq: ClientFAQDocument;
};

export const FAQAccordionItem = ({ faq }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setOpen((o) => !o);
  }, [setOpen]);
  return (
    <Card shadow spacingVariant={"sm"}>
      <TouchableOpacity style={styles.headerContainer} onPress={toggle}>
        <Text.Subheading>{faq.title}</Text.Subheading>
        <Entypo
          name={open ? "cross" : "plus"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      {open && <Text.Span>{faq.body}</Text.Span>}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: padding.sm,
  },
});
