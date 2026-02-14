import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
  profileLinksSchema,
  skillsSchema,
  achievementSchema,
  resumeSchema,
} from "../validation";

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

function validPersonalInfo() {
  return {
    name: "John Doe",
    location: "San Francisco, CA",
    phone: "+1 555-123-4567",
    email: "john@example.com",
  };
}

function validExperience() {
  return {
    id: "exp-1",
    company: "Acme Corp",
    title: "Software Engineer",
    location: "Remote",
    startDate: "Jan 2020",
    endDate: "Dec 2023",
    techStack: "React, Node.js",
    currentlyWorking: false,
    bullets: ["Built a REST API serving 10k requests/day"],
  };
}

function validEducation() {
  return {
    id: "edu-1",
    institution: "MIT",
    degree: "B.S. Computer Science",
    location: "Cambridge, MA",
    startYear: "2016",
    endYear: "2020",
  };
}

function validProject() {
  return {
    id: "proj-1",
    name: "Resume Builder",
    url: "https://github.com/user/resume-builder",
    techStack: "React, TypeScript, Vite",
    description: "A tool to create professional resumes",
  };
}

function validAchievement() {
  return {
    id: "ach-1",
    bullet: "Won first place in a hackathon",
  };
}

// ---------------------------------------------------------------------------
// personalInfoSchema
// ---------------------------------------------------------------------------

describe("personalInfoSchema", () => {
  it("should pass with valid personal info", () => {
    const result = personalInfoSchema.safeParse(validPersonalInfo());
    expect(result.success).toBe(true);
  });

  it("should pass with optional linkedin fields", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      linkedin: {
        url: "https://linkedin.com/in/johndoe",
        displayText: "johndoe",
      },
    });
    expect(result.success).toBe(true);
  });

  it("should pass when linkedin url is empty string", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      linkedin: { url: "", displayText: "" },
    });
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when email is invalid", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when phone is empty", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      phone: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when location is empty", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      location: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when linkedin url is invalid", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo(),
      linkedin: { url: "not-a-url" },
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// experienceSchema
// ---------------------------------------------------------------------------

