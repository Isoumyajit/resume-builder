const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

async function checkLatexInstallation() {
  console.log("🔍 Checking LaTeX installation...\n");

  try {
    // Check if pdflatex is available
    const { stdout } = await execAsync("pdflatex --version");
    console.log("✅ LaTeX (pdflatex) is installed:");
    console.log(stdout.split("\n")[0]); // First line usually contains version

    return true;
  } catch (error) {
    console.log("❌ LaTeX (pdflatex) is NOT installed\n");

    console.log("📋 To install LaTeX:");
    console.log("");
    console.log("🍎 macOS:");
    console.log("   brew install --cask mactex");
    console.log("   # Or smaller version: brew install --cask basictex");
    console.log("");
    console.log("🐧 Ubuntu/Debian:");
    console.log("   sudo apt-get update");
    console.log(
      "   sudo apt-get install texlive-latex-base texlive-latex-recommended",
    );
    console.log("");
    console.log("🪟 Windows:");
    console.log("   Download from: https://miktex.org/download");
    console.log("");
    console.log("📦 Docker Alternative:");
    console.log(
      "   docker run --rm -v $(pwd):/data texlive/texlive pdflatex document.tex",
    );
    console.log("");

    return false;
  }
}

async function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split(".")[0]);

  console.log(`🟢 Node.js version: ${version}`);

  if (majorVersion < 16) {
    console.log("⚠️  Warning: Node.js 16+ is recommended");
  } else {
    console.log("✅ Node.js version is compatible");
  }
}

async function createEnvFile() {
  const envContent = `# Resume Builder Server Configuration

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# LaTeX Configuration
LATEX_TIMEOUT=30000
TEMP_DIR=./temp

# Logging
LOG_LEVEL=info
`;

  try {
    await require("fs").promises.writeFile(".env.example", envContent);
    console.log("✅ Created .env.example file");

    // Check if .env exists
    try {
      await require("fs").promises.access(".env");
      console.log("📋 .env file already exists");
    } catch {
      await require("fs").promises.writeFile(".env", envContent);
      console.log("✅ Created .env file");
    }
  } catch (error) {
    console.log("❌ Failed to create environment files:", error.message);
  }
}

async function main() {
  console.log("🚀 Resume Builder Server Setup\n");

  // Check Node.js version
  await checkNodeVersion();
  console.log("");

  // Check LaTeX installation
  const latexInstalled = await checkLatexInstallation();

  // Create environment files
  await createEnvFile();
  console.log("");

  if (latexInstalled) {
    console.log("🎉 Setup complete! You can now run:");
    console.log("   npm run dev    # Start development server");
    console.log("   npm start      # Start production server");
  } else {
    console.log("⚠️  Setup incomplete: Please install LaTeX first, then run:");
    console.log("   npm run setup  # Re-run setup");
  }
  console.log("");
  console.log("📚 Documentation: Check README.md for more details");
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkLatexInstallation, checkNodeVersion };
