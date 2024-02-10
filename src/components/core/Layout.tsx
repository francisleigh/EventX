import { Div } from "@expo/html-elements";
import { sHeight } from "~/constants/layout";
import { padding, gap } from "~/constants/spacing";
import { colors } from "~/constants/colors";
import { borderWidth, borderRadius } from "~/constants/borders";
import { ScrollView, StyleProp, ViewProps, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

type ContainerProps = Pick<ViewProps, "children"> & {
  type?: "modal" | "stack";
};
export const PageContainer = ({ children, type = "stack" }: ContainerProps) => {
  let edges: SafeAreaViewProps["edges"] = [];
  if (type === "modal") edges = ["bottom", "left", "right"];
  return (
    <SafeAreaView style={{ backgroundColor: colors.secondary }} edges={edges}>
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
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
PageContainer.InnerContent = ({ children }: ContainerProps) => {
  return <Div style={{ gap: gap.sm }}>{children}</Div>;
};

const variantToColorMap = {
  error: colors.detail,
  success: colors.success,
} as const;
export const Card = ({
  children,
  shadow,
  variant,
  style,
}: ContainerProps & {
  shadow?: boolean;
  variant?: keyof typeof variantToColorMap;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <Div
      style={[
        {
          backgroundColor: colors.secondary,
          borderWidth: borderWidth.container,
          borderRadius: borderRadius.container,
          borderColor: variant
            ? variantToColorMap[variant] ?? colors.primary
            : colors.primary,
          padding: padding.default,
          gap: gap.default,
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
    </Div>
  );
};
