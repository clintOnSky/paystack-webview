import * as React from "react";
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationModal from "./ConfirmationModal";
import { PayStackProps, PayStackRef } from "@/utils/types/paystack";
import { getAmountValueInKobo, getChannels } from "@/utils/helper";

const CLOSE_URL = "https://standard.paystack.co/close";

const Paystack: React.ForwardRefRenderFunction<PayStackRef, PayStackProps> = (
  {
    paystackKey,
    billingEmail,
    billingMobile,
    lastName,
    firstName,
    amount = "0.00",
    currency = "NGN",
    channels = ["card"],
    refNumber,
    billingName,
    subaccount,
    handleWebViewMessage,
    onCancel,
    autoStart = false,
    onSuccess,
    activityIndicatorColor = "green",
  },
  ref
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleConfirmModalVisible = (value: boolean) => {
    setIsConfirmModalVisible(value);
  };

  useEffect(() => {
    if (autoStart) {
      setShowModal(true);
    }
  }, [autoStart]);

  useImperativeHandle(ref, () => ({
    startTransaction() {
      setShowModal(true);
    },
    endTransaction() {
      // setShowModal(false);
      webViewRef.current?.postMessage(JSON.stringify({ event: "cancelled" }));
      const redirectTo =
        "window.location = 'https://standard.paystack.co/close'";
      webViewRef.current?.injectJavaScript(redirectTo);
    },
  }));

  const refNumberString = refNumber ? `ref: '${refNumber}',` : "";
  const subAccountString = subaccount ? `subaccount: '${subaccount}',` : "";

  const Paystackcontent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paystack</title>
        </head>
          <body onload="payWithPaystack()" style="background-color:#fff;height:100vh">
            <script src="https://js.paystack.co/v2/inline.js"></script>
            <script type="text/javascript">
              window.onload = payWithPaystack;
              function payWithPaystack(){
              var paystack = new PaystackPop();
              paystack.newTransaction({
                key: '${paystackKey}',
                email: '${billingEmail}',
                firstname: '${firstName}',
                lastname: '${lastName}',
                phone: '${billingMobile}',
                amount: ${getAmountValueInKobo(amount)},
                currency: '${currency}',
                ${getChannels(channels)}
                ${refNumberString}
                ${subAccountString}
                metadata: {
                custom_fields: [
                        {
                        display_name:  '${firstName + " " + lastName}',
                        variable_name:  '${billingName}',
                        value:''
                        }
                ]},
                onSuccess: function(response){
                      var resp = {event:'successful', transactionRef:response};
                        window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                },
                onCancel: function(){
                    var resp = {event:'cancelled'};
                    window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                }
                });
                }
            </script>
          </body>
      </html>
      `;

  const messageReceived = (data: string) => {
    const webResponse = JSON.parse(data);
    console.log("🚀 ~ messageReceived ~ webResponse:", webResponse);
    if (handleWebViewMessage) {
      handleWebViewMessage(data);
    }
    switch (webResponse.event) {
      case "cancelled":
        setShowModal(false);
        onCancel({ status: "cancelled" });
        break;

      case "successful":
        setShowModal(false);
        const reference = webResponse.transactionRef;

        if (onSuccess) {
          onSuccess({
            status: "success",
            transactionRef: reference,
            data: webResponse,
          });
        }
        break;

      default:
        if (handleWebViewMessage) {
          handleWebViewMessage(data);
        }
        break;
    }
  };

  const onNavigationStateChange = (state: WebViewNavigation) => {
    const { url } = state;
    console.log("🚀 ~ onNavigationStateChange ~ url:", url);
    if (url === CLOSE_URL) {
      setShowModal(false);
    }
  };

  // const hideConfirmModal = () => {
  //   setIsConfirmModalVisible(false);
  // };
  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmAction = () => {
    webViewRef.current?.postMessage(JSON.stringify({ event: "cancelled" }));
    const redirectTo = "window.location = 'https://standard.paystack.co/close'";
    webViewRef.current?.injectJavaScript(redirectTo);
  };

  return (
    <>
      <Modal
        style={{ flex: 1 }}
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={showConfirmModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity onPress={showConfirmModal}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>
          <WebView
            style={[{ flex: 1 }]}
            source={{ html: Paystackcontent }}
            onMessage={(e) => {
              messageReceived(e.nativeEvent?.data);
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
            ref={webViewRef}
            cacheEnabled={false}
            cacheMode={"LOAD_NO_CACHE"}
          />

          {isLoading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={activityIndicatorColor} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
      <ConfirmationModal
        visible={isConfirmModalVisible}
        setVisible={handleConfirmModalVisible}
        title="Cancel Payment"
        description="Are you sure you want to terminate this payment transaction?"
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default forwardRef(Paystack);
