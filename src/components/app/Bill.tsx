import { ListItem } from "~/components/app/ListItem";
import { Link, LinkProps } from "expo-router";
import { Card } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { gap, padding } from "~/constants/spacing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "~/constants/colors";
import { useCallback, useMemo, useState } from "react";
import { formatCurrency, formatToDate } from "~/util";
import { TouchableOpacity, View } from "react-native";
import { useBillData } from "~/hooks/useBillData";
import { Loading } from "~/components/app/Loading";
import { BillPaymentDocument } from "~/types.firestore";
import {
  FeatureHeading,
  FeatureHeadingProps,
} from "~/components/core/FeatureHeading";
import { SeeMore } from "~/components/core/SeeMore";
import { ExpiryDetails } from "~/components/core/ExpiryDetails";
import { Button } from "~/components/core/Button";
import * as Clipboard from "expo-clipboard";

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
                  pathname: "/event-item-form",
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
              <View>
                <Text.H2>Owed</Text.H2>
                <Text.Body>{totalFormatted}</Text.Body>
              </View>
              <View>
                <Text.H2>Paid</Text.H2>
                <Text.Body>{paidFormatted}</Text.Body>
              </View>
              <Card>
                <Text.Subheading>Payment details</Text.Subheading>
                <CopyItem value={data.accountPayeeName} />
                <CopyItem value={data.accountNumber} />
                <CopyItem value={data.sortCode} />
              </Card>

              <Link
                href={{
                  pathname: "/bill-details-form",
                  params: { eventId, id: billId },
                }}
                style={{
                  position: "absolute",
                  borderWidth: 1,
                  borderColor: "red",
                  top: padding.default,
                  right: padding.default,
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
                />
              </Link>
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

const CopyItem = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const handlePress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(value);
      setCopied(true);
    } catch (e) {
      console.log("CopyItem -> handlePress error", e);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 500);
    }
  }, [value]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      disabled={copied}
    >
      <Text.Span>{value}</Text.Span>

      {copied && (
        <Text.Span style={{ color: colors.success }}>Copied!</Text.Span>
      )}

      <MaterialCommunityIcons
        name="content-copy"
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};
