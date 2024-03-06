import { PageContainer } from "~/components/core/Layout";
import { Text } from "~/components/core/Text";
import { useSession } from "~/ctx/AuthContext";
import { useRouter } from "expo-router";
import { updateUserProfile } from "~/db";
import { UserProfileSchemaType } from "~/types.schema";
import { EditProfileForm } from "~/components/forms/EditProfile";

export default function EditProfilePage() {
  const session = useSession();
  const router = useRouter();

  const handleProfileUpdate = async (formValues: UserProfileSchemaType) => {
    try {
      await updateUserProfile(formValues);
      await session.reloadUser();

      router.replace("/");
    } catch (e) {
      console.log("handleProfileUpdate error", e);
    }
  };

  return (
    <PageContainer>
      <Text.H1>Edit profile</Text.H1>
      <EditProfileForm
        onSubmit={handleProfileUpdate}
        defaultValues={
          session.authenticated
            ? {
                displayName: session.user?.displayName,
                photoURL: session.user?.photoURL,
              }
            : undefined
        }
      />
    </PageContainer>
  );
}
