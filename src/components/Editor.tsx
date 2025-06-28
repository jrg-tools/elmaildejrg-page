import type { Newsletter } from '@/lib/types';
import { useAuth } from '@clerk/astro/react';
import EditorJS from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import edjsHTML from 'editorjs-to-html';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { editorConfig } from '@/lib/editor';
import { slugSchema } from '@/lib/validator';

export function Editor({
  slug = '',
  id,
  blocks,
  isPublished = false,
  // updatedAt,
  // createdAt,
}: Partial<Newsletter>) {
  const editRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorJS | null>(null);
  const { getToken } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [slugValidationError, setSlugValidationError] = useState<string | null>(null);
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);

  const {
    register,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(slugSchema),
    mode: 'onChange',
    defaultValues: {
      slug,
    },
  });

  const slugValue = watch('slug');

  useEffect(() => {
    if (!editRef.current)
      return;

    if (editorInstance.current) {
      editorInstance.current.destroy();
    }

    editorInstance.current = new EditorJS(editorConfig(editRef, getToken, blocks, id));

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, [id, blocks]);

  // Validate slug on server when user unfocuses
  const validateSlugOnServer = async (slug: string) => {
    if (!slug || errors.slug)
      return;

    setIsValidatingSlug(true);
    setSlugValidationError(null);

    try {
      const token = await getToken({ skipCache: true });
      const { isValid } = await api.post('/admin/validate-slug', { slug, id }, { token });
      if (isValid) {
        clearErrors('slug');
        return;
      }
      setSlugValidationError('Slug is already in use');
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Slug is already in use';
      setSlugValidationError(errorMessage);
      setError('slug', { message: errorMessage });
    }
    finally {
      setIsValidatingSlug(false);
    }
  };

  const handleSlugBlur = () => {
    if (slugValue) {
      validateSlugOnServer(slugValue);
    }
  };

  const saveContent = async (isPublished: boolean = false) => {
    if (!editorInstance.current || !slugValue || !isValid || slugValidationError) {
      return;
    }

    const setSaving = isPublished ? setIsPublishing : setIsSaving;
    setSaving(true);

    try {
      const editorData = await editorInstance.current.save();
      const edjsParser = edjsHTML();
      const htmlContent = edjsParser.parse(editorData);

      const token = await getToken({ skipCache: true });
      const response = await api.post('/admin/newsletter', {
        slug: slugValue,
        content: htmlContent,
        blocks: editorData,
        isPublished,
        id,
      }, { token });

      // If successfully saved and not already in edit mode, redirect
      if (response && (!slug || response.slug !== slug)) {
        window.location.href = `/edit/${response.slug}`;
      }
    }
    catch (error) {
      console.error('Failed to save:', error);
      // You might want to show a toast notification here
    }
    finally {
      setSaving(false);
    }
  };

  const handleSave = () => saveContent(isPublished);
  const handlePublish = () => saveContent(true);

  const isSlugInvalid = !!errors.slug || !!slugValidationError;
  const canSaveOrPublish = isValid && !isSlugInvalid && !isValidatingSlug && slugValue;

  return (
    <section className="mt-12">
      {/* Top bar with controls */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-24 mb-8">
        <div className="flex-1 relative">
          <input
            {...register('slug')}
            type="text"
            placeholder="mi-nuevo-newsletter"
            className={`w-full px-3 py-2 text-sm rounded-md focus:outline-none bg-white dark:bg-zinc-950 border-2 pr-8 ${
              isSlugInvalid
                ? 'border-red-500'
                : isValidatingSlug
                  ? 'border-blue-500'
                  : 'border-zinc-200 dark:border-zinc-800'
            }`}
            onBlur={handleSlugBlur}
            disabled={isSaving || isPublishing}
          />
          {/* Loading indicator inside input */}
          {isValidatingSlug && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isPublished && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canSaveOrPublish || isPublishing || isSaving}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 disabled:from-rose-300 disabled:to-red-300 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none text-sm"
            >
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSaveOrPublish || isSaving || isPublishing}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none text-sm"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div id={id} ref={editRef} className="prose max-w-none text-left" />
    </section>
  );
}
