import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthRoutesLayout() {
    const {isSignedIn} = useAuth();
    if(isSignedIn){
        return <Redirect href={"/(home)"} />;
    }
  return (
    <SafeAreaView style ={{flex:1}}>
        <Stack>
            <Stack.Screen
            name="sign-in"
            options={{
                title:"Sign In to get started",
                headerShown:false,
            }}
            />
            <Stack.Screen
            name="sign-up"
            options={{
                title:"Create a new Account",
                headerBackTitle:"Sign In",
                headerStyle:{backgroundColor:"#5F5DEC"},
                headerTintColor:'white',
                
            }}
            />
      </Stack>
    </SafeAreaView>
  )
}