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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
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
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const user = auth.currentUser;
  //       if (user) {
  //         const usersRef = collection(db, "users");
  //         const q = query(usersRef, where("uid", "==", user.uid));
  //         const querySnapshot = await getDocs(q);

  //         if (!querySnapshot.empty) {
  //           const userDoc = querySnapshot.docs[0];
  //           setUserInfo(userDoc.data());
  //         } else {
  //           console.log("Không tìm thấy thông tin người dùng trong Firestore.");
  //         }
  //       } else {
  //         console.log("Không có người dùng nào đang đăng nhập.");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy thông tin người dùng:", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserInfo();
  // }, []);
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
            setUserInfo({ ...userDoc.data(), docId: userDoc.id });
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
      console.error("Error while logging out:", error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Confirmation password does not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("The new password must have at least 6 characters.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword); // Update password
        setNotificationMessage("Your password has been changed. "); // Set success message
        setNotificationModalVisible(true); // Show notification modal
        setPasswordModalVisible(false); // Close the change password modal
      } catch (error) {
        console.error("Error when changing password:", error.message);
        setNotificationMessage(
          "An error occurred while changing the password."
        ); // Set error message
        setNotificationModalVisible(true); // Show notification modal
      }
    }
  };

  const handleEditInfo = async () => {
    if (!name || !birthDay || !address || !phoneNumber) {
      setNotificationMessage("Please fill in all information.");
      setNotificationModalVisible(true);
      return;
    }

    try {
      const userDocRef = doc(db, "users", userInfo.docId);
      await updateDoc(userDocRef, { name, birthDay, address, phoneNumber });

      // Update state with new information
      setUserInfo((prev) => ({
        ...prev,
        name,
        birthDay,
        address,
        phoneNumber,
      }));
      setEditModalVisible(false);
      setNotificationMessage("Updated information successfully!");
    } catch (error) {
      console.error("Error updating information:", error.message);
      setNotificationMessage("An error occurred while updating information.");
    } finally {
      setNotificationModalVisible(true);
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
        source={require("../assets/images/icons/user.png")}
      />
      {userInfo ? (
        <>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Full name: </Text>
            <Text style={styles.text}>{userInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Email: </Text>
            <Text style={styles.text}>{userInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Phone number: </Text>
            <Text style={styles.text}>{userInfo.phoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Birthday: </Text>
            <Text style={styles.text}>{userInfo.birthDay}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.text, styles.boldText]}>Addrees: </Text>
            <Text style={styles.text}>{userInfo.address}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.text}>No user information found.</Text>
      )}

      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => {
          setEditModalVisible(true);
          setName(userInfo.name);
          setBirthDay(userInfo.birthDay);
          setAddress(userInfo.address);
          setPhoneNumber(userInfo.phoneNumber);
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
          Update information
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => setPasswordModalVisible(true)} // Show change password modal
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
          Change password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnLogout2}
        onPress={() => setModalVisible(true)} // Show logout modal
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
          Log out
        </Text>
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
              Are you sure you want to sign out?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout} // Logout action
              >
                <Text style={styles.modalButtonText}>Sign out</Text>
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
            <Text style={styles.modalText}>Change your password</Text>

            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
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
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleChangePassword} // Change password action
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Info Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Update information</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Birthday"
              value={birthDay}
              onChangeText={setBirthDay}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleEditInfo}
              >
                <Text style={styles.modalButtonText}>Save</Text>
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
              <Text style={styles.modalButtonText}>OK</Text>
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
    backgroundColor: "lightgray",
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
    height: 30,
    alignItems: "center",
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
    backgroundColor: "white",
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
  btnLogout2: {
    //marginTop: 20,
    padding: 15,
    backgroundColor: "#00BCD4",
    borderRadius: 10,
    height: 50,
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
    marginBottom:100
  },
});

export default ProfileScreen;
