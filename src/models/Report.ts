import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport {
  firmName: string;
  ownerName: string;
  mobileNumber: string;
  outletType: string;
  interestLevel: string;
  status: string;
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

ReportSchema.index({ interestLevel: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ followUpDate: 1 });

export const Report: Model<IReportDocument> =
  mongoose.models.Report || mongoose.model<IReportDocument>("Report", ReportSchema);

