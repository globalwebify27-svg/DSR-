import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport {
  firmName: string;
  ownerName: string;
  mobileNumber: string;
  outletType: string;
  interestLevel: string;
  status: string;
  reportedBy?: string | null;
  quotePrice?: number | null;
  followUpDate?: string | null;
  followUpTime?: string | null;
  standeeType?: string | null;
  followUpRemarks?: string | null;
  feedback?: string | null;
  outletImage?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReportDocument extends IReport, Document {}

const ReportSchema = new Schema<IReportDocument>(
  {
    firmName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    outletType: { type: String, required: true },
    interestLevel: { type: String, required: true },
    status: { type: String, default: "Pending" },
    reportedBy: { type: String, default: null, trim: true },
    quotePrice: { type: Number, default: null },
    followUpDate: { type: String, default: null },
    followUpTime: { type: String, default: null },
    standeeType: { type: String, default: "None" },
    followUpRemarks: { type: String, default: null },
    feedback: { type: String, default: null },
    outletImage: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    locationAddress: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ interestLevel: 1, createdAt: -1 });
ReportSchema.index({ status: 1, followUpDate: 1 });
ReportSchema.index({ followUpDate: 1, followUpTime: 1 });
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ reportedBy: 1 });
ReportSchema.index({
  firmName: "text",
  ownerName: "text",
  mobileNumber: "text",
  reportedBy: "text",
});

// In Next.js development hot module reload, recompile model if schema changed
if (process.env.NODE_ENV !== "production" && mongoose.models?.Report) {
  delete (mongoose.models as Record<string, unknown>).Report;
}

export const Report: Model<IReportDocument> =
  mongoose.models.Report || mongoose.model<IReportDocument>("Report", ReportSchema);

