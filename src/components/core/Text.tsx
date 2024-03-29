import { Text as RNText, View, type TextProps } from "react-native";
import { gap, padding } from "~/constants/spacing";
import { fontSize } from "~/constants/font-size";
import { colors } from "~/constants/colors";

const Base = () => {
  console.warn(
    `Using <Text /> on it's own doesn't work, type <Text.[variant] /> and see what you get.`,
  );

  return null;
};
Base.displayName = "Text";

Base.H1 = ({ children, style, ...props }: TextProps) => {
  return (
    <View style={{ gap: gap.default }}>
      <RNText
        style={[
          {
            fontSize: fontSize.h1,
            fontWeight: "bold",
            color: colors.primary,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </RNText>

      <View
        style={{
          paddingVertical: padding.default,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
};

Base.H2 = ({ children, style, ...props }: TextProps) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.h2,
          fontWeight: "bold",
          color: colors.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

Base.Subheading = ({ children, style, ...props }: TextProps) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.subheading,
          fontWeight: "bold",
          color: colors.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

/*
 * @deprecated Needs re work, style-wise, project uses Text.Span at the moment instead.
 * */
Base.Body = ({ children, style, ...props }: TextProps) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.body,
          color: colors.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

Base.Span = ({ children, style, ...props }: TextProps) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.span,
          color: colors.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

Base.Button = ({
  children,
  style,
  color,
  ...props
}: TextProps & {
  color?: (typeof colors)[keyof typeof colors] | "transparent";
}) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.button,
          fontWeight: "bold",
          color: color ?? colors.primary,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

Base.Label = ({
  children,
  style,
  color,
  bold,
  ...props
}: TextProps & {
  color?: (typeof colors)[keyof typeof colors] | "transparent";
  bold?: boolean;
}) => {
  return (
    <RNText
      style={[
        {
          fontSize: fontSize.label,

          color: color ?? colors.primary,
        },
        bold && { fontWeight: "bold" },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
export const Text = Base;
