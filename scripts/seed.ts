import mongoose from "mongoose";
import { Report } from "../src/models/Report";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI or DATABASE_URL must be defined in your environment or .env file.");
  process.exit(1);
}

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];
const todayStr = formatDate(today);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = formatDate(tomorrow);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 5);
const nextWeekStr = formatDate(nextWeek);

const seedReports = [
  {
    firmName: "Apex Retail Mart",
    ownerName: "Rajesh Kumar",
    mobileNumber: "+91 98765 43210",
    outletType: "Supermarket",
    interestLevel: "Interested",
    status: "In Progress",
    quotePrice: 45000,
    followUpDate: todayStr,
    followUpTime: "11:30 AM",
    standeeType: "Standard Roll-up",
    followUpRemarks: "Owner requested in-person demo and contract draft.",
    feedback: "Great location on Main Road, high footfall, wants display installed near checkout.",
    latitude: 28.6139,
    longitude: 77.209,
    locationAddress: "Connaught Place, New Delhi",
  },
  {
    firmName: "Metro Meds & Healthcare",
    ownerName: "Dr. Sunita Sharma",
    mobileNumber: "+91 98111 22334",
    outletType: "Pharmacy",
    interestLevel: "Interested",
    status: "Pending",
    quotePrice: 28000,
    followUpDate: todayStr,
    followUpTime: "02:00 PM",
    standeeType: "Acrylic Display",
    followUpRemarks: "Discuss margin percentages and billing cycle.",
    feedback: "Interested in health essentials counter display unit.",
    latitude: 28.5355,
    longitude: 77.391,
    locationAddress: "Sector 18, Noida",
  },
  {
    firmName: "Starline Distributors",
    ownerName: "Vikram Malhotra",
    mobileNumber: "+91 98222 33445",
    outletType: "Distributor",
    interestLevel: "Interested",
    status: "In Progress",
    quotePrice: 120000,
    followUpDate: todayStr,
    followUpTime: "04:30 PM",
    standeeType: "Luxury Teardrop",
    followUpRemarks: "Provide volume discount tier matrix for 500+ units.",
    feedback: "Handles 40+ sub-retailers in South Delhi area.",
    latitude: 28.5245,
    longitude: 77.2066,
    locationAddress: "Saket District Centre, New Delhi",
  },
  {
    firmName: "Gupta General Stores",
    ownerName: "Manoj Gupta",
    mobileNumber: "+91 97333 44556",
    outletType: "Retail",
    interestLevel: "Maybe",
    status: "Pending",
    quotePrice: 15000,
    followUpDate: tomorrowStr,
    followUpTime: "10:30 AM",
    standeeType: "Counter Stand",
    followUpRemarks: "Need to check space with partner before placing order.",
    feedback: "Decent store size, slightly hesitant on upfront deposit.",
    latitude: 28.6507,
    longitude: 77.2334,
    locationAddress: "Chandni Chowk, Delhi",
  },
  {
    firmName: "Urban Mart Daily",
    ownerName: "Ananya Deshmukh",
    mobileNumber: "+91 99444 55667",
    outletType: "Supermarket",
    interestLevel: "Interested",
    status: "Completed",
    quotePrice: 65000,
    followUpDate: "2026-10-25",
    followUpTime: "03:00 PM",
    standeeType: "Standard Roll-up",
    followUpRemarks: "Deal signed and standee delivered.",
    feedback: "Contract finalized for 6-month product placement.",
    latitude: 28.4595,
    longitude: 77.0266,
    locationAddress: "Cyber City, Gurugram",
  },
  {
    firmName: "Sharma Electronics & Goods",
    ownerName: "Deepak Sharma",
    mobileNumber: "+91 98555 66778",
    outletType: "Wholesale",
    interestLevel: "Not Interested",
    status: "Completed",
    quotePrice: null,
    followUpDate: null,
    followUpTime: null,
    standeeType: "None",
    followUpRemarks: "Not currently stocking FMCG categories.",
    feedback: "Focused purely on electrical fixtures and appliances.",
    latitude: 28.6692,
    longitude: 77.1265,
    locationAddress: "Karol Bagh, New Delhi",
  },
  {
    firmName: "Prime Care Chemists",
    ownerName: "Rakesh Verma",
    mobileNumber: "+91 98666 77889",
    outletType: "Pharmacy",
    interestLevel: "Maybe",
    status: "Pending",
    quotePrice: 22000,
    followUpDate: nextWeekStr,
    followUpTime: "12:00 PM",
    standeeType: "Acrylic Display",
    followUpRemarks: "Wants customer product samples first.",
    feedback: "Good footfall near hospital entrance.",
    latitude: 28.5672,
    longitude: 77.21,
    locationAddress: "AIIMS Campus Area, New Delhi",
  },
  {
    firmName: "Green Valley Organics",
    ownerName: "Pooja Hegde",
    mobileNumber: "+91 98777 88990",
    outletType: "Retail",
    interestLevel: "Interested",
    status: "In Progress",
    quotePrice: 38000,
    followUpDate: tomorrowStr,
    followUpTime: "05:00 PM",
    standeeType: "Standard Roll-up",
    followUpRemarks: "Send product catalog with certified organic certificates.",
    feedback: "Very enthusiastic about natural product range.",
    latitude: 28.5284,
    longitude: 77.219,
    locationAddress: "Hauz Khas, New Delhi",
  },
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected! Clearing existing reports...");
  await Report.deleteMany({});
  console.log("Inserting seed reports...");
  await Report.insertMany(seedReports);
  console.log(`Successfully seeded ${seedReports.length} reports into MongoDB.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

