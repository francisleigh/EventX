import { ListItem } from "~/components/app/ListItem";
import { Link, LinkProps } from "expo-router";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { gap, padding } from "~/constants/spacing";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useMemo } from "react";
import { formatCurrency, formatToDate } from "~/util";
import { View } from "react-native";

type BillProps = {
  total: number;
  items: Omit<
    Parameters<typeof ListItem>[0],
    "onItemPress" | "quantitySymbol" | "title"
  >[];
  title: string;
  description?: string;
  expiry?: Date;
  view?: "full";
  linkProps?: LinkProps<any>;
} & Pick<Parameters<typeof ListItem>[0], "onItemPress">;

const currency = { symbol: "£", code: "GBP" };

export const Bill = ({
  view,
  title,
  total,
  items,
  expiry,
  linkProps,
  onItemPress,
  description,
}: BillProps) => {
  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );
  const itemsBasedOnView = useMemo(
    () => (view === "full" ? items : items.slice(0, 3)),
    [items, view],
  );
  const totalPaid = useMemo(
    () => items.reduce((total, item) => total + (item.quantity ?? 0), 0),
    [items],
  );
  const settled = useMemo(() => totalPaid >= total, [totalPaid, total]);
  const totalFormatted = useMemo(() => formatCurrency(total), [total]);
  const paidFormatted = useMemo(() => formatCurrency(totalPaid), [totalPaid]);

  return (
    <>
      <Card
        variant={settled ? "success" : undefined}
        style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
      >
        <TitleBasedOnView>{title}</TitleBasedOnView>
        {view === "full" && (
          <>
            {description && (
              <Card shadow>
                <Text.H2>Description</Text.H2>
                <Text.Span>{description}</Text.Span>
              </Card>
            )}

            <Card shadow>
              <View>
                <Text.H2>Owed</Text.H2>
                <Text.Body>{totalFormatted}</Text.Body>
              </View>
              <View>
                <Text.H2>Paid</Text.H2>
                <Text.Body>{paidFormatted}</Text.Body>
              </View>
            </Card>

            {!!expiry && (
              <Card shadow>
                <Text.H2>Due date</Text.H2>
                <Text.Body>{formatToDate(expiry)}</Text.Body>
              </Card>
            )}
          </>
        )}
        {view === "full" ? (
          <Div
            style={{
              gap: gap.sm,
            }}
          >
            {itemsBasedOnView.map((item) => (
              <ListItem
                key={item.id}
                {...item}
                title={`Paid ${formatCurrency(item.quantity!)}`}
                quantity={undefined}
                quantitySymbol={undefined}
                onItemPress={view === "full" ? onItemPress : undefined}
              />
            ))}
          </Div>
        ) : (
          <Div
            style={{
              gap: gap.sm,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Div>
              <Text.Body>{totalFormatted} owed</Text.Body>
              <Text.Span>
                {totalPaid ? `${paidFormatted} paid` : "Nothing paid"}
              </Text.Span>
            </Div>
          </Div>
        )}

        {!!linkProps && view !== "full" && (
          <Link {...linkProps}>
            <Div
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingVertical: padding.sm,
              }}
            >
              <Text.Span>See more</Text.Span>
              <AntDesign name="arrowright" size={24} color={colors.primary} />
            </Div>
          </Link>
        )}
      </Card>
    </>
  );
};
