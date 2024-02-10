import { colors } from "~/constants/colors";
import { padding } from "~/constants/spacing";
import { StyleSheet, View, ViewProps } from "react-native";
import { borderWidth } from "~/constants/borders";

export const Dot = ({
  color,
  pending,
  style,
  children,
}: {
  color?: keyof typeof colors;
  pending?: boolean;
} & Pick<ViewProps, "children" | "style">) => {
  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          padding: padding.default,
          backgroundColor: color
            ? colors[color] ?? colors.primary
            : colors.primary,
          borderRadius: 100000,
          borderColor: color ? colors[color] ?? colors.primary : colors.primary,
        },
        pending && styles.pending,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  pending: {
    backgroundColor: colors.secondary,
    borderWidth: borderWidth.container,
  },
});
