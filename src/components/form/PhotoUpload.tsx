import { useRef, useState, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import {
  compressImage,
  ImageCompressionError,
} from "@/lib/utils/compressImage";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, ChevronDown, Eye, Trash2 } from "lucide-react";
import { PhotoUploadProgress } from "./PhotoUploadProgress";

interface PhotoUploadProps {
  form: UseFormReturn<ResumeFormData>;
}

export function PhotoUpload({ form }: PhotoUploadProps) {
  const photo = form.watch("personalInfo.photo");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);
      try {
        const [compressed] = await Promise.all([
          compressImage(file),
          new Promise((r) => setTimeout(r, 800)),
        ]);
        form.setValue("personalInfo.photo", compressed as string, {
          shouldDirty: true,
        });
      } catch (err) {
        if (err instanceof ImageCompressionError) {
          setError(err.message);
        } else {
          setError("Failed to process image");
        }
      } finally {
        setIsUploading(false);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [form],
  );

  const handleRemove = useCallback(() => {
    form.setValue("personalInfo.photo", "", { shouldDirty: true });
    setError(null);
  }, [form]);

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/jpeg,image/png"
      className="hidden"
      onChange={handleFileChange}
      data-testid="photo-file-input"
    />
  );

  if (photo) {
    return (
      <div
        data-testid="photo-upload"
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <img
          src={photo}
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover"
          data-testid="photo-thumbnail"
        />
        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Profile Photo
        </span>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 cursor-pointer"
          data-testid="photo-view-button"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 cursor-pointer"
          data-testid="photo-remove-button"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Profile Photo</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={photo}
                alt="Profile full"
                className="max-h-64 rounded-lg object-contain"
                data-testid="photo-full-preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div data-testid="photo-upload">
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300 cursor-pointer">
          <Camera className="h-4 w-4" />
          Profile Photo
          <span className="ml-auto text-xs text-gray-400">(optional)</span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {isUploading ? (
            <div className="mt-2">
              <PhotoUploadProgress />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 cursor-pointer"
              data-testid="photo-upload-area"
            >
              <Camera className="h-8 w-8" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-gray-400">
                JPEG or PNG, max 2MB
              </span>
            </button>
          )}
          {error && (
            <p
              className="mt-1.5 text-xs text-red-500"
              data-testid="photo-upload-error"
            >
              {error}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
      {hiddenInput}
    </div>
  );
}
