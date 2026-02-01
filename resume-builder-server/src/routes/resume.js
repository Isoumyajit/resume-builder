const express = require("express");
const { generateResumePdf } = require("../services/pdfGenerator");
const { validateResumeData } = require("../middleware/validation");
const { logPdfEvent, PerformanceTimer, loggers } = require("../config/logger");

const router = express.Router();

/**
 * POST /generate-pdf
 * Generate PDF from resume data
 */
router.post("/generate-pdf", validateResumeData, async (req, res) => {
  const timer = new PerformanceTimer("PDF Generation", loggers.pdf);

  try {
    const resumeData = req.resumeData;

    console.log("resumeData", resumeData);
    logPdfEvent("start", {
      userName: resumeData.personalInfo.name,
      stats: resumeData.getStats(),
    });

    if (!resumeData.hasMinimumContent()) {
      return res.status(400).json({
        error: "Insufficient content",
        message:
          "Resume must have personal info and at least one section (experience, education, or projects)",
        timestamp: new Date().toISOString(),
      });
    }

    const pdfBuffer = await generateResumePdf(resumeData.toJSON());

    const fileName = `${resumeData.getFileName()}_resume.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    const duration = timer.end();
    logPdfEvent("success", {
      userName: resumeData.personalInfo.name,
      filename: fileName,
      fileSize: pdfBuffer.length,
      duration,
    });

    res.send(pdfBuffer);
  } catch (error) {
    const duration = timer.end();
    logPdfEvent("error", {
      userName: req.resumeData?.personalInfo?.name || "Unknown",
      error: error.message,
      duration,
    });

    res.status(500).json({
      error: "PDF Generation Failed",
      message: error.message || "Failed to generate PDF from resume data",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
