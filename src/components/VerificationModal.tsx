import { useState } from "react";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "@/constants/images";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  email: string;
  onClose: () => void;
  // Called as soon as the last digit is entered
  onSubmit: (code: string) => Promise<void>;
};

// Render this only while it should be shown (`{open && <VerificationModal />}`),
// so the code starts empty every time it opens.
export function VerificationModal({
  email,
  onClose,
  onSubmit,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = async (text: string) => {
    if (submitting) return;

    const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      setSubmitting(true);
      await onSubmit(digits);
      // Still here means the code was wrong, so let the user try again.
      setSubmitting(false);
      setCode("");
    }
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* Padding pushes the card up so it always sits above the keyboard. */}
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          backgroundColor: "rgba(13, 19, 43, 0.5)",
        }}
      >
        {/* Tapping outside the card closes the modal */}
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="items-center rounded-[28px] bg-white px-6 pb-8 pt-9"
          style={{
            shadowColor: "#0d132b",
            shadowOpacity: 0.18,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 12,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClose}
            hitSlop={12}
            className="absolute right-4 top-4 size-9 items-center justify-center rounded-full bg-surface"
          >
            <Image source={images.close} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>

          <View className="size-[72px] items-center justify-center rounded-full bg-bubble-indigo">
            <Image source={images.mail} style={{ width: 32, height: 32 }} />
          </View>

          <Text className="mt-5 text-center font-poppins-bold text-[22px] text-text-primary">
            Check your email
          </Text>
          <Text className="mt-2 text-center font-poppins text-body-md text-text-secondary">
            {"We've sent you an email"}
            {email ? (
              <Text className="font-poppins-medium text-text-primary">
                {` at ${email}`}
              </Text>
            ) : null}
            {". Enter the 6-digit verification code to continue."}
          </Text>

          <View className="mt-7 h-[45px] w-full">
            <View className="h-full flex-row justify-between">
              {Array.from({ length: CODE_LENGTH }, (_, index) => {
                const digit = code[index];
                const isActive =
                  index === Math.min(code.length, CODE_LENGTH - 1);

                return (
                  <View 
                    key={index}
                    className={`h-full w-[14.5%] items-center justify-center rounded-2xl border-[1.5px] ${
                      isActive
                        ? "border-lingua-deep-purple bg-white"
                        : digit
                          ? "border-bubble-indigo bg-bubble-indigo"
                          : "border-border bg-surface"
                    }`}
                  >
                    <Text className="font-poppins-semibold text-[22px] text-lingua-deep-purple">
                      {digit ?? ""}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TextInput
              value={code}
              onChangeText={handleChange}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              autoFocus
              caretHidden
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 0,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
