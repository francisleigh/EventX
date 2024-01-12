import { Div, H1, H2, P, Span } from "@expo/html-elements";
import { Text as RNText, type TextProps } from "react-native";
import { View } from "react-native";
import { gap, padding } from "~/constants/spacing";
import { borderWidth } from "~/constants/borders";
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
    <Div style={{ flexDirection: "column", gap: gap.default }}>
      <H1
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
      </H1>

      <Div
        style={{
          paddingVertical: padding.default,
          backgroundColor: colors.primary,
        }}
      />
    </Div>
  );
};

Base.H2 = ({ children, style, ...props }: TextProps) => {
  return (
    <H2
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
    </H2>
  );
};

Base.Body = ({ children, style, ...props }: TextProps) => {
  return (
    <P
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
    </P>
  );
};

Base.Span = ({ children, style, ...props }: TextProps) => {
  return (
    <Span
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
    </Span>
  );
};

Base.Button = ({
  children,
  style,
  color,
  ...props
}: TextProps & { color?: (typeof colors)[keyof typeof colors] }) => {
  return (
    <Span
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
    </Span>
  );
};
export const Text = Base;
