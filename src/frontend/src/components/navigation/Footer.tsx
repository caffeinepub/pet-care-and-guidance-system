import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 fill-primary text-primary" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">
            This system provides guidance and information. Always consult a licensed veterinarian for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
