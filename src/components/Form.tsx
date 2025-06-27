import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { emailSchema } from '@/lib/validator';

export function NewsletterForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async ({ email }: { email: string }) => {
    setMessage('');
    setIsLoading(true);

    try {
      await api.post('/subscribe', { email });
      reset({ email: '' });

      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 150,
          spread: 60,
          origin: { x, y },
        });
      }
    }
    catch {
      setMessage('Error de conexión. Por favor, inténtalo de nuevo.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            {...register('email')}
            type="email"
            placeholder="Introduce tu email"
            className="w-full p-3 rounded-md focus:outline-none bg-white dark:bg-zinc-950 border-zinc-100 border-2 dark:border-zinc-900"
            disabled={isLoading}
          />
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="p-3 bg-zinc-200/30 hover:bg-zinc-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-950 text-black dark:text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          {isLoading ? 'Enviando...' : 'Suscríbete'}
        </button>
      </div>
      {message && (
        <p className={`text-sm ${message.includes('exitosa') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      {errors.email && (
        <p className="text-sm text-red-600 mt-1">
          {errors.email.message}
        </p>
      )}
    </div>
  );
}
