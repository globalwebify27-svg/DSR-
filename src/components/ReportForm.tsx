"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  Navigation
} from "lucide-react";
import { ReportFormData } from "@/lib/actions";

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
  const router = useRouter();

  const [formData, setFormData] = useState<ReportFormData>({
    firmName: initialData?.firmName || "",
    ownerName: initialData?.ownerName || "",
    mobileNumber: initialData?.mobileNumber || "",
    outletType: initialData?.outletType || "Retail",
    interestLevel: initialData?.interestLevel || "Interested",
    status: initialData?.status || "Pending",
    quotePrice: initialData?.quotePrice || null,
    followUpDate: initialData?.followUpDate || "",
    followUpTime: initialData?.followUpTime || "",
    standeeType: initialData?.standeeType || "None",
    followUpRemarks: initialData?.followUpRemarks || "",
    feedback: initialData?.feedback || "",
    outletImage: initialData?.outletImage || null,
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    locationAddress: initialData?.locationAddress || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(Boolean(initialData?.latitude));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quotePrice" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationAddress: prev.locationAddress || "Current GPS Location",
        }));
        setGpsLoading(false);
        setGpsSuccess(true);
      },
      (error) => {
        setGpsLoading(false);
        setErrorMsg(
          error.message || "Failed to retrieve GPS location. Please check browser permissions."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        outletImage: reader.result as string,
      }));
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.firmName.trim()) {
      setErrorMsg("Firm Name is required.");
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMsg("Owner Name is required.");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMsg("Mobile Number is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await onSubmit(formData);
      if (res.success) {
        router.push("/reports");
      } else {
        setErrorMsg(res.error || "Failed to save report.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Outlet Details */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Outlet Details</h3>
            <p className="text-[11px] text-[#737784]">Basic business and contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Mobile Number <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
            >
              {OUTLET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Visit & Follow-up */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Visit & Follow-up</h3>
            <p className="text-[11px] text-[#737784]">Interest, proposal, and scheduled next contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Interest Level
            </label>
            <select
              name="interestLevel"
              value={formData.interestLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
            >
              {STANDEE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors resize-none"
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
              className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Media & Location */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Media & Location</h3>
            <p className="text-[11px] text-[#737784]">Storefront photo and GPS verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Outlet Image Upload
            </label>
            {formData.outletImage ? (
              <div className="relative border border-[#E5E7EB] rounded-md overflow-hidden bg-gray-50 p-2">
                <img
                  src={formData.outletImage}
                  alt="Outlet preview"
                  className="w-full h-36 object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, outletImage: null }))}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 p-1 rounded-full shadow-xs border border-[#E5E7EB] cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-[#E5E7EB] rounded-md hover:border-[#FF5722]/50 hover:bg-[#F8F9FA] transition-colors cursor-pointer p-4 text-center">
                <Upload className="w-6 h-6 text-[#737784] mb-1.5" />
                <span className="text-xs font-medium text-[#171923]">
                  Click to upload outlet image
                </span>
                <span className="text-[11px] text-[#737784] mt-0.5">
                  PNG, JPG or WEBP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* GPS Location Capture */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                GPS Location Capture
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCaptureLocation}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#171923] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 text-[#FF5722] ${gpsLoading ? "animate-spin" : ""}`} />
                  {gpsLoading ? "Acquiring Coordinates..." : "Capture GPS Coordinates"}
                </button>
                {gpsSuccess && (
                  <span className="inline-flex items-center text-xs text-emerald-600 font-medium gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                  </span>
                )}
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="p-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[11px] text-[#737784] space-y-0.5">
                <div>Latitude: <span className="font-mono text-[#171923] font-medium">{formData.latitude.toFixed(6)}</span></div>
                <div>Longitude: <span className="font-mono text-[#171923] font-medium">{formData.longitude.toFixed(6)}</span></div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Location / Address Description
              </label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress || ""}
                onChange={handleChange}
                placeholder="e.g. Connaught Place, Block B, New Delhi"
                className="w-full px-3 py-2 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-[#171923] placeholder-[#737784] focus:outline-hidden focus:border-[#FF5722] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-xs font-medium text-[#737784] hover:text-[#171923] bg-white border border-[#E5E7EB] rounded-md hover:bg-[#F8F9FA] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting
            ? "Saving Report..."
            : isEditing
            ? "Update Report"
            : "Save Report"}
        </button>
      </div>
    </form>
  );
}
