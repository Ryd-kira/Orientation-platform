<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Initial - Orientation IA</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 40px; }
        h1 { color: #1a56db; font-size: 24px; border-bottom: 2px solid #1a56db; padding-bottom: 10px; }
        h2 { color: #1a56db; font-size: 18px; margin-top: 25px; }
        h3 { color: #374151; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { border-bottom: none; }
        .header .subtitle { color: #6b7280; font-size: 14px; }
        .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #1a56db; color: white; }
        .score-bar { height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; margin: 5px 0; }
        .score-fill { height: 100%; background: #1a56db; border-radius: 10px; }
        .footer { text-align: center; color: #9ca3af; font-size: 10px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; background: #dbeafe; color: #1e40af; }
        .match-card { border: 1px solid #e5e7eb; padding: 12px; margin: 8px 0; border-radius: 6px; }
        .match-score { font-size: 20px; font-weight: bold; color: #1a56db; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 8px 12px; margin: 5px 0; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport d'Orientation Initial</h1>
        <div class="subtitle">Généré le {{ $generatedAt }} pour {{ $user->name }}</div>
    </div>

    <div class="section">
        <h2>Profil Utilisateur</h2>
        <table>
            <tr><td class="label">Nom</td><td class="value">{{ $user->name }}</td></tr>
            <tr><td class="label">Email</td><td class="value">{{ $user->email }}</td></tr>
            @if ($profile)
            <tr><td class="label">Âge</td><td class="value">{{ $profile->age ?? 'Non renseigné' }}</td></tr>
            <tr><td class="label">Région</td><td class="value">{{ $profile->region ?? 'Non renseignée' }}</td></tr>
            <tr><td class="label">Budget études</td><td class="value">{{ $profile->budget ? number_format($profile->budget, 2) . ' €' : 'Non renseigné' }}</td></tr>
            <tr><td class="label">Métier cible</td><td class="value">{{ $profile->target_job_title ?? 'Non renseigné' }}</td></tr>
            @endif
        </table>
    </div>

    @if ($academicRecords->isNotEmpty())
    <div class="section">
        <h2>Parcours Académique</h2>
        <table>
            <tr><th>Diplôme</th><th>Domaine</th><th>Établissement</th></tr>
            @foreach ($academicRecords as $record)
            <tr>
                <td>{{ $record->diploma }}</td>
                <td>{{ $record->field_of_study }}</td>
                <td>{{ $record->institution ?? '-' }}</td>
            </tr>
            @endforeach
        </table>
    </div>
    @endif

    @if ($personalityTest)
    <div class="section">
        <h2>Test de Personnalité</h2>
        <p>Score global : <strong>{{ $personalityTest->overall_score }}/100</strong></p>
        <table>
            <tr><th>Trait</th><th>Score</th><th>Niveau</th></tr>
            @foreach ($personalityTest->traitResults as $trait)
            <tr>
                <td>{{ $trait->trait_name }}</td>
                <td>{{ $trait->score }}/100</td>
                <td>
                    <div class="score-bar">
                        <div class="score-fill" style="width: {{ $trait->score }}%"></div>
                    </div>
                </td>
            </tr>
            @endforeach
        </table>
    </div>
    @endif

    @if ($qiTest)
    <div class="section">
        <h2>Test de QI</h2>
        <table>
            <tr><td class="label">Score de QI</td><td class="value">{{ $qiTest->iq_score }}</td></tr>
            <tr><td class="label">Centile</td><td class="value">{{ $qiTest->percentile }}%</td></tr>
            <tr><td class="label">Statut</td><td class="value">{{ $qiTest->status }}</td></tr>
        </table>
        @if ($qiTest->subsections->isNotEmpty())
        <h3>Sous-sections</h3>
        <table>
            <tr><th>Type</th><th>Score</th><th>Max</th></tr>
            @foreach ($qiTest->subsections as $sub)
            <tr>
                <td>{{ $sub->type }}</td>
                <td>{{ $sub->score }}</td>
                <td>{{ $sub->max_score }}</td>
            </tr>
            @endforeach
        </table>
        @endif
    </div>
    @endif

    @if (!empty($matching['matches']))
    <div class="section">
        <h2>Résultats du Matching</h2>
        <p>{{ $matching['total_careers_analyzed'] }} métiers analysés</p>
        @foreach (array_slice($matching['matches'], 0, 5) as $match)
        <div class="match-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>{{ $match['job_title'] }}</strong>
                    <br><span style="font-size: 11px; color: #6b7280;">{{ $match['sector'] }} - {{ $match['region'] }}</span>
                </div>
                <div class="match-score">{{ $match['score'] }}%</div>
            </div>
            <div style="margin-top: 8px; font-size: 11px;">
                <span class="badge">{{ $match['compatibility_label'] }}</span>
                @if ($match['salary_avg']) <span class="badge">{{ number_format($match['salary_avg']) }} €/an</span> @endif
                @if ($match['tension_rate']) <span class="badge">Tension: {{ $match['tension_rate'] }}%</span> @endif
            </div>
            @if (!empty($match['alerts']))
                @foreach ($match['alerts'] as $alert)
                <div class="alert">{{ $alert }}</div>
                @endforeach
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="footer">
        Rapport généré par Orientation IA - {{ $generatedAt }}
    </div>
</body>
</html>
