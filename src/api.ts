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

export const fetchTour = async ({
  tourId, 
  userId
}: {
  tourId: number, 
  userId: string
}) => {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("*")
      .eq("id", tourId)
      .eq("user_id", userId)
      .single();
    
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

export const updateTour = async ({
  tourId,
  steps,
  key,
}: {
  tourId: number;
  steps: Step[];
  key: string;
}): Promise<Step[] | null> => {
  try {
    console.log(steps, 'from api steps');
    
    const { data, error } = await supabase
      .from("Tours")
      .update({ steps: steps })
      .eq("id", tourId)
      .eq("user_id", key)
      .select();
    
    if (error) {
      console.error("Error updating tour:", error);
      return null;
    }

    console.log("Updated tour:", data);
    return data?.[0]?.steps ?? null;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};