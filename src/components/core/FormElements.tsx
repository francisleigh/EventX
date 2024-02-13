import {
  type TextInputProps as RNTextInputProps,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { sHeight } from "~/constants/layout";
import { borderRadius, borderWidth } from "~/constants/borders";
import { gap, padding } from "~/constants/spacing";
import { colors } from "~/constants/colors";
import { Text } from "~/components/core/Text";

type TextInputProps = { error?: string } & RNTextInputProps;

const sharedTextInputProps: Partial<TextInputProps> = {
  placeholderTextColor: colors.primary,
};
export const TextInput = ({
  error,
  ...props
}: Omit<TextInputProps, "style">) => {
  console.log("error", error);
  return (
    <View style={{ gap: gap.xs }}>
      <RNTextInput
        {...props}
        {...sharedTextInputProps}
        style={[styles.textInput, !!error && styles.error]}
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
  ...props
}: Omit<TextInputProps, "numberOfLines" | "multiline" | "style">) => {
  return (
    <RNTextInput
      {...props}
      {...sharedTextInputProps}
      multiline
      numberOfLines={10}
      style={[styles.textInput, styles.textArea, !!error && styles.error]}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "lightgrey",
    padding: padding.sm,
    borderRadius: borderRadius.button,
  },
  textArea: {
    minHeight: sHeight * 0.2,
  },
  error: {
    borderWidth: borderWidth.container,
    borderColor: colors.detail,
  },
});
