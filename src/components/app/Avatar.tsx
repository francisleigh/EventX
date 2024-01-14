import { Image, ImageProps } from "react-native";
import { Dot } from "~/components/core/Dot";
import { colors } from "~/constants/colors";
import { sWidth } from "~/constants/layout";

const size = 40;

type AvatarProps = Partial<Pick<ImageProps, "source">>;

export const Avatar = ({ source }: AvatarProps) => {
  return (
    <Dot
      color={"success"}
      style={{
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 0,
        overflow: "hidden",
        width: size,
        height: size,
      }}
    >
      {!!source && (
        <Image
          source={source}
          style={[
            { width: sWidth * 0.1, height: sWidth * 0.1 },
            !source && { backgroundColor: colors.secondary },
          ]}
        />
      )}
    </Dot>
  );
};
