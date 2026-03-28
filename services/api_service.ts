import { Platform } from "react-native";

// Change this to your laptop's IPv4 address (e.g., 192.168.x.x)
const IP_ADDRESS = "192.168.1.39";
// const IP_ADDRESS_NICOLE = "192.168.254.105";

const API_BASE_URL = `http://${IP_ADDRESS}:8000`;

export interface Detection {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface AnalysisResponse {
  verified: boolean;
  detections: Detection[];
  reasoning: string;
  accuracy: string;
  message: string;
  processed_image?: string;
}

/**
 * Sends image and user description to the FastAPI server
 * @param imageUri URI of the image from camera/gallery
 * @param description User's text description of the site
 */
export const analyzeImage = async (
  imageUri: string,
  description: string,
): Promise<AnalysisResponse> => {
  const formData = new FormData();

  // Prepare the image file for upload
  const uri =
    Platform.OS === "android" ? imageUri : imageUri.replace("file://", "");

  formData.append("file", {
    uri: uri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);

  formData.append("description", description);

  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        // Note: fetch will automatically set the multipart boundary
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Server responded with an error");
    }

    const result: AnalysisResponse = await response.json();

    // Logging for your UI debugging
    console.log("✅ AI Reasoning Received:", result.reasoning);
    console.log("✅ Detection Accuracy:", result.accuracy);

    return result;
  } catch (error) {
    console.error("API service error:", error);
    throw error;
  }
};
