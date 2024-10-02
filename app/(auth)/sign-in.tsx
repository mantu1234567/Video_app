import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import SignInWithOAuth from '@/components/SignInWithOAuth'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "whoops!",
        "Looks like youentered the wrong email or password"
      );
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View style={{backgroundColor:"#5F5DEC",justifyContent:'center',paddingHorizontal:20}}>
       <MaterialIcons
       name='video-chat'
       size={160}
       color='white'
       style={{alignSelf:'center',paddingBottom:20}}
       />
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <SignInWithOAuth/>
      <View>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}