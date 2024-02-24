import { sHeight } from "~/constants/layout";
import { padding, gap } from "~/constants/spacing";
import { colors } from "~/constants/colors";
import { borderWidth, borderRadius } from "~/constants/borders";
import {
  RefreshControl,
  RefreshControlProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

type ContainerProps = Pick<ViewProps, "children"> &
  Partial<Pick<RefreshControlProps, "onRefresh" | "refreshing">> & {
    type?: "modal" | "stack";
    containerAs?: "ScrollView" | "View";
    scrollViewProps?: Partial<ScrollViewProps>;
  };
export const PageContainer = ({
  children,
  type = "stack",
  containerAs = "ScrollView",
  onRefresh,
  refreshing,
}: ContainerProps) => {
  let edges: SafeAreaViewProps["edges"] = undefined;
  if (type === "modal") edges = ["bottom", "left", "right"];

  const scrollViewProps: ScrollViewProps = {};
  if (onRefresh)
    scrollViewProps.refreshControl = (
      <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
    );

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.secondary,
      }}
      edges={edges}
    >
      {containerAs === "ScrollView" && (
        <ScrollView
          style={{
            overflow: "scroll",
            minHeight: sHeight,
            backgroundColor: colors.secondary,
            paddingHorizontal: padding["screen-x"],
            paddingVertical: padding["screen-y"],
          }}
          contentContainerStyle={{
            gap: gap.default,
            paddingBottom: sHeight * 0.25,
          }}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      )}
      {containerAs === "View" && (
        <View
          style={{
            overflow: "scroll",
            minHeight: sHeight,
            backgroundColor: colors.secondary,
            paddingHorizontal: padding["screen-x"],
            paddingVertical: padding["screen-y"],
            gap: gap.default,
            paddingBottom: sHeight * 0.25,
          }}
          {...scrollViewProps}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};
PageContainer.InnerContent = ({ children }: ContainerProps) => {
  return <View style={{ gap: gap.sm }}>{children}</View>;
};

const variantToColorMap = {
  error: colors.detail,
  success: colors.success,
} as const;
export const Card = ({
  children,
  shadow,
  colorVariant,
  spacingVariant,
  style,
}: ContainerProps & {
  shadow?: boolean;
  colorVariant?: keyof typeof variantToColorMap;
  spacingVariant?: keyof typeof gap;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          backgroundColor: colors.secondary,
          borderWidth: borderWidth.container,
          borderRadius: borderRadius.container,
          borderColor: colorVariant
            ? variantToColorMap[colorVariant] ?? colors.primary
            : colors.primary,
          padding: padding.default,
          gap: spacingVariant ? gap[spacingVariant] : gap.default,
        },
        shadow && {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
