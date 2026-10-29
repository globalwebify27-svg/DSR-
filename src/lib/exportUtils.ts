import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportItem } from "@/components/DataTable";

export function exportToExcel(
  reports: ReportItem[],
  filename = "dsr-reports.xlsx"
) {
  if (!reports || reports.length === 0) {
    alert("No records to export.");
    return;
  }

  const data = reports.map((item, idx) => ({
    "S.No": idx + 1,
    "Firm Name": item.firmName || "",
    "Owner Name": item.ownerName || "",
    "Reported By": item.reportedBy || "",
    "Mobile Number": item.mobileNumber || "",
    "Outlet Type": item.outletType || "",
    "Interest Level": item.interestLevel || "",
    Status: item.status || "",
    "Quote Price (₹)": item.quotePrice ?? "",
    "Follow-up Date": item.followUpDate || "",
    "Follow-up Time": item.followUpTime || "",
    "Standee Type": item.standeeType || "",
    Remarks: item.followUpRemarks || "",
    Feedback: item.feedback || "",
    "Created Date": item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set nice column widths
  worksheet["!cols"] = [
    { wch: 6 }, // S.No
    { wch: 22 }, // Firm Name
    { wch: 20 }, // Owner Name
    { wch: 18 }, // Reported By
    { wch: 15 }, // Mobile
    { wch: 14 }, // Outlet Type
    { wch: 15 }, // Interest Level
    { wch: 14 }, // Status
    { wch: 14 }, // Quote Price
    { wch: 14 }, // Follow-up Date
    { wch: 14 }, // Follow-up Time
    { wch: 16 }, // Standee Type
    { wch: 25 }, // Remarks
    { wch: 25 }, // Feedback
    { wch: 14 }, // Created Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DSR Reports");

  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}

export function exportToPDF(
  reports: ReportItem[],
  reportTitle = "Daily Sales Report",
  filename = "dsr-reports.pdf"
) {
  if (!reports || reports.length === 0) {
    alert("No records to export.");
    return;
  }

  // Landscape A4 for wide table presentation
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // 1. Top Decorative Brand Bar
  doc.setFillColor(255, 87, 34); // #FF5722
  doc.rect(0, 0, pageWidth, 6, "F");

  // 2. Document Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(23, 25, 35); // #171923
  doc.text("DSR SYSTEM", 40, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(115, 119, 132); // #737784
  doc.text(reportTitle, 40, 52);

  // Right-aligned Meta
  doc.setFontSize(9);
  doc.text(`Generated: ${todayStr}`, pageWidth - 40, 36, { align: "right" });
  doc.text(`Total Records: ${reports.length}`, pageWidth - 40, 50, {
    align: "right",
  });

  // Horizontal divider
  doc.setDrawColor(229, 231, 235); // #E5E7EB
  doc.setLineWidth(1);
  doc.line(40, 62, pageWidth - 40, 62);

  // 3. Table Data Construction
  const headers = [
    [
      "#",
      "Firm Name",
      "Owner",
      "Reported By",
      "Mobile",
      "Outlet",
      "Interest",
      "Status",
      "Quote",
      "Follow-up Date",
      "Time",
      "Feedback",
    ],
  ];

  const body = reports.map((item, idx) => [
    idx + 1,
    item.firmName || "—",
    item.ownerName || "—",
    item.reportedBy || "—",
    item.mobileNumber || "—",
    item.outletType || "—",
    item.interestLevel || "—",
    item.status || "—",
    item.quotePrice != null ? `₹${item.quotePrice}` : "—",
    item.followUpDate || "—",
    item.followUpTime || "—",
    item.feedback || item.followUpRemarks || "—",
  ]);

  // 4. Render Table with autoTable
  autoTable(doc, {
    head: headers,
    body: body,
    startY: 72,
    margin: { left: 40, right: 40 },
    theme: "striped",
    headStyles: {
      fillColor: [248, 249, 250],
      textColor: [23, 25, 35],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "left",
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [23, 25, 35],
      cellPadding: 5.5,
    },
    alternateRowStyles: {
      fillColor: [253, 254, 255],
    },
    styles: {
      lineColor: [229, 231, 235],
      lineWidth: 0.5,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" }, // #
      1: { cellWidth: 90 }, // Firm
      2: { cellWidth: 70 }, // Owner
      3: { cellWidth: 65 }, // Reported By
      4: { cellWidth: 65 }, // Mobile
      5: { cellWidth: 50 }, // Outlet
      6: { cellWidth: 55 }, // Interest
      7: { cellWidth: 55 }, // Status
      8: { cellWidth: 40 }, // Quote
      9: { cellWidth: 60 }, // Date
      10: { cellWidth: 40 }, // Time
      11: { cellWidth: "auto" }, // Feedback
    },
    didDrawPage: (data) => {
      // Footer page numbers
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Page ${data.pageNumber} of ${pageNumber} • Confidential DSR Export`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );
    },
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

