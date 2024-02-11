import { View } from "react-native";
import { padding } from "~/constants/spacing";
import { Text } from "~/components/core/Text";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { Link, LinkProps } from "expo-router";
import { FeatureHeadingProps } from "~/components/core/FeatureHeading";

type Props = {
  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;
export const SeeMore = ({ linkProps, view }: Props) => {
  if (linkProps && view !== "full")
    return (
      // @ts-ignore
      <Link {...linkProps}>
        <View
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
        </View>
      </Link>
    );

  return null;
};
