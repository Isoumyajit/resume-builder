const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const puppeteer = require("puppeteer");
const execAsync = promisify(exec);
const { generateHtmlTemplate } = require("./htmlTemplateGenerator");

/**
 * Generate PDF from resume data (main entry point)
 * Uses Puppeteer by default for cross-platform compatibility
 */
async function generateResumePdf(resumeData) {
  return generateResumePdfPuppeteer(resumeData);
}

/**
 * Generate PDF using Puppeteer (cross-platform, no system dependencies)
 */
async function generateResumePdfPuppeteer(resumeData) {
  let browser = null;

  try {
    console.log("🔄 Generating PDF with Puppeteer...");

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const htmlContent = generateHtmlTemplate(resumeData);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.2in",
        bottom: "0.1in",
        left: "0.5in",
        right: "0.5in",
      },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  generateResumePdf,
  generateResumePdfPuppeteer,
  generateHtmlTemplate,
};
