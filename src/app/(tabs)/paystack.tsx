import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useRef } from "react";
import Paystack from "@/components/paystack/Paystack";
import { PayStackRef } from "@/utils/types/paystack";
import { useFocusEffect } from "expo-router";

type Props = {};

const Payment = (props: Props) => {
  const paystackRef = useRef<PayStackRef>(null);

  useFocusEffect(
    useCallback(() => {
      paystackRef.current?.startTransaction();
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Paystack
        billingName="Clinton Sky"
        billingEmail="asgardianclinton@gmail.com"
        amount={1000}
        paystackKey="pk_test_626c9d0a7a0fcc01adb7bf21fb6d985bccf2d5b6"
        onCancel={(e) => console.log("Cancelled")}
        onSuccess={(e) => console.log("Success")}
        ref={paystackRef}
      />
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({});
