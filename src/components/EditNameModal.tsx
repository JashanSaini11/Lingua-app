import { isClerkAPIResponseError, useUser } from "@clerk/expo";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/hooks/useThemeColors";
import { posthog } from "@/lib/posthog";

type EditNameModalProps = {
  onClose: () => void;
};

// Lets the learner change the name saved in their Clerk account.
// Render this only while it should be shown (`{open && <EditNameModal />}`),
// so the fields start with the current name every time it opens.
export function EditNameModal({ onClose }: EditNameModalProps) {
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "h-12 rounded-2xl border border-border bg-surface px-4 font-poppins-medium text-body-lg text-text-primary";

  const save = async () => {
    if (!user || saving) return;

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      posthog?.capture("profile_name_updated");
      onClose();
    } catch (caught) {
      setError(
        isClerkAPIResponseError(caught)
          ? (caught.errors[0]?.longMessage ?? caught.errors[0]?.message ?? "")
          : "We couldn't save your name. Please try again.",
      );
      setSaving(false);
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        // Android does not resize a modal for the keyboard, so "padding" is
        // needed there too. The card sits near the top so both fields stay
        // above the keyboard even on small screens.
        behavior="padding"
        style={{
          flex: 1,
          justifyContent: "flex-start",
          paddingTop: insets.top + 24,
          paddingHorizontal: 20,
          backgroundColor: "rgba(13, 19, 43, 0.5)",
        }}
      >
        {/* Tapping outside the card closes the modal */}
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View className="rounded-[28px] bg-card p-6">
          <Text className="font-poppins-bold text-[20px] text-text-primary">
            Edit your name
          </Text>
          <Text className="typography--body-sm mt-1 text-text-secondary">
            This is how your teacher and the app will greet you.
          </Text>

          <Text className="mb-1 mt-5 font-poppins-medium text-body-sm text-text-secondary">
            First name
          </Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            autoComplete="given-name"
            autoFocus
            className={inputClass}
            style={{ padding: 0, paddingHorizontal: 16 }}
          />

          <Text className="mb-1 mt-4 font-poppins-medium text-body-sm text-text-secondary">
            Last name
          </Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name (optional)"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            autoComplete="family-name"
            className={inputClass}
            style={{ padding: 0, paddingHorizontal: 16 }}
          />

          {error !== "" && (
            <Text className="typography--body-sm mt-3 text-error">{error}</Text>
          )}

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="h-12 flex-1 items-center justify-center rounded-2xl bg-surface"
            >
              <Text className="font-poppins-semibold text-h4 text-text-primary">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={saving}
              onPress={save}
              className="h-12 flex-1 items-center justify-center rounded-2xl bg-lingua-deep-purple"
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="font-poppins-semibold text-h4 text-white">
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
