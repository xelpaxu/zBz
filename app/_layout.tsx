import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Manrope_700Bold, useFonts } from "@expo-google-fonts/manrope";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react"; // Add this
import { ConvexProviderWithClerk } from "convex/react-clerk"; // Add this
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";
import { tokenCache } from "../lib/cache";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key.");
}

// 1. Initialize the Convex Client
const convex = new ConvexReactClient(CONVEX_URL);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  function UserSync() {
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.storeUser);

    useEffect(() => {
      if (isAuthenticated) {
        // This sends the Clerk profile data to your Convex 'users' table
        storeUser();
      }
    }, [isAuthenticated, storeUser]);

    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PUBLISHABLE_KEY}>
      <ClerkLoaded>
        {/* 2. Wrap the Stack with the Convex-Clerk Provider */}
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <UserSync />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
            <Stack.Screen name="(auth)/signup" options={{ title: "Sign Up" }} />
            <Stack.Screen name="(root)/index" options={{ title: "Home" }} />
          </Stack>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
