import { ListItem } from "~/components/app/ListItem";
import { Link, LinkProps } from "expo-router";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { Div } from "@expo/html-elements";
import { gap, padding } from "~/constants/spacing";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useCallback, useMemo } from "react";
import { expiresSoon, formatCurrency, formatToDate } from "~/util";
import { View } from "react-native";
import { useBillData } from "~/hooks/useBillData";
import { Loading } from "~/components/app/Loading";
import { Button } from "~/components/core/Button";
import { useEventData } from "~/hooks/useEventData";
import { temp_userid } from "~/tempuser";
import { BillPaymentDocument } from "~/types.firestore";

type BillProps = {
  eventId: string;
  billId: string;

  onRefetchData?: () => any;

  view?: "full";
  linkProps?: LinkProps<any>;
};

const currency = { symbol: "£", code: "GBP" };

export const Bill = ({
  eventId,
  billId,
  view,
  onRefetchData,
  linkProps,
}: BillProps) => {
  const { fetching, data } = useBillData({ eventId, billId });
  const { data: eventData } = useEventData({ eventId });

  const handlePaymentItemPress: (paymentData: BillPaymentDocument) => any =
    useCallback((paymentData) => {
      console.log("paymentData", paymentData);
    }, []);

  const TitleBasedOnView = useMemo(
    () => (view === "full" ? Text.H1 : Text.H2),
    [view],
  );
  const paymentsBasedOnView = useMemo(
    () =>
      view === "full" ? data?.payments : data?.payments?.slice(0, 3) ?? [],
    [view, data?.payments],
  );
  const totalPaid = useMemo(
    () =>
      data?.payments?.reduce(
        (total, payment) => (total += payment.quantity),
        0,
      ) ?? 0,
    [data?.payments],
  );
  const settled = useMemo(
    () => totalPaid >= (data?.totalOwed ?? 0),
    [totalPaid, data?.totalOwed],
  );
  const totalFormatted = useMemo(
    () => formatCurrency(data?.totalOwed ?? 0),
    [data?.totalOwed],
  );
  const paidFormatted = useMemo(() => formatCurrency(totalPaid), [totalPaid]);

  const willExpireSoon = !!data?.expiry && expiresSoon(data.expiry.toDate());

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No bill data</Text.H1>;

  const canEdit = eventData?.owner === temp_userid && view === "full";
  console.log("Bill data", data);

  return (
    <>
      <Card
        variant={settled ? "success" : willExpireSoon ? "error" : undefined}
        shadow={view !== "full" && willExpireSoon}
        style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
      >
        <TitleBasedOnView>
          {data?.title}
          {willExpireSoon && (
            <>
              {" "}
              <MaterialCommunityIcons
                name="clock-alert"
                size={24}
                color={colors.detail}
              />
            </>
          )}
        </TitleBasedOnView>
        {view === "full" && (
          <>
            {data.description && (
              <Card shadow>
                <Text.H2>Description</Text.H2>
                <Text.Span>{data.description}</Text.Span>
              </Card>
            )}
            {canEdit && (
              <Link
                href={{
                  pathname: "/new-event-item",
                  params: { eventId, eventItemId: billId },
                }}
                asChild
              >
                <Button
                  icon={
                    <MaterialCommunityIcons
                      name="pencil"
                      size={24}
                      color={colors.primary}
                    />
                  }
                >
                  Edit
                </Button>
              </Link>
            )}

            <Card shadow>
              <View
                style={{
                  position: "absolute",
                  top: padding["screen-y"],
                  right: padding["screen-x"],
                }}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text.H2>Owed</Text.H2>
                <Text.Body>{totalFormatted}</Text.Body>
              </View>
              <View>
                <Text.H2>Paid</Text.H2>
                <Text.Body>{paidFormatted}</Text.Body>
              </View>
            </Card>

            {!!data.expiry && (
              <Card shadow>
                <Text.H2>Due date</Text.H2>
                <Text.Body>{formatToDate(data.expiry.toDate())}</Text.Body>
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
            {!!paymentsBasedOnView &&
              paymentsBasedOnView.map((payment) => (
                <ListItem
                  key={payment.id}
                  title={`Paid ${formatCurrency(payment.quantity!)}`}
                  quantitySymbol={"£"}
                  onItemPress={
                    view === "full" && handlePaymentItemPress
                      ? () => handlePaymentItemPress(payment)
                      : undefined
                  }
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
          // @ts-ignore
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
