<?php

namespace App\Support;

use App\Models\User;

/**
 * A small, reusable email allowlist.
 *
 * The list can be supplied as a comma-separated string (the usual shape of an
 * environment variable), as an array, or as null. Every value is normalized
 * in exactly one place: entries are trimmed, lowercased, deduplicated, and
 * empty or non-string values are discarded. An empty allowlist therefore
 * denies everyone, which is the safe default.
 */
final class EmailAllowlist
{
    /**
     * @var list<string>
     */
    private array $emails;

    public function __construct(mixed $allowedEmails = null)
    {
        $this->emails = self::normalize($allowedEmails);
    }

    /**
     * Build an allowlist from a configuration value.
     *
     * The configuration value may be the raw comma-separated string stored by
     * config/bug-reports.php, an array, or null.
     */
    public static function fromConfig(string $key): self
    {
        return new self(config($key));
    }

    /**
     * @return list<string>
     */
    public function emails(): array
    {
        return $this->emails;
    }

    /**
     * Whether the given user or email address is on the allowlist.
     *
     * Nulls and unsupported subject types are denied rather than causing an
     * error, so callers can safely pass `$request->user()` before/without an
     * authenticated user being present.
     */
    public function allows(mixed $subject): bool
    {
        $email = match (true) {
            $subject instanceof User => $subject->email,
            is_string($subject) => $subject,
            default => null,
        };

        if (! is_string($email)) {
            return false;
        }

        $normalizedEmail = self::normalizeEmail($email);

        return $normalizedEmail !== '' && in_array($normalizedEmail, $this->emails, true);
    }

    /**
     * @return list<string>
     */
    private static function normalize(mixed $raw): array
    {
        $values = match (true) {
            is_string($raw) => [$raw],
            is_array($raw) => $raw,
            default => [],
        };

        $emails = [];

        foreach ($values as $value) {
            if (! is_string($value)) {
                continue;
            }

            // String values may themselves be comma-separated (for example,
            // an array built from more than one configuration source).
            foreach (explode(',', $value) as $candidate) {
                $email = self::normalizeEmail($candidate);

                if ($email !== '' && ! in_array($email, $emails, true)) {
                    $emails[] = $email;
                }
            }
        }

        return $emails;
    }

    private static function normalizeEmail(string $email): string
    {
        return mb_strtolower(trim($email));
    }
}
