import { useForm, Controller } from "react-hook-form";
import { EventSchema, EventSchemaType } from "~/types.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, View } from "react-native";
import { Button } from "~/components/core/Button";
import { gap } from "~/constants/spacing";
import { useCallback } from "react";

export const NewEventForm = () => {
  const { control, handleSubmit } = useForm<EventSchemaType>({
    defaultValues: {},
    resolver: zodResolver(EventSchema),
  });

  const submit = useCallback((formValues: EventSchemaType) => {
    console.log("form values", formValues);
  }, []);

  return (
    <>
      <Controller
        control={control}
        name={"type"}
        render={({ field }) => (
          <View
            style={{ flexDirection: "row", gap: gap.xs, alignItems: "center" }}
          >
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "poll"}
                onPress={() => field.onChange("poll")}
              >
                Poll
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "bill"}
                onPress={() => field.onChange("bill")}
              >
                Bill
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                selected={field.value == "list"}
                onPress={() => field.onChange("list")}
              >
                List
              </Button>
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name={"title"}
        render={({ field }) => (
          <TextInput
            placeholder={"Title"}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
          />
        )}
      />

      <Controller
        control={control}
        name={"description"}
        render={({ field }) => (
          <TextInput
            placeholder={"Description"}
            multiline
            numberOfLines={10}
            value={field.value}
            onChangeText={field.onChange}
            aria-disabled={field.disabled}
          />
        )}
      />

      <Button onPress={handleSubmit(submit)}>Create</Button>
    </>
  );
};
