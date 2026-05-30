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
import com.saikiran.expense_service.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpensePdfService {

    private final ExpenseRepository expenseRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // DESIGN TOKENS
    // ─────────────────────────────────────────────────────────────────────────

    private static final Color COLOR_PRIMARY       = new Color(20,  83,  45);   // dark green
    private static final Color COLOR_PRIMARY_LIGHT = new Color(220, 252, 231);  // light green card bg
    private static final Color COLOR_PRIMARY_MID   = new Color(134, 188, 157);  // green border accent
    private static final Color COLOR_ROW_ALT       = new Color(248, 250, 248);  // off-white alt row
    private static final Color COLOR_ROW_WHITE     = Color.WHITE;
    private static final Color COLOR_BORDER        = new Color(214, 228, 218);  // subtle green-gray border
    private static final Color COLOR_TEXT_MUTED    = new Color(100, 116, 109);  // muted slate
    private static final Color COLOR_TEXT_DARK     = new Color(15,  23,  42);   // near-black
    private static final Color COLOR_DIVIDER       = new Color(226, 232, 228);  // light divider

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC ENTRY POINT
    // ─────────────────────────────────────────────────────────────────────────

    public byte[] generateExpenseReport(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<ExpenseInfo> expenses =
                expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 40, 40, 48, 48);
            PdfWriter writer  = PdfWriter.getInstance(document, out);

            document.open();

            // ── Font hierarchy ────────────────────────────────────────────────
            // NOTE: Font() constructor is com.lowagie.text.Font (imported via *)
            // Font.HELVETICA / Font.BOLD / Font.NORMAL are constants on that class
            Font fontBrandName     = new Font(Font.HELVETICA, 10, Font.BOLD,   COLOR_PRIMARY);
            Font fontReportTitle   = new Font(Font.HELVETICA, 22, Font.BOLD,   COLOR_PRIMARY);
            Font fontMeta          = new Font(Font.HELVETICA, 9,  Font.NORMAL, COLOR_TEXT_MUTED);
            Font fontSectionTitle  = new Font(Font.HELVETICA, 13, Font.BOLD,   COLOR_PRIMARY);
            Font fontCardLabel     = new Font(Font.HELVETICA, 9,  Font.NORMAL, COLOR_TEXT_MUTED);
            Font fontCardValue     = new Font(Font.HELVETICA, 15, Font.BOLD,   COLOR_PRIMARY);
            Font fontTableHeader   = new Font(Font.HELVETICA, 10, Font.BOLD,   Color.WHITE);
            Font fontTableBody     = new Font(Font.HELVETICA, 9,  Font.NORMAL, COLOR_TEXT_DARK);
            Font fontCategoryLabel = new Font(Font.HELVETICA, 9,  Font.NORMAL, COLOR_TEXT_DARK);
            Font fontCategoryAmt   = new Font(Font.HELVETICA, 9,  Font.BOLD,   COLOR_PRIMARY);
            Font fontFooter        = new Font(Font.HELVETICA, 8,  Font.NORMAL, COLOR_TEXT_MUTED);

            // ── Pre-compute summary data ──────────────────────────────────────
            BigDecimal totalExpense    = BigDecimal.ZERO;
            Map<String, BigDecimal> categoryTotals = new LinkedHashMap<>();

            for (ExpenseInfo e : expenses) {
                BigDecimal amt = e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO;
                totalExpense   = totalExpense.add(amt);

                String cat = (e.getCategory() != null && e.getCategory().getName() != null)
                        ? e.getCategory().getName() : "Other";

                categoryTotals.merge(cat, amt, BigDecimal::add);
            }

            String     topCategory       = "-";
            BigDecimal topCategoryAmount = BigDecimal.ZERO;
            for (Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
                if (entry.getValue().compareTo(topCategoryAmount) > 0) {
                    topCategory       = entry.getKey();
                    topCategoryAmount = entry.getValue();
                }
            }

            // ── SECTION 1: Header ─────────────────────────────────────────────
            addHeader(document, userId, startDate, endDate,
                    fontBrandName, fontReportTitle, fontMeta);

            addDivider(document);

            // ── SECTION 2: Summary cards ──────────────────────────────────────
            addSummaryCards(document, totalExpense, expenses.size(), topCategory,
                    fontCardLabel, fontCardValue);

            // ── SECTION 3: Category breakdown ─────────────────────────────────
            addSectionTitle(document, "Category Breakdown", fontSectionTitle);
            addCategoryBreakdown(document, categoryTotals, fontCategoryLabel, fontCategoryAmt);

            // ── SECTION 4: Transactions table ─────────────────────────────────
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
            throw new RuntimeException("Failed to generate expense PDF", e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION BUILDERS
    // ─────────────────────────────────────────────────────────────────────────

    private void addHeader(
            Document doc,
            String userId,
            LocalDate startDate,
            LocalDate endDate,
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

        Paragraph title = new Paragraph("Expense Summary Report", fontTitle);
        title.setSpacingBefore(4);
        left.addElement(title);

        // Right: meta info (aligned right)
        PdfPCell right = noBorderCell();
        right.setHorizontalAlignment(Element.ALIGN_RIGHT);
        right.addElement(metaLine("Generated", LocalDate.now().format(DATE_FMT), fontMeta));
        right.addElement(metaLine("User",      userId,                            fontMeta));
        right.addElement(metaLine("Period",
                startDate.format(DATE_FMT) + "  →  " + endDate.format(DATE_FMT), fontMeta));

        headerTable.addCell(left);
        headerTable.addCell(right);

        doc.add(headerTable);
    }

    private void addDivider(Document doc) throws DocumentException {
        // Thin green rule drawn as a 1-row table with green background
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
            BigDecimal total,
            int txCount,
            String topCategory,
            Font labelFont,
            Font valueFont
    ) throws DocumentException {

        PdfPTable cards = new PdfPTable(3);
        cards.setWidthPercentage(100);
        cards.setWidths(new float[]{1f, 1f, 1f});
        cards.setSpacingAfter(20);

        cards.addCell(summaryCard("Total Expenses",   "Rs. " + total,             labelFont, valueFont));
        cards.addCell(summaryCard("Transactions",     String.valueOf(txCount),     labelFont, valueFont));
        cards.addCell(summaryCard("Top Category",     topCategory,                 labelFont, valueFont));

        doc.add(cards);
    }

    private void addSectionTitle(Document doc, String title, Font font)
            throws DocumentException {

        Paragraph p = new Paragraph(title, font);
        p.setSpacingAfter(8);
        doc.add(p);
    }

    private void addCategoryBreakdown(
            Document doc,
            Map<String, BigDecimal> categoryTotals,
            Font labelFont,
            Font amountFont
    ) throws DocumentException {

        if (categoryTotals.isEmpty()) {
            doc.add(new Paragraph("No data.", labelFont));
            doc.add(Chunk.NEWLINE);
            return;
        }

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(42);
        table.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.setWidths(new float[]{3f, 2f});
        table.setSpacingAfter(20);

        boolean alt = false;
        for (Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
            Color bg = alt ? COLOR_ROW_ALT : COLOR_ROW_WHITE;

            PdfPCell nameCell = createTableCell(entry.getKey(),
                    labelFont, bg, Element.ALIGN_LEFT);
            PdfPCell amtCell  = createTableCell("Rs. " + entry.getValue(),
                    amountFont, bg, Element.ALIGN_RIGHT);

            table.addCell(nameCell);
            table.addCell(amtCell);
            alt = !alt;
        }

        doc.add(table);
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

        if (expenses.isEmpty()) {
            PdfPCell empty = new PdfPCell(
                    new Phrase("No transactions found for this period.", bodyFont));
            empty.setColspan(4);
            empty.setPadding(10);
            empty.setBorderColor(COLOR_BORDER);
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
        // Thin divider above footer
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
     * Summary card cell — light green background, label on top, bold value below.
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
        Paragraph vp = new Paragraph(value,  valueFont);
        vp.setSpacingBefore(6);

        cell.addElement(lp);
        cell.addElement(vp);
        return cell;
    }

    /**
     * Standard table data cell with background, border, padding, and alignment.
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
     * Single-line meta paragraph (e.g. "Generated: 29 May 2026").
     */
    private Paragraph metaLine(String label, String value, Font font) {
        Paragraph p = new Paragraph(label + ":  " + value, font);
        p.setAlignment(Element.ALIGN_RIGHT);
        p.setSpacingBefore(2);
        return p;
    }
}