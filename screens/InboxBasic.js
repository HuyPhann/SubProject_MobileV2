import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";

const InboxBasic = ({ navigation, item }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState(""); // State to hold the text input

  const getRandomResponse = (userMessage) => {
    const responses = {
      greetings: [
        "Hello! How can I assist you today?",
        "Nice to meet you! Do you need any help from me?",
        "Hi ! How can I help you?",
      ],
      farewell: [
        "Goodbye! Have a great day!",
        "See you later! Let me know if you need anything else.",
        "Byeee! We hope you will have a good experience with us.",
      ],     
      cheapest: [
        "If you're looking for budget-friendly options, Vietnam has some amazing deals! Consider visiting Hanoi or Ho Chi Minh City for affordable accommodations.",
        "For the cheapest options, I recommend checking out local guesthouses or homestays in Vietnam. They're often very affordable and offer a great experience!",
        "Vietnam is known for its affordability. You can find plenty of budget-friendly activities and accommodations, especially in places like Da Nang or Nha Trang.",
      ],
      costly: [
        "If you're looking for something more luxurious, Vietnam offers high-end resorts in places like Phu Quoc and Hoi An.",
        "While Vietnam is generally affordable, there are also many upscale experiences available, especially in cities like Hanoi and Ho Chi Minh City.",
        "For a costly yet unforgettable experience, you might want to try luxury cruises in Ha Long Bay or high-end resorts along the coast.",
      ],
      asia: [
        "Asia is full of incredible destinations! Vietnam is a must-visit, with its rich culture and stunning landscapes.",
        "In Asia, Vietnam stands out with its beautiful scenery, delicious cuisine, and warm hospitality. Don't miss it!",
        "If you're exploring Asia, Vietnam offers a unique blend of history, nature, and vibrant cities that are worth your time.",
      ],
      whereShouldIGo: [
        "I highly recommend visiting Vietnam! You can explore the stunning Halong Bay, vibrant cities like Ho Chi Minh City, and historical sites in Hue.",
        "For a great travel experience, consider Vietnam. The food, culture, and landscapes are truly captivating!",
        "If you're wondering where to go, Vietnam should be at the top of your list! From the beaches of Da Nang to the mountains in Sapa, there's something for everyone.",
      ],
      default: [
        "That's interesting! Tell me more.",
        "Could you elaborate on that?",
        "I'm not sure I understand. Can you explain?",
      ],
    };

    // Chuyển đổi tin nhắn của người dùng về chữ thường
    userMessage = userMessage.toLowerCase();

    if (userMessage.includes("hi") || userMessage.includes("hello")) {
      return responses.greetings[
        Math.floor(Math.random() * responses.greetings.length)
      ];
    } else if (userMessage.includes("bye") || userMessage.includes("goodbye")) {
      return responses.farewell[
        Math.floor(Math.random() * responses.farewell.length)
      ];
    } else if (userMessage.includes("cheapest")) {
      return responses.cheapest[
        Math.floor(Math.random() * responses.cheapest.length)
      ];
    } else if (userMessage.includes("costly")) {
      return responses.costly[
        Math.floor(Math.random() * responses.costly.length)
      ];
    } else if (userMessage.includes("asia")) {
      return responses.asia[Math.floor(Math.random() * responses.asia.length)];
    } else if (userMessage.includes("where should i go")) {
      return responses.whereShouldIGo[
        Math.floor(Math.random() * responses.whereShouldIGo.length)
      ];
    } else {
      return responses.default[
        Math.floor(Math.random() * responses.default.length)
      ];
    }
  };
  console.log("Current messages:", messages);

  const onSend = (newMessages = []) => {
    console.log("Messages to send:", newMessages); // Log tin nhắn gửi đi

    // Append new message from user
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0]?.text; // Lấy tin nhắn từ người dùng
    if (userMessage) {
      console.log("User message:", userMessage); // Log tin nhắn của người dùng
      const responseMessage = {
        _id: Math.random().toString(36).substring(7), // ID ngẫu nhiên
        text: getRandomResponse(userMessage), // Lấy phản hồi tự động từ hàm
        createdAt: new Date(),
        user: {
          _id: 2, // ID của bot
          name: "Bot",
          avatar: require("../assets/images/logos/app-logo.png"), // Hình đại diện của bot
        },
      };

      // Tạo độ trễ 1 giây trước khi bot phản hồi
      setTimeout(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [responseMessage])
        );
      }, 1000);
    }
  };

  const handleEmojiPress = (emoji) => {
    setText(text + emoji); // Append emoji to the text input
  };

  const renderEmojiButtons = () => {
    const emojis = ["😊", "😂", "😍", "😢", "😎", "👍", "🎉"];
    return (
      <View style={styles.emojiContainer}>
        {emojis.map((emoji) => (
          <TouchableOpacity key={emoji} onPress={() => handleEmojiPress(emoji)}>
            <Text style={styles.emojiButton}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1, // ID của người dùng
        }}
        placeholder="Type a message..."
        alwaysShowSend
        text={text} // Điều khiển text input
        onInputTextChanged={(text) => {
          console.log("Text input changed:", text); // Log giá trị input
          setText(text);
        }}
        // Cập nhật text input
      />

      {/* Render emoji buttons above the text input */}
      {renderEmojiButtons()}

      {/* Bottom navigation */}
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
          onPress={() => navigation.navigate("Booking Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/booking.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Inbox Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/inbox.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile Home Screen")}
          style={styles.navItem}
        >
          <Image
            source={require("../assets/images/icons/profile.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  emojiButton: {
    fontSize: 24,
    padding: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
    padding: 5,
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
    color: "#00BCD4", // Aqua color for active tab
    fontWeight: "bold",
  },
});

export default InboxBasic;
