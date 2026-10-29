"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReportFormData } from "@/lib/actions";

interface UseReportFormProps {
  initialData?: Partial<ReportFormData> & { id?: string };
  onSubmit: (data: ReportFormData) => Promise<{ success: boolean; error?: string }>;
}

export function useReportForm({ initialData, onSubmit }: UseReportFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ReportFormData>({
    firmName: initialData?.firmName || "",
    ownerName: initialData?.ownerName || "",
    mobileNumber: initialData?.mobileNumber || "",
    outletType: initialData?.outletType || "Retail",
    interestLevel: initialData?.interestLevel || "Interested",
    status: initialData?.status || "Pending",
    reportedBy: initialData?.reportedBy || "",
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
    if (name === "mobileNumber") {
      // Allow only numbers and limit input to maximum 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        mobileNumber: digitsOnly,
      }));
      return;
    }
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
          detectedPlaceName = "Current GPS Location";
        }

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          locationAddress:
            prev.locationAddress && prev.locationAddress !== "Current GPS Location"
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

  const handlePinLocation = async (lat: number, lon: number) => {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLon = parseFloat(lon.toFixed(6));

    setFormData((prev) => ({
      ...prev,
      latitude: roundedLat,
      longitude: roundedLon,
    }));
    setGpsSuccess(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${roundedLat}&lon=${roundedLon}`,
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
          const detectedPlaceName = parts.length > 0 ? parts.join(", ") : data.display_name;
          setFormData((prev) => ({
            ...prev,
            locationAddress: detectedPlaceName,
          }));
        }
      }
    } catch {
      // Keep existing address or silent fail for geocoding
    }
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
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, outletImage: null }));
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
    if (formData.mobileNumber.length !== 10) {
      setErrorMsg("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!formData.reportedBy?.trim()) {
      setErrorMsg("Sales Executive name is mandatory. Please enter who recorded this report.");
      return;
    }
    if (!formData.outletImage) {
      setErrorMsg("Outlet storefront photo is mandatory. Please capture or upload an image.");
      return;
    }
    if (
      formData.latitude === null ||
      formData.latitude === undefined ||
      formData.longitude === null ||
      formData.longitude === undefined
    ) {
      setErrorMsg("GPS Location is mandatory. Please click 'Capture GPS Coordinates' or pin on the map.");
      return;
    }
    if (!formData.locationAddress?.trim()) {
      setErrorMsg("Location / Place Name is mandatory.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await onSubmit(formData);
      if (res.success) {
        router.refresh();
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

  return {
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
    handleRemoveImage,
    handleSubmit,
    handleCancel: () => router.back(),
    setErrorMsg,
  };
}
