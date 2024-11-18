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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import hàm đúng
import { auth } from "../firebaseConfig"; // Import đối tượng auth từ cấu hình của bạn



const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
 
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        setModalMessage("Login success!");
        setModalVisible(true);
        
      })
      .catch((error) => {
        let errorMessage = "Login fail, check email and passwork again!";
        if (error.code === "auth/user-not-found") {
          errorMessage = "Người dùng không tồn tại.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Mật khẩu không chính xác.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Email không hợp lệ.";
        }
        setModalMessage(errorMessage);
        setModalVisible(true);
      });
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage === "Login success!") {
      navigation.navigate("Search Home Screen");
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logos/app-logo.png")}
          style={styles.logo}
        />
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>Login</Text>
        <Text>Login into your account</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerlink}>Register</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
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

export default Login;

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
  registerlink: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
    alignSelf: "flex-end",
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: "blue",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
