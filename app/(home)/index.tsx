import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Call, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native'
import Dialog from "react-native-dialog";

export default function IndexScreen() {
  const { user } = useUser();
  const [calls, setCalls] = useState<Call[]>([]);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const {signOut} = useAuth();
   const client = useStreamVideoClient();
 const [dialogOpen,setDialogOpen] = useState(false);

 const fetchCalls = async () => {
  if (!client || !user) return;
  const { calls } = await client.queryCalls({
    filter_conditions: isMyCalls ? {
          // filtercalls where is the create or a member of the call
          $or: [
            { created_by_user_id: user.id },

            { members: { $in: [user.id] } },
          ],
        } : {},
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
}, [isMyCalls])

  return (
    <View>
      <TouchableOpacity
      style={{position:'absolute',
        top:20,
        right:20,
        zIndex:100
      }}
      onPress={()=>setDialogOpen(true)}
      >
      <MaterialCommunityIcons name='exit-run' size={24} color="#5F5DEC"/>
      </TouchableOpacity>
      <Dialog.Container visible={dialogOpen}>
      <Dialog.Title>Sign out</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to sign out?.
      </Dialog.Description>
      <Dialog.Button label="Sign out" 
      onPress={async()=>{
        await signOut();
        setDialogOpen(false);
      }}
      />
      
    </Dialog.Container>
      <Text>Hello word</Text>
      <SignedIn>
      <Text> You are Sign In ghgh</Text>
      </SignedIn>
      
    </View>
  )
}