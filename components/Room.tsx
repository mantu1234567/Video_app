import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { copySlug, formatSlug } from '@/lib/slugs'
// import { useRouter } from 'expo-router'
// import { SlideInUp } from 'react-native-reanimated'
 import { CallContent } from '@stream-io/video-react-native-sdk'
 
export default function Room({slug}:{slug:string }) {
    // const router = useRouter();
  return (
    <View>
        {/* <View
        style={{position:"absolute",
            top:10,
            left:10,
            zIndex:100,
        }}
        >
        <RoomId slug={slug} />
        </View> */}
     <GestureHandlerRootView style={{flex:1}}>
     {/* <CallContent onHangupCallHandler={()=>router.back()}/> */}
     <CallContent/>
     </GestureHandlerRootView>
    </View>
  );
}

// const RoomId = ({slug}:{slug:string | null}) =>{
//     return(
//         <TouchableOpacity
//         onPress={()=> copySlug(slug)}
//         style={{
//             backgroundColor:"rgba(0,0,0,0.5)",
//             padding:10,
//             borderRadius:5,
//         }}
//         >
//          <Text
//          style={{color:"white",}}
//          >
//             Call ID:{formatSlug(slug)}
//          </Text>
    
//         </TouchableOpacity>
//     )
//}