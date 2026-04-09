import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TagInputProps {
    tagValidation: {
        validate: (tag: string) => boolean;
        message: string;
    };
    onTagsChange: (tags: string[]) => void;
}

export const TagInput = ({
    tagValidation,
    onTagsChange,
    ...props
}: TagInputProps & React.ComponentProps<'input'>) => {
    const [error, setError] = useState<string | null>(null);
    const [tag, setTag] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTag(value);
    };

    const handleBlur = () => {
        const newTag = tag.trim().toLowerCase();
        if (newTag.length && !tags.includes(newTag)) {
            if (tagValidation.validate(newTag)) {
                setError(null);
                setTag('');

                const newTags = [...tags, newTag];
                setTags(newTags);
                onTagsChange(newTags);
            } else {
                setError(tagValidation.message);
            }
        }
    };

    const hanldeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const enterKeys = [',', 'Enter', 'Tab', ' '];
        const newTag = tag.trim().toLowerCase();

        if (
            enterKeys.includes(e.key) &&
            newTag.length &&
            !tags.includes(newTag)
        ) {
            if (tagValidation.validate(newTag)) {
                e.preventDefault();
                setError(null);
                setTag('');

                const newTags = [...tags, newTag];
                setTags(newTags);
                onTagsChange(newTags);
            } else {
                setError(tagValidation.message);
            }
        } else if (e.key === 'Backspace' && !newTag.length && tags.length) {
            e.preventDefault();
            const tagsCopy = [...tags];
            const lastTag = tagsCopy.pop();
            setTags(tagsCopy);
            onTagsChange(tagsCopy);
            setTag(lastTag ?? '');
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onTagsChange(newTags);
    };

    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full flex-wrap items-center gap-1 rounded-md border-1 border-secondary bg-sidebar-accent px-2">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center rounded-full bg-primary p-0.5 px-2 text-sm text-secondary"
                    >
                        {tag}
                        <Button
                            disabled={props.disabled}
                            type="button"
                            variant="ghost"
                            className="h-2 w-2 hover:bg-transparent hover:text-secondary"
                            onClick={() => removeTag(index)}
                        >
                            <XIcon />
                        </Button>
                    </div>
                ))}
                <Input
                    {...props}
                    placeholder={tags.length ? '' : props.placeholder}
                    value={tag}
                    onChange={handleChange}
                    onKeyDown={hanldeKeyDown}
                    onBlur={handleBlur}
                    className="min-w-[100px] flex-1 border-none focus-visible:border-secondary focus-visible:ring-0"
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};
