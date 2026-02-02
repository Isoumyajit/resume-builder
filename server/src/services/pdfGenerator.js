const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const puppeteer = require("puppeteer");
const execAsync = promisify(exec);
const { generateHtmlTemplate } = require("./htmlTemplateGenerator");

// PDF generation method: 'puppeteer' (cross-platform) or 'latex' (requires pdflatex)
const PDF_METHOD = process.env.PDF_METHOD || "puppeteer";

/**
 * Generate PDF from resume data (main entry point)
 * Uses Puppeteer by default for cross-platform compatibility
 */
async function generateResumePdf(resumeData) {
  if (PDF_METHOD === "latex") {
    return generateResumePdfLatex(resumeData);
  }
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
        top: "0.5in",
        bottom: "0.5in",
        left: "0.75in",
        right: "0.75in",
      },
      printBackground: true,
    });

    console.log("✅ PDF generated successfully with Puppeteer");
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

/**
 * Generate PDF from resume data using LaTeX compilation
 * Requires pdflatex to be installed on the system
 */
async function generateResumePdfLatex(resumeData) {
  const tempDir = path.join(__dirname, "../../temp");
  const timestamp = Date.now();
  const fileName = `resume_${timestamp}`;
  const texFile = path.join(tempDir, `${fileName}.tex`);
  const pdfFile = path.join(tempDir, `${fileName}.pdf`);

  try {
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });

    // Generate LaTeX content from resume data
    const latexContent = generateLatexTemplate(resumeData);

    // Write LaTeX file
    await fs.writeFile(texFile, latexContent, "utf8");

    // Compile LaTeX to PDF using pdflatex
    console.log("🔄 Compiling LaTeX to PDF...");
    await execAsync(
      `cd ${tempDir} && pdflatex -interaction=nonstopmode ${fileName}.tex`,
    );

    // Read the generated PDF
    const pdfBuffer = await fs.readFile(pdfFile);

    // Cleanup temporary files
    await cleanupTempFiles(tempDir, fileName);

    console.log("✅ PDF generated successfully with LaTeX");
    return pdfBuffer;
  } catch (error) {
    console.error("❌ PDF generation failed:", error);

    // Attempt cleanup on error
    await cleanupTempFiles(tempDir, fileName).catch(console.error);

    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

/**
 * Generate LaTeX template from resume data
 */
function generateLatexTemplate(data) {
  const {
    personalInfo,
    experience = [],
    education = [],
    projects = [],
    profileLinks = {},
    skills = {},
  } = data;

  return `
\\documentclass[letterpaper,11pt]{article}
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome}

% Configure hyperlinks
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    citecolor=blue
}

% Custom colors
\\definecolor{primaryblue}{RGB}{0,64,128}
\\definecolor{darkgray}{RGB}{64,64,64}

% Remove page numbering
\\pagestyle{empty}

% Configure section titles
\\titleformat{\\section}{\\color{primaryblue}\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

% Configure subsection titles  
\\titleformat{\\subsection}{\\color{darkgray}\\large\\bfseries}{}{0em}{}
\\titlespacing{\\subsection}{0pt}{8pt}{4pt}

\\begin{document}

% Header with contact information
\\begin{center}
    {\\Huge\\bfseries ${escapeLatex(personalInfo.name)}} \\\\[8pt]
    {\\large ${escapeLatex(personalInfo.location)}} \\\\[4pt]
    {\\large ${escapeLatex(personalInfo.phone)} \\quad $\\bullet$ \\quad \\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}}} \\\\[4pt]
    ${personalInfo.linkedin?.url ? `\\href{${personalInfo.linkedin.url}}{${escapeLatex(personalInfo.linkedin.displayText || personalInfo.linkedin.url)}}` : ""}
\\end{center}

\\vspace{8pt}

${
  experience.length > 0
    ? `
% Work Experience Section
\\section{Professional Experience}

${experience
  .map(
    (exp) => `
\\subsection{${escapeLatex(exp.title)} \\quad $\\bullet$ \\quad ${escapeLatex(exp.company)}}
{\\small\\textit{${escapeLatex(exp.location)} \\quad $\\bullet$ \\quad ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}}

${exp.techStack ? `{\\small\\textbf{Tech Stack:} ${escapeLatex(exp.techStack)}}\\\\[4pt]` : ""}

\\begin{itemize}[leftmargin=*,topsep=2pt,itemsep=1pt]
${exp.bullets
  .map((bullet) => (bullet.trim() ? `    \\item ${escapeLatex(bullet)}` : ""))
  .filter(Boolean)
  .join("\n")}
\\end{itemize}

\\vspace{4pt}
`,
  )
  .join("")}
`
    : ""
}

${
  education.length > 0
    ? `
% Education Section
\\section{Education}

${education
  .map(
    (edu) => `
\\subsection{${escapeLatex(edu.institution)}}
{\\small\\textit{${escapeLatex(edu.degree)} \\quad $\\bullet$ \\quad ${escapeLatex(edu.location)} \\quad $\\bullet$ \\quad ${escapeLatex(edu.startYear)} -- ${escapeLatex(edu.endYear)}}}

\\vspace{4pt}
`,
  )
  .join("")}
`
    : ""
}

${
  projects.length > 0
    ? `
% Projects Section
\\section{Projects}

${projects
  .map(
    (proj) => `
\\subsection{${escapeLatex(proj.name)}${proj.url ? ` \\quad \\href{${proj.url}}{\\small\\faExternalLink}` : ""}}
{\\small\\textbf{Tech Stack:} ${escapeLatex(proj.techStack)}}

${escapeLatex(proj.description)}

\\vspace{4pt}
`,
  )
  .join("")}
`
    : ""
}

${
  Object.keys(skills).some((key) => skills[key])
    ? `
% Skills Section
\\section{Technical Skills}

${skills.languages ? `\\textbf{Programming Languages:} ${escapeLatex(skills.languages)}\\\\[4pt]` : ""}
${skills.technologies ? `\\textbf{Technologies \\& Frameworks:} ${escapeLatex(skills.technologies)}\\\\[4pt]` : ""}
${skills.other ? `\\textbf{Other Skills:} ${escapeLatex(skills.other)}\\\\[4pt]` : ""}
`
    : ""
}

\\end{document}
`;
}

/**
 * Escape special LaTeX characters
 */
function escapeLatex(text) {
  if (!text) return "";

  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[{}]/g, (match) => `\\${match}`)
    .replace(/[$&%#^_~]/g, (match) => `\\${match}`)
    .replace(/"/g, "''")
    .trim();
}

/**
 * Clean up temporary files after PDF generation
 */
async function cleanupTempFiles(tempDir, fileName) {
  const extensions = [".tex", ".pdf", ".aux", ".log", ".out"];

  for (const ext of extensions) {
    try {
      await fs.unlink(path.join(tempDir, fileName + ext));
    } catch (error) {
      // Ignore file not found errors
      if (error.code !== "ENOENT") {
        console.warn(`Warning: Failed to cleanup ${fileName}${ext}`);
      }
    }
  }
}

module.exports = {
  generateResumePdf,
  generateResumePdfPuppeteer,
  generateResumePdfLatex,
  generateHtmlTemplate,
  generateLatexTemplate,
  escapeLatex,
};
