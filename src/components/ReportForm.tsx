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
  const [imageUploading, setImageUploading] = useState(false);
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
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        let detectedPlaceName = "Detected Location";

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              const addr = data.address || {};
              const parts = [
                addr.suburb || addr.neighbourhood || addr.road,
                addr.city || addr.town || addr.county || addr.state_district,
                addr.state,
              ].filter(Boolean);
              detectedPlaceName = parts.length > 0 ? parts.join(", ") : data.display_name;
            }
          }
        } catch {
          // If offline or network issue, fallback cleanly
          detectedPlaceName = "Current GPS Location";
        }

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          locationAddress: prev.locationAddress && prev.locationAddress !== "Current GPS Location"
            ? prev.locationAddress
            : detectedPlaceName,
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 10MB limit. Please select a smaller photo.");
      return;
    }

    try {
      setImageUploading(true);
      setErrorMsg(null);

      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary");
      }

      setFormData((prev) => ({
        ...prev,
        outletImage: data.url,
      }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err?.message || "Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

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
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Mobile Number <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
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
        </div>
      </div>

      {/* Section 2: Visit & Follow-up */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            2
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

      {/* Section 3: Media & Location */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E5E7EB]">
          <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171923]">Media & Location</h3>
            <p className="text-[11px] text-[#737784]">Storefront photo and GPS verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Outlet Image Upload
            </label>
            {imageUploading ? (
              <div className="flex flex-col items-center justify-center h-36 border border-[#E5E7EB] rounded-md bg-[#F8F9FA] p-4 text-center">
                <div className="w-6 h-6 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-medium text-[#171923]">
                  Uploading to Cloudinary...
                </span>
                <span className="text-[11px] text-[#737784] mt-0.5">
                  Optimizing and securing image CDN link
                </span>
              </div>
            ) : formData.outletImage ? (
              <div className="relative border border-[#E5E7EB] rounded-md overflow-hidden bg-gray-50 p-2">
                <img
                  src={formData.outletImage}
                  alt="Outlet preview"
                  className="w-full h-36 object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, outletImage: null }))}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full shadow-xs border border-[#E5E7EB] cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-[#E5E7EB] rounded-md hover:border-[#FF5722]/50 hover:bg-[#F8F9FA] transition-colors cursor-pointer p-4 text-center">
                <Upload className="w-6 h-6 text-[#737784] mb-1.5" />
                <span className="text-xs font-medium text-[#171923]">
                  Tap to capture or upload photo
                </span>
                <span className="text-[11px] text-[#737784] mt-0.5">
                  Uploads directly to Cloudinary (Max 10MB)
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleCaptureLocation}
                  disabled={gpsLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#171923] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 text-[#FF5722] ${gpsLoading ? "animate-spin" : ""}`} />
                  {gpsLoading ? "Acquiring Coordinates..." : "Capture GPS Coordinates"}
                </button>
                {gpsSuccess && (
                  <span className="inline-flex items-center text-xs text-emerald-600 font-medium gap-1 self-start sm:self-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                  </span>
                )}
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-md text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[11px] text-[#737784] font-medium block">
                      Location Name:
                    </span>
                    <span className="font-semibold text-[#171923] text-xs leading-snug block mt-0.5">
                      {formData.locationAddress || "Locating place name..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Location / Place Name
              </label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress || ""}
                onChange={handleChange}
                placeholder="e.g. Kadru, Ranchi, Jharkhand"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
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
    </form>
  );
}
