import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";
import { FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatSlug } from "@/lib/slugs";
export default function IndexScreen() {
  const { user } = useUser();
  const [calls, setCalls] = useState<Call[]>([]);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const { signOut } = useAuth();
  const client = useStreamVideoClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCalls = async () => {
    if (!client || !user) return;
    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls
        ? {
            // filtercalls where is the create or a member of the call
            $or: [
              { created_by_user_id: user.id },

              { members: { $in: [user.id] } },
            ],
          }
        : {},
      sort: [{ field: "created_at", direction: -1 }],
      watch: true,
    });
    //sort calls by participants count
    const sortedCalls = calls.sort((a, b) => {
      return b.state.participantCount - a.state.participantCount;
    });
    setCalls(sortedCalls);
  };

  useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  };

  const handleJoinRoom = async (id: string) => {
    router.push(`/(home)/${id}`);
  };

  return (
    <View>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
        onPress={() => setDialogOpen(true)}
      >
        <MaterialCommunityIcons name="exit-run" size={24} color="#5F5DEC" />
      </TouchableOpacity>
      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to sign out?.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button
          label="Sign out"
          onPress={async () => {
            await signOut();
            setDialogOpen(false);
          }}
        />
      </Dialog.Container>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleJoinRoom(item.id)}
            disabled={item.state.participantCount === 0}
            style={{
              padding: 20,
              backgroundColor:
                item.state.participantCount === 0 ? "#f1f1f1" : "#fff",
              opacity: item.state.participantCount === 0 ? 0.5 : 1,
              borderBottomWidth: 1,
              borderBottomColor:
                item.state.participantCount === 0 ? "#fff" : "#f1f1f1",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {item.state.participantCount === 0 ? (
              <Feather name="phone-off" size={24} color="gray" />
            ) : (
              <Feather name="phone-call" size={24} color="gray" />
            )}

            <Image
              source={{ uri: item.state.createdBy?.image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.state.createdBy?.name ||
                      (item.state.createdBy?.custom?.email
                        ? item.state.createdBy.custom.email.split("@")[0]
                        : "Unknown")}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {item.state.createdBy?.custom?.email ||
                      "No email available"}
                  </Text>
                </View>

                <View>
                  <Text style={{
                      fontSize: 10,
                      textAlign: "right",
                      width: 100,
                    }}
                  >{formatSlug(item.id)}</Text>
                  
                  </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
