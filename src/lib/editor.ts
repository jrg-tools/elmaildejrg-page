import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import EditorjsList from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Underline from '@editorjs/underline';
import { ColorPickerWithoutSanitize } from 'editorjs-color-picker';
import { api } from '@/lib/api';

export function editorConfig(
  editRef: React.RefObject<HTMLDivElement | null>,
  getToken: (options?: { skipCache?: boolean }) => Promise<string | undefined>,
  content?: string,
  id?: string,
) {
  return {
    holder: editRef.current,
    placeholder: 'Escribe tus ideas ...',
    data: content ? JSON.parse(content) : undefined,
    tools: {
      inlineCode: {
        class: InlineCode,
      },
      Marker: {
        class: Marker,
      },
      underline: Underline,
      header: {
        class: Header,
        config: {
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 2,
        },
      },
      ColorPicker: {
        class: ColorPickerWithoutSanitize,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      List: {
        class: EditorjsList,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered',
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile: async (file: File) => {
              const token = await getToken({ skipCache: true }) || undefined;

              const formData = new FormData();
              formData.append('file', file);
              if (id) {
                formData.append('folder', id);
              }

              const response = await api.uploadFile<{ url: string }>('/admin/upload-image', formData, { token });

              return {
                success: 1,
                file: {
                  url: response.url,
                },
              };
            },
          },
        },
      },
    },
  };
}
