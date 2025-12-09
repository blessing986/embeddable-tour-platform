import supabase from "./supabase";
import type { Step } from "./types";

 type Tour = {
    id: number;
    user_id: string;
    name: string;
    description: string;
    steps: Step[];
    created_at: string;
}

export const fetchTour = async ({tourId, userId}: {tourId: number, userId: string}) => {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("*")
      .eq("id", tourId)
      .eq("user_id", userId)
      .single(); // ensures only one result
    
    if (error) {
      console.error("Error fetching tour:", error);
      return null;
    }
     console.log(data);
    return data as Tour;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
