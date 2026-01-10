import open from "open";
import axios from "axios";
import { api } from "./api";
import { saveToken, clearToken, getToken } from "../utils/config";

interface DeviceStartResponse {
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  poll_interval: number;
}

interface DevicePollResponse {
  status: "approved" | "expired" | "pending";
  token?: string;
  poll_interval?: number;
}

export async function loginWithProvider(provider: string) {
  if (provider !== "google") {
    console.log("Choose provider: google");
    process.exit(1);
  }

  const { data } = await api.post<DeviceStartResponse>("/auth/device/start", {
    provider,
  });

  console.log("\nOpen this URL in your browser:");
  console.log(data.verification_url);
  console.log("\nEnter code:", data.user_code);

  await open(data.verification_url);

  await pollForToken(data.device_code);
}

async function pollForToken(deviceCode: string) {
  process.stdout.write("\nWaiting for authorization");

  let pollInterval = 3000; // Default 3 seconds

  while (true) {
    await new Promise((r) => setTimeout(r, pollInterval));
    process.stdout.write(".");

    let data;
    try {
      const response = await api.post<DevicePollResponse>("/auth/device/poll", {
        device_code: deviceCode,
      });
      data = response.data;

      // Update poll interval if provided by server
      if (data.poll_interval) {
        pollInterval = data.poll_interval * 1000; // Convert seconds to milliseconds
      }
    } catch (error) {
      console.log("\n✖ Error polling for authorization");

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          console.log(`  Status: ${error.response.status}`);
          console.log(`  Message: ${error.response.statusText}`);
          if (error.response.data) {
            console.log(`  Details:`, error.response.data);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.log(`  No response received from server`);
        } else {
          // Error setting up the request
          console.log(`  Error: ${error.message}`);
        }
      } else {
        // Unknown error type
        console.log(`  Error:`, error);
      }

      process.exit(1);
    }

    if (!data) {
      console.log("\n✖ Error: No data received");
      process.exit(1);
    }

    if (data.status === "approved") {
      if (!data.token) {
        console.log("\n✖ Error: No token received");
        process.exit(1);
      }
      saveToken(data.token);
      console.log("\n✔ Logged in successfully");
      return;
    }

    if (data.status === "expired") {
      console.log("\n✖ Login expired");
      process.exit(1);
    }
  }
}

export async function logout() {
  clearToken();
  console.log("✔ Logged out");
}

export async function authStatus() {
  const token = getToken();
  if (!token) {
    console.log("Not logged in");
    return;
  }

  const { data } = await api.get("/auth/me");
  console.log(`✔ Logged in as ${data?.email}`);
}
