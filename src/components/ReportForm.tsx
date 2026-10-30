"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle2,
  X,
  Navigation,
  UserCheck
} from "lucide-react";
import { ReportFormData } from "@/lib/actions";
import { useReportForm } from "@/hooks/useReportForm";
import { LocationPickerMap } from "./LocationPickerMap";
import { CameraCaptureModal } from "./CameraCaptureModal";

interface ReportFormProps {
  initialData?: Partial<ReportFormData> & { id?: string };
  onSubmit: (data: ReportFormData) => Promise<{ success: boolean; error?: string }>;
  isEditing?: boolean;
}

const OUTLET_TYPES = [
  "Retail",
  "Wholesale",
  "Distributor",
  "Supermarket",
  "Pharmacy",
  "Hospital",
  "School",
  "Clinic",
  "Clinics",
  "Other",
];

const INTEREST_LEVELS = ["Interested", "Maybe", "Not Interested"];

const STANDEE_TYPES = [
  "None",
  "Standard Roll-up",
  "Luxury Teardrop",
  "Acrylic Display",
  "Counter Stand",
];

export function ReportForm({
  initialData,
  onSubmit,
  isEditing = false,
}: ReportFormProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const {
    formData,
    isSubmitting,
    imageUploading,
    errorMsg,
    gpsLoading,
    gpsSuccess,
    handleChange,
    handleCaptureLocation,
    handlePinLocation,
    handleImageChange,
    uploadImageFile,
    handleRemoveImage,
    handleSubmit,
    handleCancel,
  } = useReportForm({ initialData, onSubmit });

  // Base input class: text-base on mobile to prevent iOS Safari auto-zoom, text-xs on sm screens
  const inputClass =
    "w-full px-3 py-2.5 sm:py-2 text-base sm:text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl pb-4">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Outlet Details */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Outlet Details</h3>
            <p className="text-[11px] text-[#737784]">Basic business and contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Firm / Outlet Name <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              placeholder="e.g. Apex Supermarket"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Owner / Contact Person <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className={inputClass}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#171923]">
                Mobile Number <span className="text-[#FF5722]">*</span>
              </label>
              <span className={`text-[10px] ${formData.mobileNumber.length === 10 ? "text-emerald-600 font-semibold" : "text-[#737784]"}`}>
                {formData.mobileNumber.length}/10 digits
              </span>
            </div>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Outlet Type
            </label>
            <select
              name="outletType"
              value={formData.outletType}
              onChange={handleChange}
              className={inputClass}
            >
              {OUTLET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Report Added By / Sales Executive <span className="text-[#FF5722]">*</span>
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-[#737784] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy || ""}
                onChange={handleChange}
                placeholder="e.g. Sales Executive Name"
                className={`${inputClass} pl-9`}
                required
              />
            </div>
            <p className="text-[10px] text-[#737784] mt-1">
              Identity of the field executive or team member recording this visit report
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Media & Location */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">
              Media & Location <span className="text-[#FF5722]">*</span>
            </h3>
            <p className="text-[11px] text-[#737784]">Storefront photo and GPS verification (mandatory)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Image Upload */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#171923]">
                Outlet Image Upload <span className="text-[#FF5722]">*</span>
              </label>
              {formData.outletImage && (
                <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Photo Uploaded
                </span>
              )}
            </div>
            {imageUploading ? (
              <div className="flex flex-col items-center justify-center min-h-[240px] sm:h-full border border-[#E5E7EB] rounded-lg bg-[#F8F9FA] p-4 text-center">
                <div className="w-7 h-7 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-semibold text-[#171923]">
                  Uploading to Cloudinary...
                </span>
                <span className="text-[11px] text-[#737784] mt-0.5">
                  Optimizing and securing storefront photo CDN link
                </span>
              </div>
            ) : formData.outletImage ? (
              <div className="flex flex-col gap-2">
                <div className="relative border border-[#E5E7EB] rounded-lg overflow-hidden bg-gray-50 h-52 sm:h-64 w-full group">
                  <Image
                    src={formData.outletImage}
                    alt="Outlet storefront preview"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-white/95 hover:bg-white text-red-600 p-1.5 rounded-full shadow-md border border-[#E5E7EB] cursor-pointer transition-transform hover:scale-105"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-medium text-[#FF5722] bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                    <span>Retake</span>
                  </button>
                  <label className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-medium text-[#171923] bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5 shrink-0 text-[#737784]" />
                    <span>From Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between min-h-[240px] sm:h-full border-2 border-dashed border-[#E5E7EB] hover:border-[#FF5722]/50 rounded-lg bg-[#F8F9FA]/60 p-4 transition-colors">
                <div className="text-center my-auto py-2">
                  <div className="w-11 h-11 rounded-full bg-orange-50 text-[#FF5722] flex items-center justify-center mx-auto mb-2 border border-orange-100 shadow-2xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#171923]">
                    Storefront Photo Required
                  </h4>
                  <p className="text-[11px] text-[#737784] mt-0.5 max-w-xs mx-auto">
                    Take a live photo or upload from your device
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                  {/* Camera Option */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
                  >
                    <Camera className="w-4 h-4 shrink-0" />
                    <span>Camera</span>
                  </button>

                  {/* File Upload Option */}
                  <label className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white hover:bg-[#F3F4F6] text-[#171923] border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs text-center">
                    <Upload className="w-4 h-4 shrink-0 text-[#737784]" />
                    <span>Upload from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* GPS Location Capture & Interactive Pinpoint Map */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#171923]">
                  GPS Location & Map Pin <span className="text-[#FF5722]">*</span>
                </label>
                {formData.latitude && formData.longitude && (
                  <span className="text-[10px] text-[#737784] font-mono">
                    {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleCaptureLocation}
                  disabled={gpsLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-medium bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#171923] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 text-[#FF5722] ${gpsLoading ? "animate-spin" : ""}`} />
                  {gpsLoading ? "Acquiring Coordinates..." : "Capture GPS Coordinates"}
                </button>
                {gpsSuccess && (
                  <span className="inline-flex items-center text-xs text-emerald-600 font-medium gap-1 self-start sm:self-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Coordinates Set
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Small Map */}
            <div>
              <LocationPickerMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={handlePinLocation}
              />
            </div>

            {formData.latitude && formData.longitude && (
              <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#737784] font-medium block uppercase tracking-wider">
                      Detected Place:
                    </span>
                    <span className="font-semibold text-[#171923] text-xs leading-snug block mt-0.5 truncate">
                      {formData.locationAddress || "Pinned Location"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Location / Place Name <span className="text-[#FF5722]">*</span>
              </label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress || ""}
                onChange={handleChange}
                placeholder="e.g. Kadru, Ranchi, Jharkhand"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Visit & Follow-up */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Visit & Follow-up</h3>
            <p className="text-[11px] text-[#737784]">Interest, proposal, and scheduled next contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Interest Level
            </label>
            <select
              name="interestLevel"
              value={formData.interestLevel}
              onChange={handleChange}
              className={inputClass}
            >
              {INTEREST_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Report Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Quote Price (₹)
            </label>
            <input
              type="number"
              name="quotePrice"
              value={formData.quotePrice === null || formData.quotePrice === undefined ? "" : formData.quotePrice}
              onChange={handleChange}
              placeholder="e.g. 35000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Follow-up Time
            </label>
            <input
              type="text"
              name="followUpTime"
              value={formData.followUpTime || ""}
              onChange={handleChange}
              placeholder="e.g. 11:30 AM"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Standee Type
            </label>
            <select
              name="standeeType"
              value={formData.standeeType || "None"}
              onChange={handleChange}
              className={inputClass}
            >
              {STANDEE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Follow-up Remarks / Action Items
            </label>
            <textarea
              name="followUpRemarks"
              rows={2}
              value={formData.followUpRemarks || ""}
              onChange={handleChange}
              placeholder="e.g. Owner requested catalog with organic tier pricing..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Feedback / Visit Notes
            </label>
            <textarea
              name="feedback"
              rows={2}
              value={formData.feedback || ""}
              onChange={handleChange}
              placeholder="e.g. High footfall outlet, interested in counter unit..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-medium text-[#737784] hover:text-[#171923] bg-white border border-[#E5E7EB] rounded-md hover:bg-[#F8F9FA] transition-colors cursor-pointer text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || imageUploading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 sm:py-2 text-xs font-medium text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-xs disabled:opacity-50 cursor-pointer text-center"
        >
          {isSubmitting
            ? "Saving Report..."
            : imageUploading
            ? "Uploading Photo..."
            : isEditing
            ? "Update Report"
            : "Save Report"}
        </button>
      </div>

      {/* Live In-App Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(blob) => {
          uploadImageFile(blob);
        }}
      />
    </form>
  );
}
