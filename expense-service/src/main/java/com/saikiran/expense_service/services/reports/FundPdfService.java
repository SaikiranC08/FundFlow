package com.saikiran.expense_service.services.reports;

// ─────────────────────────────────────────────────────────────────────────────
// OpenPDF imports — com.lowagie.text.Font and com.lowagie.text.Rectangle ONLY
// DO NOT import java.awt.Font or java.awt.Rectangle — causes ambiguity errors
// ─────────────────────────────────────────────────────────────────────────────
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

// java.awt.Color is safe — no conflict with OpenPDF
import java.awt.Color;

import com.saikiran.expense_service.entities.ExpenseInfo;
import com.saikiran.expense_service.entities.FundInfo;
import com.saikiran.expense_service.repository.ExpenseRepository;
import com.saikiran.expense_service.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FundPdfService {

    private final ExpenseRepository expenseRepository;
    private final FundRepository    fundRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // DESIGN TOKENS  (identical palette to ExpensePdfService)
    // ─────────────────────────────────────────────────────────────────────────

    private static final Color COLOR_PRIMARY       = new Color(20,  83,  45);   // dark green
    private static final Color COLOR_PRIMARY_LIGHT = new Color(220, 252, 231);  // card bg
    private static final Color COLOR_PRIMARY_MID   = new Color(134, 188, 157);  // card border
    private static final Color COLOR_ROW_ALT       = new Color(248, 250, 248);  // alt table row
    private static final Color COLOR_ROW_WHITE     = Color.WHITE;
    private static final Color COLOR_BORDER        = new Color(214, 228, 218);  // table border
    private static final Color COLOR_TEXT_MUTED    = new Color(100, 116, 109);  // secondary text
    private static final Color COLOR_TEXT_DARK     = new Color(15,  23,  42);   // body text
    private static final Color COLOR_DIVIDER       = new Color(226, 232, 228);  // footer rule
    private static final Color COLOR_META_BG       = new Color(245, 250, 247);  // details section bg

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC ENTRY POINT
    // ─────────────────────────────────────────────────────────────────────────

    public byte[] generateFundReport(String userId, Long fundId) {

        FundInfo          fund     = fundRepository.findFundInfoByUserIdAndFundId(userId, fundId);
        List<ExpenseInfo> expenses = expenseRepository
                .findExpenseInfoByUserIdAndFund_FundId(userId, fundId);

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document  document = new Document(PageSize.A4, 40, 40, 48, 48);
            PdfWriter writer   = PdfWriter.getInstance(document, out);

            document.open();

            // ── Font hierarchy ────────────────────────────────────────────────
            Font fontBrandName    = new Font(Font.HELVETICA, 10, Font.BOLD,   COLOR_PRIMARY);
            Font fontReportTitle  = new Font(Font.HELVETICA, 22, Font.BOLD,   COLOR_PRIMARY);
            Font fontMeta         = new Font(Font.HELVETICA,  9, Font.NORMAL, COLOR_TEXT_MUTED);
            Font fontSectionTitle = new Font(Font.HELVETICA, 13, Font.BOLD,   COLOR_PRIMARY);
            Font fontCardLabel    = new Font(Font.HELVETICA,  9, Font.NORMAL, COLOR_TEXT_MUTED);
            Font fontCardValue    = new Font(Font.HELVETICA, 14, Font.BOLD,   COLOR_PRIMARY);
            Font fontDetailLabel  = new Font(Font.HELVETICA,  9, Font.NORMAL, COLOR_TEXT_MUTED);
            Font fontDetailValue  = new Font(Font.HELVETICA, 10, Font.BOLD,   COLOR_TEXT_DARK);
            Font fontTableHeader  = new Font(Font.HELVETICA, 10, Font.BOLD,   Color.WHITE);
            Font fontTableBody    = new Font(Font.HELVETICA,  9, Font.NORMAL, COLOR_TEXT_DARK);
            Font fontFooter       = new Font(Font.HELVETICA,  8, Font.NORMAL, COLOR_TEXT_MUTED);

            // ── Pre-compute financials ────────────────────────────────────────
            BigDecimal received  = safe(fund.getAmountReceived());
            BigDecimal remaining = safe(fund.getRemainingAmount());
            BigDecimal used      = received.subtract(remaining);

            String utilizationPct = "0%";
            if (received.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal pct = used
                        .multiply(BigDecimal.valueOf(100))
                        .divide(received, 0, RoundingMode.HALF_UP);
                utilizationPct = pct + "%";
            }

            // ── SECTION 1: Header ─────────────────────────────────────────────
            addHeader(document, userId, fundId, fontBrandName, fontReportTitle, fontMeta);
            addDivider(document);

            // ── SECTION 2: Fund summary cards ─────────────────────────────────
            addSectionTitle(document, "Fund Summary", fontSectionTitle);
            addSummaryCards(document,
                    received, remaining, used, utilizationPct,
                    fontCardLabel, fontCardValue);

            // ── SECTION 3: Fund details ───────────────────────────────────────
            addSectionTitle(document, "Fund Details", fontSectionTitle);
            addFundDetails(document, fund, expenses.size(), fontDetailLabel, fontDetailValue);

            // ── SECTION 4: Transaction table ──────────────────────────────────
            addSectionTitle(document, "Transactions", fontSectionTitle);
            addTransactionTable(document, expenses, fontTableHeader, fontTableBody);

            // ── SECTION 5: Footer ─────────────────────────────────────────────
            addFooter(document, fontFooter);

            // ── Close in correct order: document → writer → toByteArray ───────
            document.close();
            writer.close();

            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate fund PDF", e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION BUILDERS
    // ─────────────────────────────────────────────────────────────────────────

    private void addHeader(
            Document doc,
            String userId,
            Long fundId,
            Font fontBrand,
            Font fontTitle,
            Font fontMeta
    ) throws DocumentException {

        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{6f, 4f});
        headerTable.setSpacingAfter(6);

        // Left: brand + report title
        PdfPCell left = noBorderCell();
        left.addElement(new Paragraph("FundFlow", fontBrand));

        Paragraph title = new Paragraph("Fund Utilization Report", fontTitle);
        title.setSpacingBefore(4);
        left.addElement(title);

        // Right: meta info
        PdfPCell right = noBorderCell();
        right.setHorizontalAlignment(Element.ALIGN_RIGHT);
        right.addElement(metaLine("Generated", LocalDate.now().format(DATE_FMT), fontMeta));
        right.addElement(metaLine("User",      userId,                           fontMeta));
        right.addElement(metaLine("Fund ID",   "#" + fundId,                     fontMeta));

        headerTable.addCell(left);
        headerTable.addCell(right);

        doc.add(headerTable);
    }

    private void addDivider(Document doc) throws DocumentException {
        PdfPTable rule = new PdfPTable(1);
        rule.setWidthPercentage(100);
        rule.setSpacingAfter(16);

        PdfPCell line = new PdfPCell(new Phrase(" "));
        line.setFixedHeight(2f);
        line.setBackgroundColor(COLOR_PRIMARY);
        line.setBorder(Rectangle.NO_BORDER);
        rule.addCell(line);

        doc.add(rule);
    }

    private void addSummaryCards(
            Document doc,
            BigDecimal received,
            BigDecimal remaining,
            BigDecimal used,
            String utilizationPct,
            Font labelFont,
            Font valueFont
    ) throws DocumentException {

        PdfPTable cards = new PdfPTable(4);
        cards.setWidthPercentage(100);
        cards.setWidths(new float[]{1f, 1f, 1f, 1f});
        cards.setSpacingAfter(20);

        cards.addCell(summaryCard("Amount Received",  "Rs. " + received,  labelFont, valueFont));
        cards.addCell(summaryCard("Remaining Amount", "Rs. " + remaining, labelFont, valueFont));
        cards.addCell(summaryCard("Used Amount",      "Rs. " + used,      labelFont, valueFont));
        cards.addCell(summaryCard("Utilization",      utilizationPct,      labelFont, valueFont));

        doc.add(cards);
    }

    private void addFundDetails(
            Document doc,
            FundInfo fund,
            int txCount,
            Font labelFont,
            Font valueFont
    ) throws DocumentException {

        // 2-column metadata grid inside a lightly shaded box
        PdfPTable details = new PdfPTable(4);
        details.setWidthPercentage(100);
        details.setWidths(new float[]{2f, 3f, 2f, 3f});
        details.setSpacingAfter(20);

        // Row 1
        details.addCell(detailLabelCell("Owner Name",   labelFont));
        details.addCell(detailValueCell(str(fund.getOwnerName()), valueFont));
        details.addCell(detailLabelCell("Owner Type",   labelFont));
        details.addCell(detailValueCell(str(fund.getOwnerType()), valueFont));

        // Row 2
        details.addCell(detailLabelCell("Status",       labelFont));
        details.addCell(detailValueCell(str(fund.getStatus()), valueFont));
        details.addCell(detailLabelCell("Created Date", labelFont));
        details.addCell(detailValueCell(
                fund.getCreatedDate() != null
                        ? fund.getCreatedDate().format(DATE_FMT)
                        : "-",
                valueFont
        ));

        // Row 3 — spans both right columns
        details.addCell(detailLabelCell("Transactions", labelFont));
        PdfPCell txCell = detailValueCell(String.valueOf(txCount), valueFont);
        txCell.setColspan(3);
        details.addCell(txCell);

        doc.add(details);
    }

    private void addSectionTitle(Document doc, String title, Font font)
            throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingAfter(8);
        doc.add(p);
    }

    private void addTransactionTable(
            Document doc,
            List<ExpenseInfo> expenses,
            Font headerFont,
            Font bodyFont
    ) throws DocumentException {

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2f, 2.5f, 4f, 2f});
        table.setSpacingAfter(16);

        // Header row
        for (String h : new String[]{"Date", "Category", "Description", "Amount"}) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(COLOR_PRIMARY);
            cell.setPadding(9);
            cell.setBorderColor(COLOR_PRIMARY);
            cell.setBorderWidth(0.5f);
            table.addCell(cell);
        }

        // Empty state
        if (expenses.isEmpty()) {
            PdfPCell empty = new PdfPCell(
                    new Phrase("No transactions found for this fund.", bodyFont));
            empty.setColspan(4);
            empty.setPadding(12);
            empty.setHorizontalAlignment(Element.ALIGN_CENTER);
            empty.setBorderColor(COLOR_BORDER);
            empty.setBorderWidth(0.5f);
            table.addCell(empty);
        } else {
            boolean alt = false;
            for (ExpenseInfo e : expenses) {
                Color bg = alt ? COLOR_ROW_ALT : COLOR_ROW_WHITE;

                String date = e.getDate() != null
                        ? e.getDate().format(DATE_FMT) : "-";
                String cat  = (e.getCategory() != null && e.getCategory().getName() != null)
                        ? e.getCategory().getName() : "-";
                String desc = e.getDescription() != null
                        ? e.getDescription() : "-";
                String amt  = e.getAmount() != null
                        ? "Rs. " + e.getAmount() : "Rs. 0.00";

                table.addCell(createTableCell(date, bodyFont, bg, Element.ALIGN_LEFT));
                table.addCell(createTableCell(cat,  bodyFont, bg, Element.ALIGN_LEFT));
                table.addCell(createTableCell(desc, bodyFont, bg, Element.ALIGN_LEFT));
                table.addCell(createTableCell(amt,  bodyFont, bg, Element.ALIGN_RIGHT));

                alt = !alt;
            }
        }

        doc.add(table);
    }

    private void addFooter(Document doc, Font footerFont) throws DocumentException {
        PdfPTable rule = new PdfPTable(1);
        rule.setWidthPercentage(100);
        rule.setSpacingBefore(8);
        rule.setSpacingAfter(8);

        PdfPCell line = new PdfPCell(new Phrase(" "));
        line.setFixedHeight(1f);
        line.setBackgroundColor(COLOR_DIVIDER);
        line.setBorder(Rectangle.NO_BORDER);
        rule.addCell(line);
        doc.add(rule);

        Paragraph footer = new Paragraph(
                "Generated by FundFlow Financial System  •  Confidential",
                footerFont
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        doc.add(footer);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CELL FACTORY HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Summary card — light green background, label on top, bold value below.
     */
    private PdfPCell summaryCard(
            String label,
            String value,
            Font labelFont,
            Font valueFont
    ) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(14);
        cell.setBackgroundColor(COLOR_PRIMARY_LIGHT);
        cell.setBorderColor(COLOR_PRIMARY_MID);
        cell.setBorderWidth(0.8f);

        Paragraph lp = new Paragraph(label, labelFont);
        Paragraph vp = new Paragraph(value, valueFont);
        vp.setSpacingBefore(6);

        cell.addElement(lp);
        cell.addElement(vp);
        return cell;
    }

    /**
     * Detail section: label cell (muted, shaded background).
     */
    private PdfPCell detailLabelCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setBackgroundColor(COLOR_META_BG);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.5f);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    /**
     * Detail section: value cell (white background, bold dark text).
     */
    private PdfPCell detailValueCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setBackgroundColor(COLOR_ROW_WHITE);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.5f);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    /**
     * Standard transaction table cell.
     */
    private PdfPCell createTableCell(
            String text,
            Font font,
            Color background,
            int alignment
    ) {
        PdfPCell cell = new PdfPCell(
                new Phrase(text != null ? text : "", font)
        );
        cell.setPadding(7);
        cell.setBackgroundColor(background);
        cell.setBorderColor(COLOR_BORDER);
        cell.setBorderWidth(0.5f);
        cell.setHorizontalAlignment(alignment);
        return cell;
    }

    /**
     * Cell with no border — used in header layout table.
     */
    private PdfPCell noBorderCell() {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPaddingBottom(4);
        return cell;
    }

    /**
     * Single meta line for the header right column.
     */
    private Paragraph metaLine(String label, String value, Font font) {
        Paragraph p = new Paragraph(label + ":  " + value, font);
        p.setAlignment(Element.ALIGN_RIGHT);
        p.setSpacingBefore(2);
        return p;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NULL-SAFETY UTILITIES
    // ─────────────────────────────────────────────────────────────────────────

    /** Returns ZERO if value is null. */
    private BigDecimal safe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    /** Returns "-" if value is null or blank. */
    private String str(Object value) {
        if (value == null) return "-";
        String s = value.toString().trim();
        return s.isEmpty() ? "-" : s;
    }
}