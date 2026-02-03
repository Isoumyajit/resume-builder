export interface GenerateBulletParams {
  index: number;
  jobTitle: string;
  company: string;
  techStack?: string;
}

export interface GenerateProjectDescriptionParams {
  index: number;
  projectName: string;
  techStack: string;
  url?: string;
}
