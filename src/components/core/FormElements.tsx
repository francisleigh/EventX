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
import { useCallback, useEffect, useState } from "react";
import {
  Calendar as FlashCalendar,
  CalendarActiveDateRange,
  toDateId,
  fromDateId,
  useDateRange,
} from "@marceloterreiro/flash-calendar";
import { EventSchemaType } from "~/types.schema";
import { Card } from "~/components/core/Layout";

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

export const DateRangePicker = (
  props: {
    value?: Pick<EventSchemaType, "start" | "end">;
    onChange: (start: Date | null, end: Date | null) => void;
  } & Pick<TextInputProps, "label">,
) => {
  const defaultValues: CalendarActiveDateRange = {};
  if (props.value?.start) defaultValues.startId = toDateId(props.value.start);
  if (props.value?.end) defaultValues.endId = toDateId(props.value.end);

  const { calendarActiveDateRanges, onCalendarDayPress, dateRange } =
    useDateRange(defaultValues);

  useEffect(() => {
    if (calendarActiveDateRanges[0]) {
      const range = calendarActiveDateRanges[0];
      props.onChange(
        range.startId ? fromDateId(range.startId) : null,
        range.endId ? fromDateId(range.endId) : null,
      );
    }
  }, [calendarActiveDateRanges]);

  return (
    <View style={styles.inputItemsContainer}>
      {!!props.label && <Text.Label>{props.label}</Text.Label>}
      <Card style={{ flex: 1, height: sHeight * 0.39 }}>
        <FlashCalendar.List
          calendarMinDateId={toDateId(new Date())}
          calendarActiveDateRanges={calendarActiveDateRanges}
          onCalendarDayPress={onCalendarDayPress}
        />
      </Card>
    </View>
  );
};

export const DayPicker = (
  props: {
    value?: EventSchemaType["start"];
    onChange: (value: Date | null) => void;
  } & Pick<TextInputProps, "label">,
) => {
  return (
    <View style={styles.inputItemsContainer}>
      {!!props.label && <Text.Label>{props.label}</Text.Label>}
      <Card style={{ flex: 1, height: sHeight * 0.39 }}>
        <FlashCalendar.List
          calendarActiveDateRanges={[
            {
              startId: props.value ? toDateId(props.value) : undefined,
              endId: props.value ? toDateId(props.value) : undefined,
            },
          ]}
          calendarMinDateId={toDateId(new Date())}
          calendarInitialMonthId={toDateId(props.value ?? new Date())}
          onCalendarDayPress={(dateId) => props.onChange(fromDateId(dateId))}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: padding.sm,
    borderRadius: borderRadius.button,
    borderWidth: borderWidth.container,
    borderColor: colors.primary,
    color: colors.primary,
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
