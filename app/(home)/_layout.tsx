import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth, useUser } from '@clerk/clerk-expo'
import {
  LogLevel,
  logLevels,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
const apiKey =process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;
console.log(apiKey);
console.log(process.env.EXPO_PUBLIC_API_URL);
if(!apiKey){
  throw new Error(
    "Missing API key"
  );
}
export default function CallRoutesLayout() {
     const { isSignedIn} = useAuth();
     const {user:clerkUser} = useUser();
     if(!isSignedIn || !clerkUser || !apiKey){
        return <Redirect href={"/(auth)/sign-in"}/>;
     }
 const user:User={
  id:clerkUser.id,
  name:clerkUser.fullName!,
  image:clerkUser.imageUrl!,
 };

 const tokenProvider=async () =>{
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({

          userId: clerkUser.id,
          
          name: clerkUser.fullName!,
          
          image: clerkUser.imageUrl!,
          
          email: clerkUser.primaryEmailAddress?.toString()!, 
        }),
          
    }
  );
  const data = await response.json();
   console.log(data.token);
return data.token;

 }
 const client = StreamVideoClient.getOrCreateInstance({ apiKey, user, tokenProvider,
  options:{
    logger:(logLevel:LogLevel,message:string,...args:unknown[])=>{},
  },

  });
  return (
    <SafeAreaView style={{flex:1}}>
      <StreamVideo client={client}>
      <Tabs
      screenOptions={({route}) => ({
        header:()=>null,
        tabBarStyle:{
            display:route.name === "[id]" ? "none":"flex",
        },
        tabBarLabelStyle:{
            zIndex:100,
            paddingBottom:5,
        },
      })}
      >
       <Tabs.Screen
       name='index'
       options={{
        title:"All Calls",
        tabBarIcon:({color}) => (
            <Ionicons name='call-outline' size={24} color={color} />
        ),
       }}
       />
       <Tabs.Screen name='[id]' options={{
        title:"Start a New Call",
        unmountOnBlur:true,
        header:()=>null,
       }}/>
       <Tabs.Screen
       name='join'
       options={{
        title:"Join Call",
        headerTitle:"Enter the Room ID",
        tabBarIcon:({color}) => (
            <Ionicons name='enter-outline' size={24} color={color} />
        ),
       }}
       />
        </Tabs>
        </StreamVideo>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})