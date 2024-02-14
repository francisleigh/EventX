import {
  type TextInputProps as RNTextInputProps,
  TextInput as RNTextInput,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { sHeight } from "~/constants/layout";
import { borderRadius, borderWidth } from "~/constants/borders";
import { gap, padding } from "~/constants/spacing";
import { colors } from "~/constants/colors";
import { Text } from "~/components/core/Text";
import { useCallback, useState } from "react";

type TextInputProps = { error?: string; label?: string } & RNTextInputProps;

const sharedTextInputProps: Partial<TextInputProps> = {
  placeholderTextColor: colors.primary,
};
export const TextInput = ({
  error,
  label,
  onFocus,
  onBlur,
  ...props
}: Omit<TextInputProps, "style">) => {
  const [focussed, setFocussed] = useState<boolean>(false);

  const handleFocus: TextInputProps["onFocus"] = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocussed(true);

      onFocus && onFocus(e);
    },
    [onFocus, setFocussed],
  );

  const handleBlur: TextInputProps["onBlur"] = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocussed(false);

      onBlur && onBlur(e);
    },
    [onBlur, setFocussed],
  );

  return (
    <View style={styles.inputItemsContainer}>
      {!!label && <Text.Label bold={focussed}>{label}</Text.Label>}

      <RNTextInput
        {...props}
        {...sharedTextInputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.textInput,
          !!error && styles.error,
          focussed && styles.focussed,
        ]}
      />
      {!!error && (
        <Text.Button style={{ fontSize: 8 }} color={colors.detail}>
          {error}
        </Text.Button>
      )}
    </View>
  );
};

export const TextArea = ({
  error,
  label,
  onFocus,
  onBlur,
  ...props
}: Omit<TextInputProps, "numberOfLines" | "multiline" | "style">) => {
  const [focussed, setFocussed] = useState<boolean>(false);

  const handleFocus: TextInputProps["onFocus"] = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocussed(true);

      onFocus && onFocus(e);
    },
    [onFocus, setFocussed],
  );

  const handleBlur: TextInputProps["onBlur"] = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocussed(false);

      onBlur && onBlur(e);
    },
    [onBlur, setFocussed],
  );
  return (
    <View style={styles.inputItemsContainer}>
      {!!label && <Text.Label bold={focussed}>{label}</Text.Label>}
      <RNTextInput
        {...props}
        {...sharedTextInputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline
        numberOfLines={10}
        style={[styles.textInput, styles.textArea, !!error && styles.error]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "lightgrey",
    padding: padding.sm,
    borderRadius: borderRadius.button,
    borderWidth: borderWidth.container,
    borderColor: colors.primary,
  },
  textArea: {
    minHeight: sHeight * 0.2,
  },
  error: {
    borderColor: colors.detail,
  },
  focussed: {
    borderColor: colors.success,
  },
  inputItemsContainer: { gap: gap.xs, flex: 1 },
});
