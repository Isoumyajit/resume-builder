import { Camera } from "lucide-react";

const RING_SIZE = 64;
const STROKE_WIDTH = 3;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface PhotoUploadProgressProps {
  label?: string;
}

/**
 * Animated overlay shown while a photo is being compressed/uploaded.
 * Self-contained — swap this file to change the animation style.
 */
export function PhotoUploadProgress({
  label = "Processing photo…",
}: PhotoUploadProgressProps) {
  return (
    <div
      className="flex w-full flex-col items-center gap-3 rounded-lg border-2 border-indigo-300 bg-indigo-50/60 p-6 dark:border-indigo-600 dark:bg-indigo-950/40"
      data-testid="photo-upload-progress"
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="animate-spin"
          style={{ animationDuration: "1.4s" }}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            className="stroke-indigo-200 dark:stroke-indigo-800"
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            className="stroke-indigo-500 dark:stroke-indigo-400"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * 0.7}
          />
        </svg>

        {/* Center icon */}
        <Camera className="absolute h-5 w-5 animate-pulse text-indigo-500 dark:text-indigo-400" />
      </div>

      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {label}
      </span>
    </div>
  );
}
