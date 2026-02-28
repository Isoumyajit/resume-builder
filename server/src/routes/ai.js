/**
 * AI Generation Routes
 * Endpoints for AI-powered content generation
 */

const express = require("express");
const { loggers } = require("../config/logger");
const {
  generateExperienceBullet,
  generateProjectDescription,
  generateSummary,
} = require("../services/ai/text-generation");

const router = express.Router();

/**
 * @route   POST /api/v1/ai/generate-bullet
 * @desc    Generate a professional bullet point for experience
 * @access  Public
 */
router.post("/generate-bullet", async (req, res) => {
  try {
    const { jobTitle, company, techStack, existingBullets } = req.body;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const bullet = await generateExperienceBullet({
      jobTitle,
      company,
      techStack,
    });

    for await (const chunk of bullet) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    loggers.app.error(
      { event: "ai_bullet_error", error: error.message },
      "Failed to generate bullet",
    );

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate bullet point",
    });
  }
});

/**
 * @route   POST /api/v1/ai/generate-description
 * @desc    Generate a professional project description
 * @access  Public
 */
router.post("/generate-description", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    const { projectName, techStack, url } = req.body;
    const descriptionPart = await generateProjectDescription({
      projectName,
      techStack,
      url,
    });

    for await (const chunk of descriptionPart) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    loggers.app.error(
      { event: "ai_description_error", error: error.message },
      "Failed to generate description",
    );

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate description",
    });
  }
});

/**
 * @route   POST /api/v1/ai/generate-summary
 * @desc    Generate a professional summary
 * @access  Public
 */
router.post("/generate-summary", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    const { jobTitle, yearsOfExperience, keySkills } = req.body;
    const summaryStream = generateSummary({
      jobTitle,
      yearsOfExperience,
      keySkills,
    });

    for await (const chunk of summaryStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    loggers.app.error(
      { event: "ai_summary_error", error: error.message },
      "Failed to generate summary",
    );

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate summary",
    });
  }
});

module.exports = router;
