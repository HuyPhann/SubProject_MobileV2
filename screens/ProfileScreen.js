import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, updatePassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State for logout modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // State for change password modal
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false); // State for notification modal
  const [notificationMessage, setNotificationMessage] = useState(""); // State for notification message
  const [newPassword, setNewPassword] = useState(""); // New password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [passwordError, setPasswordError] = useState(""); // Password error

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
      await signOut(auth); // Call Firebase Auth signOut
      setModalVisible(false); // Close the modal
      navigation.navigate("Login"); // Navigate to Login screen
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword); // Update password
        setNotificationMessage("Mật khẩu của bạn đã được thay đổi."); // Set success message
        setNotificationModalVisible(true); // Show notification modal
        setPasswordModalVisible(false); // Close the change password modal
      } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error.message);
        setNotificationMessage("Đã xảy ra lỗi khi thay đổi mật khẩu."); // Set error message
        setNotificationModalVisible(true); // Show notification modal
      }
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
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Họ và tên: </Text>
            <Text style={styles.text}>{userInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Email: </Text>
            <Text style={styles.text}>{userInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Số điện thoại: </Text>
            <Text style={styles.text}>{userInfo.phoneNumber}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.text}>Không tìm thấy thông tin người dùng.</Text>
      )}

      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => setPasswordModalVisible(true)} // Show change password modal
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color:'white' }}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => setModalVisible(true)} // Show logout modal
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color:'white' }}>Log out</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Close modal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn đăng xuất?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout} // Logout action
              >
                <Text style={styles.modalButtonText}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Đổi mật khẩu của bạn</Text>

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setPasswordModalVisible(false)} // Close modal
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleChangePassword} // Change password action
              >
                <Text style={styles.modalButtonText}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={notificationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotificationModalVisible(false)} // Close notification modal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{notificationMessage}</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => setNotificationModalVisible(false)} // Close modal
            >
              <Text style={styles.modalButtonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Thanh điều hướng ở cuối */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Search Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/search.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorite Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/white_heart.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Booking Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/booking.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Inbox Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/inbox.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile Home Screen")}
        >
          <Image
            source={require("../assets/images/icons/profile.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor:'lightgray'
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  btnLogout: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#00BCD4",
    borderRadius: 10,
    height:30,
    alignItems:'center',
    justifyContent: "center",
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
  nput: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row", // Sắp xếp các phần tử theo chiều ngang
    marginBottom: 10, // Khoảng cách giữa các dòng
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    width: "100%",
    position: "absolute",
    bottom: 0, // Đảm bảo bottomNav nằm ở dưới cùng
    backgroundColor:'white'
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    color: "#888",
  },
  navTextActive: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
