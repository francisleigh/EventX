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
import { Loading } from "~/components/app/Loading";

type ButtonProps = Pick<TouchableOpacityProps, "onPress"> &
  Pick<TextProps, "children"> & {
    icon?: ReactNode;
    selected?: boolean;
    busy?: boolean;
  };
export const Button = ({
  children,
  icon,
  selected,
  onPress,
  busy,
}: ButtonProps) => {
  const [pressableState, setPressableState] = useState<"pressed" | undefined>(
    undefined,
  );

  const stylesForTouchable: TouchableOpacityProps["style"] = useMemo(() => {
    if (busy) {
      return styles.disabled;
    }

    if (pressableState === "pressed" || selected) {
      return styles.pressed;
    }

    return styles.base;
  }, [selected, pressableState, busy]);

  const colorForButtonContent:
    | (typeof colors)[keyof typeof colors]
    | "transparent"
    | undefined = useMemo(() => {
    if (busy) {
      return "transparent";
    }
    if (pressableState === "pressed" || selected) {
      return colors.secondary;
    }

    return undefined;
  }, [selected, pressableState, busy]);

  return (
    <View>
      <TouchableOpacity
        disabled={busy}
        activeOpacity={1}
        onPressIn={() => setPressableState("pressed")}
        onPressOut={() => setPressableState(undefined)}
        onPress={onPress}
        style={stylesForTouchable}
      >
        {busy && (
          <View style={styles.loadingIndicator}>
            <Loading />
          </View>
        )}

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
  disabled: {
    ...baseStyles.default,
    backgroundColor: "lightgrey",
    borderColor: "lightgrey",
  },
  hovered: {
    ...baseStyles.default,
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
