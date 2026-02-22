import {
  fetchBullets,
  generateProjectDescription as fetchDescription,
} from "@/api/ai";
import type {
  GenerateBulletParams,
  GenerateProjectDescriptionParams,
} from "@/interfaces/ai/ai";
import { useState, useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";

interface UseAiServiceOptions {
  setValue: UseFormSetValue<ResumeFormData>;
}

export function useAiService({ setValue }: UseAiServiceOptions) {
  const [isGenerating, setIsGenerating] = useState<number[]>([]);
  const [isGeneratingBullets, setIsGeneratingBullets] = useState<number[]>([]);
  const [isAiServiceRunning, setIsAiServiceRunning] = useState<{
    [key: number]: boolean;
  }>({});

  const generateBullets = useCallback(
    async (params: GenerateBulletParams) => {
      const { index, jobTitle, company, techStack } = params;

      setIsAiServiceRunning((prev) => ({ ...prev, [index]: true }));

      setIsGeneratingBullets((prev) => [...prev, index]);
      const updateBullets = (chunks: string[]) => {
        const fullText = chunks.join("");
        const sentences = fullText.split("\n");
        const bullets: string[] = [];

        sentences.forEach((sentence) => {
          if (sentence.trim() !== "") {
            bullets.push(sentence);
          }
        });

        setValue(`experience.${index}.bullets`, bullets);
      };

      try {
        await fetchBullets(
          { index, jobTitle, company, techStack },
          updateBullets,
        );

        setIsAiServiceRunning((prev) => ({ ...prev, [index]: false }));
        setIsGeneratingBullets((prev) => prev.filter((i) => i !== index));
      } catch {
        // silently handled
      } finally {
        setIsGeneratingBullets((prev) => prev.filter((i) => i !== index));
      }
    },
    [setValue],
  );
  const generateDescription = useCallback(
    async (params: GenerateProjectDescriptionParams) => {
      const { index, projectName, techStack, url } = params;

      try {
        setIsGenerating((prev) => [...prev, index]);

        const updateDescription = (chunks: string[]) => {
          const fullText = chunks.join("");
          setValue(`projects.${index}.description`, fullText);
        };

        await fetchDescription(
          { index, projectName, techStack, url },
          updateDescription,
        );
      } catch {
        // silently handled
      } finally {
        setIsGenerating((prev) => prev.filter((i) => i !== index));
      }
    },
    [setValue],
  );

  return {
    generateDescription,
    isGenerating,
    isGeneratingBullets,
    isAiServiceRunning,
    generateBullets,
  };
}