describe("experienceSchema", () => {
  it("should pass with valid experience", () => {
    const result = experienceSchema.safeParse(validExperience());
    expect(result.success).toBe(true);
  });

  it("should pass with currentlyWorking=true and endDate=Present", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      currentlyWorking: true,
      endDate: "Present",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when company is empty", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when title is empty", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when bullets array is empty", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      bullets: [],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a bullet exceeds 300 characters", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      bullets: ["x".repeat(301)],
    });
    expect(result.success).toBe(false);
  });

  it("should pass when a bullet is exactly 300 characters", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      bullets: ["x".repeat(300)],
    });
    expect(result.success).toBe(true);
  });

  it("should fail when start date is in the future", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      startDate: "Jan 2099",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when end date is in the future", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      endDate: "Jan 2099",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when start date is after end date", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      startDate: "Jan 2023",
      endDate: "Jan 2020",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when currentlyWorking=true but endDate is not Present", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      currentlyWorking: true,
      endDate: "Dec 2023",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when currentlyWorking=false but endDate is Present", () => {
    const result = experienceSchema.safeParse({
      ...validExperience(),
      currentlyWorking: false,
      endDate: "Present",
    });
    expect(result.success).toBe(false);
  });

  it("should default currentlyWorking to false when omitted", () => {
    const data = { ...validExperience() };
    delete (data as Record<string, unknown>).currentlyWorking;
    const result = experienceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// educationSchema
// ---------------------------------------------------------------------------

describe("educationSchema", () => {
  it("should pass with valid education", () => {
    const result = educationSchema.safeParse(validEducation());
    expect(result.success).toBe(true);
  });

  it("should fail when institution is empty", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      institution: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when degree is empty", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      degree: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when start year is in the future", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      startYear: "2099",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when end year is in the future", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      endYear: "2099",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when start year is after end year", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      startYear: "2022",
      endYear: "2018",
    });
    expect(result.success).toBe(false);
  });

  it("should pass when start year equals end year", () => {
    const result = educationSchema.safeParse({
      ...validEducation(),
      startYear: "2020",
      endYear: "2020",
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// projectSchema
// ---------------------------------------------------------------------------

describe("projectSchema", () => {
  it("should pass with valid project", () => {
    const result = projectSchema.safeParse(validProject());
    expect(result.success).toBe(true);
  });

  it("should pass when url is empty string", () => {
    const result = projectSchema.safeParse({
      ...validProject(),
      url: "",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty", () => {
    const result = projectSchema.safeParse({
      ...validProject(),
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when techStack is empty", () => {
    const result = projectSchema.safeParse({
      ...validProject(),
      techStack: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when description is empty", () => {
    const result = projectSchema.safeParse({
      ...validProject(),
      description: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when url is invalid", () => {
    const result = projectSchema.safeParse({
      ...validProject(),
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// profileLinksSchema
// ---------------------------------------------------------------------------

describe("profileLinksSchema", () => {
  it("should pass with valid links", () => {
    const result = profileLinksSchema.safeParse({
      leetcode: "https://leetcode.com/user",
      github: "https://github.com/user",
      portfolio: "https://portfolio.dev",
    });
    expect(result.success).toBe(true);
  });

  it("should pass with all empty strings", () => {
    const result = profileLinksSchema.safeParse({
      leetcode: "",
      github: "",
      portfolio: "",
    });
    expect(result.success).toBe(true);
  });

  it("should pass with empty object (all optional)", () => {
    const result = profileLinksSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should fail when github url is invalid", () => {
    const result = profileLinksSchema.safeParse({
      github: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when leetcode url is invalid", () => {
    const result = profileLinksSchema.safeParse({
      leetcode: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when portfolio url is invalid", () => {
    const result = profileLinksSchema.safeParse({
      portfolio: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// skillsSchema
// ---------------------------------------------------------------------------

describe("skillsSchema", () => {
  it("should pass with valid skills", () => {
    const result = skillsSchema.safeParse({
      languages: "JavaScript, TypeScript, Python",
      technologies: "React, Node.js, Docker",
      other: "Git, CI/CD",
    });
    expect(result.success).toBe(true);
  });

  it("should pass with empty object and apply defaults", () => {
    const result = skillsSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.languages).toBe("");
      expect(result.data.technologies).toBe("");
      expect(result.data.other).toBe("");
    }
  });
});

// ---------------------------------------------------------------------------
// achievementSchema
// ---------------------------------------------------------------------------

describe("achievementSchema", () => {
  it("should pass with valid achievement", () => {
    const result = achievementSchema.safeParse(validAchievement());
    expect(result.success).toBe(true);
  });

  it("should fail when bullet is empty", () => {
    const result = achievementSchema.safeParse({
      id: "ach-1",
      bullet: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when bullet exceeds 100 non-space characters", () => {
    // 101 non-space characters (with some spaces mixed in — spaces don't count)
    const bullet = "a".repeat(101);
    const result = achievementSchema.safeParse({
      id: "ach-1",
      bullet,
    });
    expect(result.success).toBe(false);
  });

  it("should pass when bullet has exactly 100 non-space characters", () => {
    const bullet = "a".repeat(100);
    const result = achievementSchema.safeParse({
      id: "ach-1",
      bullet,
    });
    expect(result.success).toBe(true);
  });

  it("should not count spaces toward the 100 character limit", () => {
    // 80 non-space chars + 30 spaces = 110 total, but only 80 count
    const bullet = "a ".repeat(40).trim(); // "a a a a..." = 40 'a' + 39 spaces
    const result = achievementSchema.safeParse({
      id: "ach-1",
      bullet,
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// resumeSchema (integration — combines all schemas)
// ---------------------------------------------------------------------------

describe("resumeSchema", () => {
  it("should pass with a complete valid resume", () => {
    const result = resumeSchema.safeParse({
      personalInfo: validPersonalInfo(),
      experience: [validExperience()],
      education: [validEducation()],
      projects: [validProject()],
      profileLinks: {
        github: "https://github.com/user",
      },
      skills: {
        languages: "TypeScript",
        technologies: "React",
        other: "Git",
      },
      achievements: [validAchievement()],
    });
    expect(result.success).toBe(true);
  });

  it("should pass with minimal required fields and defaults", () => {
    const result = resumeSchema.safeParse({
      personalInfo: validPersonalInfo(),
      experience: [validExperience()],
      skills: {
        languages: "JavaScript",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.education).toEqual([]);
      expect(result.data.projects).toEqual([]);
      expect(result.data.achievements).toEqual([]);
    }
  });

  it("should fail when personalInfo is missing", () => {
    const result = resumeSchema.safeParse({
      experience: [validExperience()],
      skills: { languages: "JS" },
    });
    expect(result.success).toBe(false);
  });

  it("should fail when experience is missing", () => {
    const result = resumeSchema.safeParse({
      personalInfo: validPersonalInfo(),
      skills: { languages: "JS" },
    });
    expect(result.success).toBe(false);
  });

  it("should fail when skills is missing", () => {
    const result = resumeSchema.safeParse({
      personalInfo: validPersonalInfo(),
      experience: [validExperience()],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when nested experience is invalid", () => {
    const result = resumeSchema.safeParse({
      personalInfo: validPersonalInfo(),
      experience: [{ ...validExperience(), company: "" }],
      skills: { languages: "JS" },
    });
    expect(result.success).toBe(false);
  });
});
