import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TransitionLoaderProps {
    message: string;
    isVisible: boolean;
    minDuration?: number;
}

export const TransitionLoader = ({
    message,
    isVisible,
    minDuration = 3000,
}: TransitionLoaderProps) => {
    const [show, setShow] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            startTimeRef.current = Date.now();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        } else {
            if (startTimeRef.current !== null) {
                const elapsed = Date.now() - startTimeRef.current;
                const remaining = Math.max(0, minDuration - elapsed);

                if (remaining > 0) {
                    timeoutRef.current = setTimeout(() => {
                        setShow(false);
                        startTimeRef.current = null;
                    }, remaining);
                } else {
                    setShow(false);
                    startTimeRef.current = null;
                }
            } else {
                setShow(false);
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isVisible, minDuration]);

    if (!show) return null;

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center',
                'bg-black/60 backdrop-blur-sm',
                'transition-opacity duration-300',
                show ? 'opacity-100' : 'opacity-0',
            )}
        >
            <div className="flex flex-col items-center gap-4 rounded-lg bg-background/95 p-8 shadow-lg">
                <Loader2 className="h-12 w-12 animate-spin text-unam-gold" />
                <p className="text-lg font-medium text-primary">{message}</p>
            </div>
        </div>
    );
};
