import { apiRequest } from "@/lib/api/client";

export interface GeneratePostInput {
  businessType: string;
  goal: string;
  tone?: string;
}

export interface GeneratePostResponse {
  content: string;
  provider: "openai" | "template";
}

export const assistantApi = {
  generatePost(input: GeneratePostInput) {
    return apiRequest<GeneratePostResponse>("/assistant/generate-post", {
      method: "POST",
      auth: true,
      body: JSON.stringify(input),
    });
  },
};
