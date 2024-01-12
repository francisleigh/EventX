import {
  StyleSheet,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Text } from "~/components/core/Text";
import { ReactNode, useMemo, useState } from "react";
import { gap, padding } from "~/constants/spacing";
import { borderRadius, borderWidth } from "~/constants/borders";
import { colors } from "~/constants/colors";

type ButtonProps = Pick<TouchableOpacityProps, "onPress"> &
  Pick<TextProps, "children"> & {
    icon?: ReactNode;
    selected?: boolean;
  };
export const Button = ({ children, icon, selected, onPress }: ButtonProps) => {
  const [pressableState, setPressableState] = useState<"pressed" | undefined>(
    undefined,
  );

  const stylesForTouchable: TouchableOpacityProps["style"] = useMemo(() => {
    if (pressableState === "pressed" || selected) {
      return styles.pressed;
    }

    return styles.base;
  }, [selected, pressableState]);

  const colorForButtonContent:
    | (typeof colors)[keyof typeof colors]
    | undefined = useMemo(() => {
    if (pressableState === "pressed" || selected) {
      return colors.secondary;
    }

    return undefined;
  }, [selected, pressableState]);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => setPressableState("pressed")}
        onPressOut={() => setPressableState(undefined)}
        onPress={onPress}
        style={stylesForTouchable}
      >
        <Text.Button color={colorForButtonContent}>
          {children}
          {icon ? <> {icon}</> : null}
        </Text.Button>
      </TouchableOpacity>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  default: {
    paddingHorizontal: padding.default,
    paddingVertical: padding.sm,
    borderRadius: borderRadius.button,
    borderWidth: borderWidth.container,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
    gap: gap.default,
    alignItems: "center",
  },
});
const styles = StyleSheet.create({
  base: baseStyles.default,
  pressed: {
    ...baseStyles.default,
    backgroundColor: colors.primary,
  },
  hovered: {
    ...baseStyles.default,
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
});
