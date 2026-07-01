<?php

namespace App\Services;

use App\Models\CareerRoadmap;
use App\Models\MarketData;
use App\Models\SkillGap;
use App\Models\User;

class CareerRoadmapService
{
    public function generate(User $user, string $targetJob): CareerRoadmap
    {
        $jobData = MarketData::byJobTitle($targetJob)->first();

        $roadmap = $this->buildRetroPlan($targetJob, $jobData, $user);

        $careerRoadmap = CareerRoadmap::create([
            'user_id' => $user->id,
            'target_job' => $targetJob,
            'roadmap_data' => $roadmap,
            'generated_at' => now(),
        ]);

        $this->generateSkillGaps($user, $careerRoadmap, $jobData);

        return $careerRoadmap->load('skillGaps');
    }

    private function buildRetroPlan(string $targetJob, ?MarketData $jobData, User $user): array
    {
        $steps = [];
        $today = now();

        // Étape 5 : Objectif final
        $steps[] = [
            'step' => 5,
            'period' => 'Objectif final',
            'title' => $targetJob,
            'description' => 'Poste visé : ' . $targetJob,
            'duration_years' => 0,
        ];

        // Étape 4 : Spécialisation (années 3-5)
        $steps[] = [
            'step' => 4,
            'period' => 'Années 4-5',
            'title' => 'Spécialisation et première expérience',
            'description' => 'Master / Spécialisation en ' . ($jobData?->sector ?? 'domaine pertinent'),
            'duration_years' => 2,
            'certifications' => $jobData?->required_skills ?? [],
        ];

        // Étape 3 : Études supérieures (années 2-3)
        $steps[] = [
            'step' => 3,
            'period' => 'Années 2-3',
            'title' => 'Formation supérieure',
            'description' => 'Licence / Bachelor en ' . ($jobData?->sector ?? 'domaine visé'),
            'duration_years' => 2,
            'study_cost' => $jobData?->study_cost_min ?? null,
        ];

        // Étape 2 : BAC (année 1)
        $steps[] = [
            'step' => 2,
            'period' => 'Année 1',
            'title' => 'Obtention du BAC',
            'description' => 'Baccalauréat général ou technologique adapté',
            'duration_years' => 1,
        ];

        // Étape 1 : Aujourd'hui
        $profile = $user->profile;
        $steps[] = [
            'step' => 1,
            'period' => 'Aujourd\'hui',
            'title' => 'Point de départ',
            'description' => $profile?->age
                ? 'Vous avez ' . $profile->age . ' ans. Orientation vers ' . $targetJob
                : 'Préparation à l\'orientation vers ' . $targetJob,
            'duration_years' => 0,
        ];

        // Coût total estimé
        $totalCost = $jobData ? ($jobData->study_cost_max ?? $jobData->study_cost_min ?? 0) : 0;
        $budgetOk = $profile?->budget && $totalCost > 0 && $profile->budget >= $totalCost;

        return [
            'steps' => $steps,
            'target_job' => $targetJob,
            'sector' => $jobData?->sector,
            'estimated_total_study_cost' => $totalCost,
            'budget_sufficient' => $budgetOk,
            'budget_declared' => $profile?->budget,
            'salary_outlook' => [
                'entry' => $jobData?->salary_min,
                'mid_career' => $jobData?->salary_avg,
                'senior' => $jobData?->salary_max,
            ],
            'market_tension' => $jobData?->tension_rate,
            'generated_at' => $today->toDateTimeString(),
        ];
    }

    private function generateSkillGaps(User $user, CareerRoadmap $roadmap, ?MarketData $jobData): void
    {
        $skills = $jobData?->required_skills ?? ['Compétences techniques', 'Compétences relationnelles', 'Adaptabilité'];

        foreach ($skills as $skill) {
            SkillGap::create([
                'user_id' => $user->id,
                'career_roadmap_id' => $roadmap->id,
                'skill_name' => $skill,
                'current_level' => rand(1, 3),
                'required_level' => 5,
                'suggested_courses' => [
                    ['name' => 'Formation en ' . $skill, 'platform' => 'MOOCs', 'url' => null],
                    ['name' => 'Stage pratique en ' . $skill, 'platform' => 'Entreprises', 'url' => null],
                ],
            ]);
        }
    }
}
