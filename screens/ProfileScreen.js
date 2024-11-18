import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State để quản lý Modal

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserInfo(userDoc.data());
          } else {
            console.log("Không tìm thấy thông tin người dùng trong Firestore.");
          }
        } else {
          console.log("Không có người dùng nào đang đăng nhập.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Gọi Firebase Auth signOut
      setModalVisible(false); // Đóng Modal
      navigation.navigate("Login"); // Điều hướng đến màn hình Login
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={require("../assets/images/icons/profile.png")}
      />
      {userInfo ? (
        <>
          <Text style={styles.text}>Họ và tên: {userInfo.name}</Text>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>Số điện thoại: {userInfo.phoneNumber}</Text>
        </>
      ) : (
        <Text style={styles.text}>Không tìm thấy thông tin người dùng.</Text>
      )}
      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => setModalVisible(true)} // Hiển thị Modal
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Log out</Text>
      </TouchableOpacity>

      {/* Modal Xác Nhận */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Đóng modal khi nhấn ngoài
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)} // Đóng Modal
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout} // Thực hiện đăng xuất
              >
                <Text style={styles.modalButtonText}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  btnLogout: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "red",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#d3d3d3",
  },
  confirmButton: {
    backgroundColor: "#ff6347",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
