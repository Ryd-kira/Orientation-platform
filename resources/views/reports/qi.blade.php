<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Questionnaire d’aptitudes - Orientation IA</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.6; color: #333; padding: 40px; }
        h1 { color: #1a56db; font-size: 24px; border-bottom: 2px solid #1a56db; padding-bottom: 10px; }
        h2 { color: #1a56db; font-size: 18px; margin-top: 25px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #1a56db; color: white; }
        .iq-score { font-size: 48px; font-weight: bold; color: #1a56db; text-align: center; padding: 20px; }
        .iq-label { text-align: center; font-size: 18px; color: #6b7280; }
        .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .footer { text-align: center; color: #9ca3af; font-size: 10px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header" style="text-align: center;">
        <h1>Rapport du questionnaire d’aptitudes</h1>
        <div style="color: #6b7280;">Généré le {{ $generatedAt }} pour {{ $user->name }}</div>
    </div>

    @if ($qiTest)
    <div style="text-align: center; margin: 30px 0;">
        <div class="iq-score">{{ $qiTest->iq_score }}</div>
        <div class="iq-label">Score indicatif</div>
    </div>

    <div class="section">
        <h2>Détail par Sous-Section</h2>
        <table>
            <tr><th>Sous-section</th><th>Score</th><th>Max</th><th>Pourcentage</th></tr>
            @foreach ($qiTest->subsections as $sub)
            <tr>
                <td>{{ str_replace('_', ' ', ucfirst($sub->type)) }}</td>
                <td>{{ $sub->score }}</td>
                <td>{{ $sub->max_score }}</td>
                <td>{{ $sub->max_score > 0 ? round(($sub->score / $sub->max_score) * 100) : 0 }}%</td>
            </tr>
            @endforeach
        </table>
    </div>

    <div class="section">
        <h2>À propos de ce résultat</h2>
        <p>Ce questionnaire d’orientation n’est pas un test psychométrique standardisé et ne constitue pas une mesure clinique du QI. Le score est une indication basée sur vos réponses, sans comparaison à une population de référence.</p>
    </div>
    @else
    <p>Aucun questionnaire d’aptitudes complété.</p>
    @endif

    <div class="footer">
        Rapport généré par Orientation IA - {{ $generatedAt }}
    </div>
</body>
</html>
