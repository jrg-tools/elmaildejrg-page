import { Image } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TableKit } from '@tiptap/extension-table';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';

import '@/components/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

export function Editor({ id, content }: { id?: string; content?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024, // 5MB
        limit: 3,
        onError: error => console.error('Upload failed:', error),
      }),
      TableKit,
      TextStyleKit,
      Placeholder.configure({
        placeholder: 'En que estás pensando? …',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none text-left',
      },
    },
  });

  return (
    <section>
      <EditorContext.Provider value={{ editor }}>
        <div className="tiptap-button-group" data-orientation="horizontal">
          <ImageUploadButton text="Add" />
        </div>
        <EditorContent editor={editor} className="mt-12 min-h-screen" />
      </EditorContext.Provider>

    </section>
  );
}
