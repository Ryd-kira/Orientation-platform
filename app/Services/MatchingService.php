<?php

namespace App\Services;

use App\Models\MarketData;
use App\Models\User;
use Illuminate\Support\Collection;

class MatchingService
{
    public function match(User $user): array
    {
        $profile = $user->profile;
        if (!$profile) {
            return ['matches' => [], 'message' => 'Complétez votre profil d\'abord.'];
        }

        $excludedSubjects = $this->getExcludedSubjects($user);
        $personalityTraits = $this->getPersonalityTraits($user);
        $qiScore = $this->getLatestQiScore($user);

        $jobs = MarketData::query();

        if ($profile->target_job_title) {
            $jobs->orWhereRaw('LOWER(job_title) LIKE ?', ['%' . strtolower($profile->target_job_title) . '%']);
        }

        if ($profile->region) {
            $jobs->orWhereRaw('LOWER(region) LIKE ?', ['%' . strtolower($profile->region) . '%']);
        }

        $jobs = $jobs->get();

        if ($jobs->isEmpty()) {
            $jobs = MarketData::inRandomOrder()->limit(10)->get();
        }

        $matches = $jobs->map(function ($job) use ($user, $profile, $excludedSubjects, $personalityTraits, $qiScore) {
            return $this->calculateMatch($job, $user, $profile, $excludedSubjects, $personalityTraits, $qiScore);
        })->filter(function ($match) {
            return $match['score'] > 0 && !$match['excluded'];
        })->sortByDesc('score')->map(function ($match) {
            unset($match['excluded']);
            return $match;
        })->values()->toArray();

        return [
            'matches' => array_slice($matches, 0, 15),
            'total_careers_analyzed' => $jobs->count(),
            'user_profile_summary' => [
                'target_job' => $profile->target_job_title,
                'region' => $profile->region,
                'budget' => $profile->budget,
                'qi_score' => $qiScore,
                'personality_traits' => $personalityTraits,
                'excluded_subjects' => $excludedSubjects,
            ],
        ];
    }

    private function calculateMatch($job, User $user, $profile, array $excludedSubjects, array $personalityTraits, ?int $qiScore): array
    {
        $score = 0;
        $factors = [];
        $alerts = [];
        $excluded = false;

        // Exclusion par matières détestées
        $jobSkills = $job->required_skills ?? [];
        foreach ($excludedSubjects as $subject) {
            foreach ($jobSkills as $skill) {
                if (stripos($skill, $subject) !== false || stripos($subject, $skill) !== false) {
                    $excluded = true;
                    $factors[] = "Exclusion : \"$subject\" détecté dans les compétences requises";
                    $alerts[] = "Ce métier requiert \"$skill\" qui est lié à une matière que vous avez marquée comme détestée.";
                    break 2;
                }
            }
        }

        // Compatibilité géographique
        if ($profile->region && $job->region && stripos($job->region, $profile->region) !== false) {
            $score += 15;
            $factors[] = 'Même région +15';
        } elseif ($profile->region && $job->region) {
            $score += 5;
            $factors[] = 'Région différente +5';
        }

        // Compatibilité budget / coût études
        if ($profile->budget && $job->study_cost_max) {
            if ($profile->budget >= $job->study_cost_max) {
                $score += 20;
                $factors[] = 'Budget suffisant +20';
            } elseif ($profile->budget >= $job->study_cost_min) {
                $score += 10;
                $factors[] = 'Budget partiel +10';
                $alerts[] = 'Votre budget pourrait être insuffisant pour couvrir la totalité des études.';
            } else {
                $alerts[] = '⚠️ Alerte critique : votre budget (' . $profile->budget . '€) est inférieur au coût minimum des études (' . $job->study_cost_min . '€).';
                $score -= 10;
                $factors[] = 'Budget insuffisant -10';
            }
        }

        // Score QI
        if ($qiScore !== null) {
            if ($qiScore >= 130) {
                $score += 15;
                $factors[] = 'Score élevé au questionnaire d’aptitudes +15';
            } elseif ($qiScore >= 110) {
                $score += 10;
                $factors[] = 'Score moyen-supérieur au questionnaire d’aptitudes +10';
            } elseif ($qiScore >= 90) {
                $score += 5;
                $factors[] = 'Score dans la moyenne au questionnaire d’aptitudes +5';
            }
        }

        // Tension du marché
        if ($job->tension_rate !== null) {
            if ($job->tension_rate > 80) {
                $score += 20;
                $factors[] = 'Marché très tendu (forte demande) +20';
            } elseif ($job->tension_rate > 50) {
                $score += 10;
                $factors[] = 'Marché tendu +10';
            }
        }

        // Salaire
        if ($job->salary_avg !== null) {
            if ($job->salary_avg > 50000) {
                $score += 10;
                $factors[] = 'Salaire élevé +10';
            } elseif ($job->salary_avg > 30000) {
                $score += 5;
                $factors[] = 'Salaire correct +5';
            }
        }

        // Personnalité
        if (!empty($personalityTraits)) {
            $goodFit = ['analytique', 'créatif', 'rigoureux', 'communicatif', 'adaptable'];
            foreach ($personalityTraits as $trait) {
                if (in_array(strtolower($trait['trait_name'] ?? ''), $goodFit) && $trait['score'] > 60) {
                    $score += 5;
                    $factors[] = 'Trait "' . $trait['trait_name'] . '" compatible +5';
                }
            }
        }

        $score = max(0, min(100, $score));

        return [
            'job_title' => $job->job_title,
            'sector' => $job->sector,
            'score' => $score,
            'excluded' => $excluded,
            'compatibility_label' => $this->getLabel($score),
            'factors' => $factors,
            'alerts' => $alerts,
            'salary_avg' => $job->salary_avg,
            'salary_min' => $job->salary_min,
            'salary_max' => $job->salary_max,
            'tension_rate' => $job->tension_rate,
            'education_level_required' => $job->education_level_required,
            'study_cost_min' => $job->study_cost_min,
            'study_cost_max' => $job->study_cost_max,
            'required_skills' => $job->required_skills,
            'region' => $job->region,
        ];
    }

