import { View, Text, ActivityIndicator } from 'react-native'
import  { useEffect, useState } from 'react'
import { Call, CallingState, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { useLocalSearchParams } from 'expo-router';

export default function CallScreen() {
  const {id} = useLocalSearchParams();
  const [call,setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const [slug,setSlug] = useState<string | null>(null);
  useEffect(()=>{
    let slug:string;
    if(id !=='(home)' && id){
      //join an existing call
      slug = id.toString();
      const _call = client?.call("default",slug);
      _call?.join({create:false}).then(()=>{
        setCall(_call);
      });
    }
    else{
      slug ="demoroom";
      //  slug = generateSlug(3,{
      //   categories: {
      //     adjective: ["color","personality"],
      //     noun: ["animals","food"],
      //   }
      // });
      //creating a new call

      const _call = client?.call("default",slug);
      _call?.join({create:true}).then(()=>{
        // have a toast popup
        // Toast.show(
        //   "Call create sussefuly Tap here to copy the call ID to share",
        //   {
        //     duration:Toast.durations.LONG,
        //     position:Toast.positions.CENTER,
        //     shadow:true,
        //     onPress:async()=>{
        //       copySlug(slug);
        //     },
        //   }
        // );
        setCall(_call);
      });

     }
    setSlug(slug);
   
  },[id,client]); 


  useEffect(()=>{
    // cleanup function run where the co,mponent unmounts
    if(call?.state.callingState !== CallingState.LEFT){
      call?.leave();
    }
  },[call]);

  if(!call || !slug){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
       <ActivityIndicator size="large"/>
      </View>
    );
  }
  return (
    <StreamCall call={call}>
     {/* <Room slug={slug}/> */}
     <Text>Call fjkhfdjkhg</Text>
    </StreamCall>
  )
}