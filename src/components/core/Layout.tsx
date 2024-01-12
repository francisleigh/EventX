import { Div } from "@expo/html-elements";
import { sHeight } from "~/constants/layout";
import { padding, gap } from "~/constants/spacing";
import { colors } from "~/constants/colors";
import { borderWidth, borderRadius } from "~/constants/borders";
import { ScrollView, ViewProps } from "react-native";

type ContainerProps = Pick<ViewProps, "children">;
export const PageContainer = ({ children }: ContainerProps) => {
  return (
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
}: ContainerProps & {
  shadow?: boolean;
  variant?: keyof typeof variantToColorMap;
}) => {
  return (
    <Div
      style={[
        {
          borderWidth: borderWidth.container,
          borderRadius: borderRadius.container,
          borderColor: variant
            ? variantToColorMap[variant] ?? colors.primary
            : colors.primary,
          padding: padding.default,
          gap: gap.sm,
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
      ]}
    >
      {children}
    </Div>
  );
};
