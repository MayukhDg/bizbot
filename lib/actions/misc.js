"use server"

import Business from "@/models/Business";
import { dbConnect } from "../db"


export async function getBusinessDetails(id) {
  try {
    await dbConnect();
    const business  = await Business.findById(id).lean();
    return JSON.parse(JSON.stringify(business));
  } catch (error) {
    console.error("Error fetching business details:", error);
    throw new Error("Could not fetch business details");
  }

}