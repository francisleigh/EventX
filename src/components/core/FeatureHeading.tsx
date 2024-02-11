import { ReactNode, useMemo } from "react";
import { Text } from "~/components/core/Text";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link, LinkProps, useRouter } from "expo-router";
import { UseEventItemDataHookRTN } from "~/types.hooks";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Button } from "~/components/core/Button";
import { gap, padding } from "~/constants/spacing";

type HREF = LinkProps<any>["href"];
export type FeatureHeadingProps = {
  view?: "full";
  children: ReactNode | string;
  editLinkHref?: HREF;
} & Partial<
  Pick<
    UseEventItemDataHookRTN<any>,
    "expired" | "expiresSoon" | "parentExpired"
  >
>;

export const FeatureHeading = ({
  view,
  children,
  editLinkHref,
  expiresSoon,
  expired,
  parentExpired,
}: FeatureHeadingProps) => {
  const router = useRouter();
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );

  return (
    <View style={styles.container}>
      {view === "full" && (
        <View style={styles.headerContainer}>
          {router.canGoBack() && (
            <TouchableOpacity style={styles.headerButton} onPress={router.back}>
              <AntDesign name="arrowleft" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}

          {!!editLinkHref && view === "full" && (
            // @ts-ignore
            <Link href={editLinkHref} asChild>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </Link>
          )}
        </View>
      )}

      <View style={styles.titleContainer}>
        <TitleBasedOnView>
          {children}
          {parentExpired ? (
            <>
              {" "}
              <MaterialCommunityIcons
                name="coffin"
                size={24}
                color={colors.primary}
              />
            </>
          ) : expiresSoon ? (
            <>
              {" "}
              <MaterialCommunityIcons
                name="clock-alert"
                size={24}
                color={colors.detail}
              />
            </>
          ) : null}
        </TitleBasedOnView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: gap.sm,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    padding: padding.sm,
  },
  titleContainer: {
    position: "relative",
  },
});
