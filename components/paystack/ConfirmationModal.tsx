import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onConfirmLabel?: string;
  onCancelLabel?: string;
};

const ConfirmationModal = ({
  visible,
  setVisible,
  title,
  description,
  onConfirm,
  onCancel,
  onCancelLabel = "Cancel",
  onConfirmLabel = "Confirm",
}: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#0097a7",
                },
              ]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>{onCancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setVisible(false);
                onConfirm();
              }}
            >
              <Text style={styles.confirmText}>{onConfirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000020",
  },
  contentContainer: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  titleText: {
    textAlignVertical: "center",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    textAlignVertical: "center",
    textAlign: "center",
    color: "#8B8B8B",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    justifyContent: "flex-end",
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#0097a7",
  },
  cancelText: {
    color: "#0097a7",
  },
  confirmText: {
    color: "#fff",
  },
});
