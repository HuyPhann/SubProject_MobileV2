import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable ,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import các hàm từ Firestore
import { db } from "../firebaseConfig"; // Import Firestore instance


const Register = ({route}) => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { phoneNumber } = route.params;
 

const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");

const handleRegister = async () => {
  if (!name || !email || !password) {
    setModalMessage("Vui lòng điền đầy đủ thông tin.");
    setModalVisible(true);
    return;
  }

  try {
    // Đăng ký người dùng bằng email và mật khẩu
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Lấy đối tượng người dùng
    const user = userCredential.user;

    // Lưu thông tin người dùng bổ sung vào Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid, // Lưu Firebase Auth UID
      name: name,
      email: email,
      phoneNumber: phoneNumber,
    });

    // Xóa dữ liệu input và hiển thị thông báo thành công
    setEmail("");
    setPassword("");
    setName("");
    setModalMessage("Register success!");
    setModalVisible(true);
  } catch (error) {
    let message = "Đăng ký thất bại!";
    if (error.code === "auth/email-already-in-use") {
      message = "Email này đã được sử dụng.";
    } else if (error.code === "auth/invalid-email") {
      message = "Định dạng email không hợp lệ.";
    } else if (error.code === "auth/weak-password") {
      message = "Mật khẩu phải ít nhất 6 ký tự.";
    }
    setModalMessage(message);
    setModalVisible(true);
  }
};

  return (
    <View style={styles.container}>
      
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logos/app-logo.png")}
          style={styles.logo}
        />

        <Text style={{ fontSize: 40, fontWeight: "bold" }}>Register</Text>
        <Text>Create a new account</Text>
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
           value={name}
           onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "visibility" : "visibility-off"}
              size={20}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginlink}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleRegister}
        >
          <Text style={styles.continueButtonText}>REGISTER</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{modalMessage}</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  if (modalMessage === "Registration successful!") {
                    navigation.navigate("Login");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity>
            <FontAwesome
              name="google"
              size={30}
              color="red"
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="facebook"
              size={30}
              color="blue"
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="apple"
              size={30}
              color="black"
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius:50
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
    width: 250,
    height: 40,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  loginlink: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
    alignSelf: "flex-end",
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: 250,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "gray",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "gray",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 20,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
  },
});
