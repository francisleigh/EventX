import { ListItem } from "~/components/app/ListItem";
import { LinkProps } from "expo-router";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap, padding } from "~/constants/spacing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useCallback, useMemo } from "react";
import { formatCurrency, formatToDate } from "~/util";
import { View } from "react-native";
import { useBillData } from "~/hooks/useBillData";
import { Loading } from "~/components/app/Loading";
import { BillPaymentDocument } from "~/types.firestore";
import {
  FeatureHeading,
  FeatureHeadingProps,
} from "~/components/core/FeatureHeading";
import { SeeMore } from "~/components/core/SeeMore";
import { ExpiryDetails } from "~/components/core/ExpiryDetails";

type BillProps = {
  eventId: string;
  billId: string;

  onRefetchData?: () => any;

  linkProps?: LinkProps<any>;
} & Pick<FeatureHeadingProps, "view">;

const currency = { symbol: "£", code: "GBP" };

export const Bill = ({
  eventId,
  billId,
  view,
  onRefetchData,
  linkProps,
}: BillProps) => {
  const { fetching, data, parentExpired, expired, expiresSoon, canEdit } =
    useBillData({
      eventId,
      billId,
    });

  const handlePaymentItemPress: (paymentData: BillPaymentDocument) => any =
    useCallback((paymentData) => {
      console.log("paymentData", paymentData);
    }, []);

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

  if (fetching) return <Loading />;

  if (!data) return <Text.H1>No bill data</Text.H1>;

  console.log("Bill data", data);

  return (
    <>
      <Card
        variant={settled ? "success" : expiresSoon ? "error" : undefined}
        shadow={view !== "full" && expiresSoon}
        style={view === "full" && { borderWidth: 0, paddingHorizontal: 0 }}
      >
        <FeatureHeading
          view={view}
          parentExpired={parentExpired}
          expiresSoon={expiresSoon}
          expired={expired}
          editLinkHref={
            canEdit
              ? {
                  pathname: "/new-event-item",
                  params: { eventId, eventItemId: billId },
                }
              : undefined
          }
        >
          {data?.title}
        </FeatureHeading>
        {view === "full" && (
          <>
            {data.description && (
              <Card shadow>
                <Text.H2>Description</Text.H2>
                <Text.Span>{data.description}</Text.Span>
              </Card>
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
              <ExpiryDetails expiry={data?.expiry} expired={expired} />
            )}
          </>
        )}

        {view === "full" ? (
          <View
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
          </View>
        ) : (
          <View
            style={{
              gap: gap.sm,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text.Body>{totalFormatted} owed</Text.Body>
              <Text.Span>
                {totalPaid ? `${paidFormatted} paid` : "Nothing paid"}
              </Text.Span>
            </View>
          </View>
        )}

        <SeeMore linkProps={linkProps} view={view} />
      </Card>
    </>
  );
};
