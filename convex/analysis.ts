import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

export const processAndSaveReport = action({
  args: {
    image: v.string(),
    description: v.string(),
    lat: v.number(),
    lng: v.number(),
    locationName: v.string(),
  },
  // Explicitly define the return type here to fix the "implicitly has type any" error
  handler: async (ctx, args): Promise<Id<"reports">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // 1. Convert Base64 to a Uint8Array (Web Standard)
    const base64Data = args.image.replace(/^data:image\/\w+;base64,/, "");

    // Use atob to decode base64 string to binary string
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Create the FormData
    const formData = new FormData();
    // Wrap the bytes in a Blob for the multipart upload
    const imageBlob = new Blob([bytes], { type: "image/jpeg" });

    formData.append("file", imageBlob, "image.jpg");
    formData.append("description", args.description);

    // 3. Send to Python Backend
    const response = await fetch(
      "https://automatically-unbefriended-misty.ngrok-free.dev/detect",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`AI Server Error: ${response.status}`);
    }

    const result = await response.json();

    // 4. Save to Database
    return await ctx.runMutation(api.reports.createReport, {
      userId: identity.subject,
      userName: identity.name || "Anonymous",
      description: args.description,
      imageUri: args.image,
      processedImage: result.processed_image || "",
      reasoning: result.reasoning || "Analysis complete.",
      accuracy: (result.accuracy ?? 0).toString(),
      verified: !!result.verified,
      detections: JSON.stringify(result.detections || []),
      locationName: args.locationName,
      lat: args.lat,
      lng: args.lng,
      status: result.verified ? "CRITICAL" : "LOW RISK",
    });
  },
});
