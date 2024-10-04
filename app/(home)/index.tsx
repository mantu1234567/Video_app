import { formatSlug } from '@/lib/slugs'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { Call, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import Dialog from "react-native-dialog";
export default function IndexScreen() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [isRefreshing,setIsRefreshing] = useState(false);
  const [isMyCalls,setIsMyCalls] = useState(false);

  const[calls,setCalls]= useState<Call[]>([]);
  const router = useRouter();
  const {signOut} = useAuth();

  const fetchCalls = async () => {
if(!client || !user) return;
const {calls} = await client.queryCalls({
  filter_conditions: isMyCalls ? {
       // filtercalls where is the create or a member of the call
       $or:[
        { created_by_user_id: user.id },

        { members: { $in: [user.id] } },

       ],
  }:{},
  sort:[{field:"created_at", direction: -1}],
  watch :true
});
//sort calls by participants count
const sortedCalls = calls.sort((a,b)=>{
  return b.state.participantCount-a.state.participantCount;
});
setCalls(sortedCalls);
  }
    useEffect(() => {
    
    fetchCalls();
    
    }, [isMyCalls]);
    
     const handleRefresh = async ()=>{
      setIsRefreshing(true);
      await fetchCalls();
      setIsRefreshing(false);
     };

     const handleJoinRoom =async(id:string) =>{
      router.push(`/(home)/${id}`);
     }
 const [dialogOpen,setDialogOpen] = useState(false);
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
      <FlatList
      data={calls}
      keyExtractor={(item)=>item.id}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={{paddingBottom:100}}
      renderItem={({item})=>(
        <TouchableOpacity
          key={item.id}
          onPress={(()=>handleJoinRoom(item.id))}
          disabled={item.state.participantCount === 0}
          style={{
            padding: 20,
           backgroundColor:
item.state.participantCount === 0 ? "#f1f1f1": "#fff",
opacity: item.state.participantCount === 0?0.5:1,
borderBottomWidth: 1,
borderBottomColor:
item.state.participantCount === 0 ? "#fff": "#f1f1f1",
flexDirection: "row",
alignItems: "center",
gap:10,

          }}
          >
            {item.state.participantCount === 0 ? (
              <Feather name='phone-off' size={24} color={"gray"}/>
            ):(
              <Feather name='phone-call' size={24} color={"gray"}/>
            )}
            <Image
            source={{uri:item.state.createdBy?.image}}
            style={{
              width:50,
              height:50,
              borderRadius:25,
            }}
            />
          <View style={{flex:1,
            justifyContent:"space-between"
          }}>
            <View
            style={{flex:1,
              justifyContent:"space-between",
              flexDirection:"row",
              alignItems:"center"
            }}
            >
              {/* */}
              <View>
       <Text
           style={{
       fontWeight: "bold",
fontSize: 16,
}}
>
{item.state.createdBy?.name ||
item.state.createdBy?.custom.email.split("@") [0]}
</Text>
<Text
style={{
fontSize: 12,
}}
>
{item.state.createdBy?.custom.email}
</Text>
</View>
               {/* */}
               {/* */}

               <View>
                <Text
                style={{
                  fontSize:10,
                  textAlign:"right",
                  width:100,
                }}
                >
               {formatSlug(item.id)}
                </Text>
                 {/* */}
                 <View
style={{
flexDirection: "row",
alignItems: "center",
}}
>
{item.state.participantCount === 0 ? (
<Text
style={{
fontSize: 10,
fontWeight: "bold",
color: "#5F5DEC",
}}
>
Call Ended
</Text>
):(
<View
style={{
borderRadius: 5,
flexDirection: "row",
alignItems: "center",
backgroundColor: "#f1f1f1",
padding: 10,
}}
>
  <Entypo
  name='users'
  size={14}
  color="#5F5DEC"
  style={{
    marginRight:5,
  }}
  />
  <Text
  style={{
    color:"#5F5DEC",
    fontWeight:'bold',
  }}
  >
 {item.state.participantCount}
  </Text>
  </View>
  )}
  </View>
                  {/* */}
               </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      />
      
    </View>
  )
}