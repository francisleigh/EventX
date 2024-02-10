import { ReactNode, useMemo } from "react";
import { Text } from "~/components/core/Text";
import { View, StyleSheet } from "react-native";

export type FeatureHeadingProps = {
  view?: "full";
  canEdit?: boolean;
  children: ReactNode | string;
};
export const FeatureHeading = ({
  canEdit,
  children,
  view,
}: FeatureHeadingProps) => {
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );

  return (
    <View style={styles.container}>
      <TitleBasedOnView>{children}</TitleBasedOnView>;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 1,
    borderColor: "red",
  },
});
