import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRouter } from 'expo-router';
import Toast from 'react-native-root-toast';
import { inverseFormatSlug } from '@/lib/slugs';

export default function JoinPage() {
  const [roomId, setRoomId] = useState("");
  const client = useStreamVideoClient();
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) {
      // Show toast if room ID is empty
      Toast.show("Please enter a valid room name.", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
      });
      return;
    }

    const slug = inverseFormatSlug(roomId);
    const call = client?.call("default", slug);

    // If the call is valid, proceed to get the room
    call?.get()
      .then((callResponse) => {
        console.log(callResponse);
        router.push(`/(home)/${slug}`);
      }).catch((reason) => {
        console.error(reason.message);

        // Display error toast
        Toast.show(
          "Whoops!\nLooks like the room you're trying to join does not exist.",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
          }
        );
      });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ paddingBottom: 20, fontWeight: "bold", fontSize: 18 }}>Enter the Room Name</Text>
      <TextInput
        placeholder="e.g Black Purple Tiger"
        value={roomId}
        onChangeText={setRoomId}
        style={{
          padding: 15,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 10,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={handleJoinRoom}
        style={{
          padding: 15,
          backgroundColor: "red",
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
}
