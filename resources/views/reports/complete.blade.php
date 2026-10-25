<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Complet - Orientation IA</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 40px; }
        h1 { color: #1a56db; font-size: 24px; border-bottom: 2px solid #1a56db; padding-bottom: 10px; }
        h2 { color: #1a56db; font-size: 18px; margin-top: 25px; }
        h3 { color: #374151; font-size: 14px; }
        .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #1a56db; color: white; }
        .score-bar { height: 16px; background: #e5e7eb; border-radius: 8px; overflow: hidden; margin: 5px 0; }
        .score-fill { height: 100%; background: #1a56db; border-radius: 8px; }
        .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
        .swot-box { padding: 12px; border-radius: 6px; }
        .swot-s { background: #dcfce7; border-left: 4px solid #16a34a; }
        .swot-w { background: #fce7f3; border-left: 4px solid #e11d48; }
        .swot-o { background: #dbeafe; border-left: 4px solid #2563eb; }
        .swot-t { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .swot-box h3 { margin: 0 0 8px 0; font-size: 14px; }
        .swot-box ul { margin: 0; padding-left: 16px; font-size: 11px; }
        .swot-box li { margin: 3px 0; }
        .match-card { border: 1px solid #e5e7eb; padding: 10px; margin: 6px 0; border-radius: 6px; font-size: 11px; }
        .match-score { font-size: 16px; font-weight: bold; color: #1a56db; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 10px; font-size: 10px; background: #dbeafe; color: #1e40af; margin: 1px; }
        .footer { text-align: center; color: #9ca3af; font-size: 10px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 30px;">
        <h1>Rapport d'Orientation Complet</h1>
        <div style="color: #6b7280;">Analyse Holistique avec Matrice SWOT</div>
        <div style="color: #9ca3af; font-size: 11px;">Généré le {{ $generatedAt }} pour {{ $user->name }}</div>
    </div>

    @if (!empty($swot))
    <div class="section">
        <h2>Analyse SWOT</h2>
        <div class="swot-grid">
            <div class="swot-box swot-s">
                <h3>Forces (S)</h3>
                <ul>
                    @foreach ($swot['strengths'] as $s)
                    <li>{{ $s }}</li>
                    @endforeach
                </ul>
            </div>
            <div class="swot-box swot-w">
                <h3>Faiblesses (W)</h3>
                <ul>
                    @foreach ($swot['weaknesses'] as $w)
                    <li>{{ $w }}</li>
                    @endforeach
                </ul>
            </div>
            <div class="swot-box swot-o">
                <h3>Opportunités (O)</h3>
                <ul>
                    @foreach ($swot['opportunities'] as $o)
                    <li>{{ $o }}</li>
                    @endforeach
                </ul>
            </div>
            <div class="swot-box swot-t">
                <h3>Menaces (T)</h3>
                <ul>
                    @foreach ($swot['threats'] as $t)
                    <li>{{ $t }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
    @endif

    <div class="section">
        <h2>Synthèse du Profil</h2>
        <table>
            <tr><td>Nom</td><td>{{ $user->name }}</td></tr>
            @if ($profile)
            <tr><td>Âge</td><td>{{ $profile->age ?? '-' }}</td></tr>
            <tr><td>Région</td><td>{{ $profile->region ?? '-' }}</td></tr>
            <tr><td>Budget</td><td>{{ $profile->budget ? number_format($profile->budget, 2) . ' €' : '-' }}</td></tr>
            <tr><td>Métier cible</td><td>{{ $profile->target_job_title ?? '-' }}</td></tr>
            @endif
            @if ($qiTest)
            <tr><td>Score indicatif au questionnaire d’aptitudes</td><td>{{ $qiTest->iq_score }}</td></tr>
            @endif
            @if ($personalityTest)
            <tr><td>Personnalité</td><td>{{ $personalityTest->traitResults->count() }} traits mesurés, score moyen {{ $personalityTest->overall_score }}/100</td></tr>
            @endif
        </table>
    </div>

    @if (!empty($matching['matches']))
    <div class="section">
        <h2>Top Correspondances Métier</h2>
        @foreach (array_slice($matching['matches'], 0, 8) as $match)
        <div class="match-card">
            <div style="display: flex; justify-content: space-between;">
                <div><strong>{{ $match['job_title'] }}</strong> - {{ $match['sector'] }}</div>
                <div class="match-score">{{ $match['score'] }}%</div>
            </div>
            <div style="margin-top: 4px;">
                <span class="badge">{{ $match['compatibility_label'] }}</span>
                @if ($match['salary_avg']) <span class="badge">{{ number_format($match['salary_avg']) }} €/an</span> @endif
                @if ($match['tension_rate']) <span class="badge">Tension: {{ $match['tension_rate'] }}%</span> @endif
            </div>
        </div>
        @endforeach
    </div>
    @endif

    <div class="footer">
        Rapport Complet généré par Orientation IA - {{ $generatedAt }}
    </div>
</body>
</html>