    public function checkEconomicCoherence(User $user, ?string $jobTitle = null): array
    {
        $profile = $user->profile;
        if (!$profile || !$profile->budget) {
            return [
                'results' => [],
                'has_blocking_alert' => false,
                'message' => 'Renseignez votre budget dans votre profil pour vérifier la faisabilité financière.',
            ];
        }

        $query = MarketData::query();
        if ($jobTitle) {
            $query->whereRaw('LOWER(job_title) LIKE ?', ['%' . strtolower($jobTitle) . '%']);
        }
        if ($profile->region) {
            $query->whereRaw('LOWER(region) LIKE ?', ['%' . strtolower($profile->region) . '%']);
        }

        $jobs = $query->get();
        if ($jobs->isEmpty()) {
            return [
                'results' => [],
                'has_blocking_alert' => false,
                'message' => $jobTitle
                    ? "Aucune donnée de coût d'études disponible pour le métier « {$jobTitle} »."
                    : 'Aucune donnée de coût d’études disponible pour vérifier ce profil.',
            ];
        }

        $results = [];
        foreach ($jobs as $job) {
            $coherent = true;
            $message = 'Budget suffisant.';

            $averageCost = $job->study_cost_min !== null && $job->study_cost_max !== null
                ? ($job->study_cost_min + $job->study_cost_max) / 2
                : ($job->study_cost_min ?? $job->study_cost_max);

            if ($averageCost === null) {
                $message = 'Coût des études non renseigné.';
            } elseif ($profile->budget < $averageCost) {
                $coherent = false;
                $message = 'Alerte critique : budget de ' . number_format((float) $profile->budget, 0, ',', ' ')
                    . ' € inférieur au coût moyen estimé des études (' . number_format((float) $averageCost, 0, ',', ' ') . ' €).';
            }

            $results[] = [
                'job_title' => $job->job_title,
                'coherent' => $coherent,
                'message' => $message,
                'budget_user' => $profile->budget,
                'study_cost_min' => $job->study_cost_min,
                'study_cost_average' => $averageCost,
                'study_cost_max' => $job->study_cost_max,
            ];
        }

        return [
            'results' => $results,
            'has_blocking_alert' => collect($results)->contains(fn($r) => !$r['coherent']),
        ];
    }

    private function getExcludedSubjects(User $user): array
    {
        return $user->academicRecords
            ->flatMap(fn($r) => $r->disliked_subjects ?? [])
            ->unique()
            ->values()
            ->toArray();
    }

    private function getPersonalityTraits(User $user): array
    {
        $test = $user->personalityTests()->where('status', 'completed')->latest()->first();
        return $test ? $test->traitResults->map(fn($t) => ['trait_name' => $t->trait_name, 'score' => $t->score])->toArray() : [];
    }

    private function getLatestQiScore(User $user): ?int
    {
        $test = $user->qiTests()->where('status', 'completed')->latest()->first();
        return $test?->iq_score;
    }

    private function getLabel(int $score): string
    {
        return match (true) {
            $score >= 80 => 'Excellent',
            $score >= 60 => 'Très bon',
            $score >= 40 => 'Bon',
            $score >= 20 => 'Moyen',
            default => 'Faible',
        };
    }
}
