# Documentation API - Plateforme d'Orientation IA

**Version :** 3.0  
**Date :** 01/07/2026  
**Projet :** Orientation IA - Backend Laravel  

---

## 1. Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (à faire)                        │
│              React / Vue / Nuxt / Next.js                    │
├─────────────────────────────────────────────────────────────┤
│                   API REST (Notre Backend)                   │
│              Laravel 12 + Sanctum + SQLite                   │
│          Base URL: http://localhost:8000/api/                 │
├─────────────────────────────────────────────────────────────┤
│                   Base de données                            │
│        19 migrations → 25 tables (SQLite)                    │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technique
- **Framework :** Laravel 12.62.0
- **Auth :** Sanctum (tokens Bearer)
- **BDD :** SQLite (prêt pour MySQL/PostgreSQL)
- **PDF :** DomPDF
- **Tests :** PHPUnit (27 tests)

---

## 2. Authentification

### 2.1 Inscription

```
POST /api/register
Content-Type: application/json

{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}

→ 201
{
    "user": {
        "id": 1,
        "name": "Jean Dupont",
        "email": "jean@example.com"
    },
    "token": "1|abc123..."
}
```

### 2.2 Connexion

```
POST /api/login
Body: { "email", "password" }

→ 200 { "user": {...}, "token": "1|abc123..." }
→ 422 Identifiants incorrects
```

### 2.3 Déconnexion

```
POST /api/logout
Authorization: Bearer {token}

→ 200 { "message": "Déconnexion réussie." }
```

### 2.4 Profil connecté

```
GET /api/me
Authorization: Bearer {token}

→ 200 { id, name, email, profile: {...}, academic_records: [...] }
```

> **Note :** Toutes les routes suivantes nécessitent `Authorization: Bearer {token}`

---

## 3. Profil Utilisateur (Gratuit)

```
GET    /api/profile        → Voir mon profil
POST   /api/profile        → Créer mon profil
PUT    /api/profile        → Modifier mon profil
```

### Champs du profil

| Champ | Type | Description |
|---|---|---|
| `age` | integer (1-120) | Âge |
| `date_of_birth` | date | Date de naissance |
| `gender` | string (50) | Genre |
| `city` | string (255) | Ville |
| `region` | string (255) | Région |
| `country` | string (255) | Pays |
| `budget` | numeric | Budget études (€) |
| `budget_currency` | string (3) | Devise (EUR par défaut) |
| `bio` | text | Présentation |
| `target_job_title` | string (255) | Métier cible |
| `target_job_description` | text | Description du métier visé |

---

## 4. Parcours Académique (Gratuit)

```
GET    /api/academic-records       → Liste
POST   /api/academic-records       → Créer
GET    /api/academic-records/{id}  → Détail
PUT    /api/academic-records/{id}  → Modifier
DELETE /api/academic-records/{id}  → Supprimer
```

### Champs

```json
{
    "diploma": "BAC Scientifique",
    "field_of_study": "Sciences",
    "institution": "Lycée Jean Moulin",
    "grade": "14/20",
    "start_date": "2023-09-01",
    "end_date": "2024-06-30",
    "disliked_subjects": ["Physique-Chimie", "Mathématiques"],
    "sort_order": 0
}
```

> `disliked_subjects` génère des **tags d'exclusion** pour le matching métier.

---

## 5. Tests & Évaluations (Gratuit)

### 5.1 Test de Personnalité

```
POST /api/personality-tests/start             → Démarrer un test
POST /api/personality-tests/{id}/answers       → Soumettre les réponses
GET  /api/personality-tests/{id}/results       → Voir les résultats
GET  /api/personality-tests/latest             → Dernier test
```

Soumission des réponses (10 traits minimum) :

```json
{
    "traits": [
        { "trait_name": "Ouverture", "score": 75, "details": {} },
        { "trait_name": "Conscienciosité", "score": 82, "details": {} },
        { "trait_name": "Extraversion", "score": 45, "details": {} },
        { "trait_name": "Agréabilité", "score": 70, "details": {} },
        { "trait_name": "Neurotisme", "score": 30, "details": {} },
        { "trait_name": "Créativité", "score": 85, "details": {} },
        { "trait_name": "Rigueur", "score": 78, "details": {} },
        { "trait_name": "Sociabilité", "score": 60, "details": {} },
        { "trait_name": "Empathie", "score": 72, "details": {} },
        { "trait_name": "Adaptabilité", "score": 80, "details": {} }
    ]
}
```

### 5.2 Test de QI (4 sous-sections)

```
POST /api/qi-tests/start                                          → Démarrer
POST /api/qi-tests/{id}/subsection/{subsectionId}/answers         → Soumettre une sous-section
GET  /api/qi-tests/{id}/results                                   → Résultats complets
GET  /api/qi-tests/latest                                         → Dernier test
```

Le test créé automatiquement 4 sous-sections : `logical_matrix`, `numerical_series`, `verbal_analogies`, `spatial_rotation`.

Soumission d'une sous-section :

```json
{
    "answers": [
        { "question_id": 1, "selected_answer": "162" },
        { "question_id": 2, "selected_answer": "36" }
    ],
    "time_spent_seconds": 120
}
```

**Réponse finale (quand toutes les sections sont complétées) :**

```json
{
    "id": 1,
    "status": "completed",
    "iq_score": 115,
    "percentile": 84.13,
    "subsections": [...],
    "answers": [...]
}
```

> Le score QI = écart-type 15, moyenne 100. Gratuit, visible sur le dashboard.

### 5.3 Analyse Métier de Rêve

```
POST /api/dream-job/analyze     → Analyser un métier
GET  /api/dream-job/latest      → Dernière analyse
```

```json
{
    "job_title": "Développeur Web",
    "job_description": "Je suis passionné par la création de sites et applications..."
}

→ 201
{
    "id": 1,
    "job_title": "Développeur Web",
    "nlp_analysis": {
        "keywords_found": ["passion", "créativité", "technique"],
        "keyword_count": 3,
        "compatibility_score": 75,
        "summary": "Analyse basée sur 3 mots-clés détectés.",
        "sentiment": "positive"
    },
    "compatibility_score": 75.00
}
```

---

## 6. Matching & Carrière

### 6.1 Matching Métiers (Gratuit)

```
GET /api/career/match
```

Retourne les 15 meilleurs métiers compatibles avec le profil, triés par score décroissant :

```json
{
    "matches": [
        {
            "job_title": "Data Scientist",
            "sector": "Tech & Numérique",
            "score": 85,
            "compatibility_label": "Très bon",
            "salary_avg": 55000,
            "tension_rate": 90.00,
            "education_level_required": "Bac+5",
            "study_cost_min": 5000.00,
            "study_cost_max": 20000.00,
            "required_skills": ["Python", "R", "Machine Learning", ...],
            "region": "Île-de-France",
            "factors": ["Même région +15", "Budget suffisant +20", ...],
            "alerts": []
        }
    ],
    "total_careers_analyzed": 21,
    "user_profile_summary": {
        "target_job": "Développeur",
        "region": "Île-de-France",
        "budget": 15000.00,
        "qi_score": 115,
        "personality_traits": [...],
        "excluded_subjects": ["Physique-Chimie"]
    }
}
```

**Algorithme de score (0-100%) :**
- Exclusion matières détestées : -20
- Même région : +15
- Budget suffisant : +20 / partiel : +10 / insuffisant : -10
- QI élevé (+130) : +15 / moyen-supérieur : +10
- Tension marché (>80%) : +20 / (>50%) : +10
- Salaire élevé (>50k) : +10
- Traits de personnalité compatibles : +5 chacun

### 6.2 Vérification Budgétaire (Gratuit)

```
GET /api/career/coherence?job_title=Développeur
```

```json
{
    "results": [
        {
            "job_title": "Développeur Full Stack",
            "coherent": true,
            "message": "Budget suffisant.",
            "budget_user": 15000.00,
            "study_cost_min": 3000.00,
            "study_cost_max": 15000.00
        }
    ],
    "has_blocking_alert": false
}
```

### 6.3 Roadmap de Carrière (Premium)

```
POST /api/career/roadmap     → Générer une roadmap
GET  /api/career/roadmaps    → Liste des roadmaps
```

```json
{
    "target_job": "Data Scientist"
}

→ 201
{
    "id": 1,
    "target_job": "Data Scientist",
    "roadmap_data": {
        "steps": [
            { "step": 5, "period": "Objectif final", "title": "Data Scientist" },
            { "step": 4, "period": "Années 4-5", "title": "Spécialisation et première expérience" },
            { "step": 3, "period": "Années 2-3", "title": "Formation supérieure", "study_cost": 5000 },
            { "step": 2, "period": "Année 1", "title": "Obtention du BAC" },
            { "step": 1, "period": "Aujourd'hui", "title": "Point de départ" }
        ],
        "estimated_total_study_cost": 20000,
        "budget_sufficient": true,
        "salary_outlook": {
            "entry": 40000, "mid_career": 55000, "senior": 75000
        },
        "market_tension": 90
    },
    "skill_gaps": [
        {
            "skill_name": "Python",
            "current_level": 2,
            "required_level": 5,
            "suggested_courses": [
                {"name": "Formation en Python", "platform": "MOOCs"},
                {"name": "Stage pratique en Python", "platform": "Entreprises"}
            ]
        }
    ]
}
```

### 6.4 Compétences (Skill Gaps) (Premium)

```
GET /api/career/skill-gaps    → Liste des écarts de compétences
```

---

## 7. Assistant IA & LMS (Premium)

### 7.1 Conseiller IA

```
POST /api/assistant/counsel
```

```json
{
    "message": "Quelles sont mes forces ?"
}

→ 200
{
    "user_message": "Quelles sont mes forces ?",
    "assistant_response": "D'après vos tests psychométriques, votre trait le plus développé est « Conscienciosité » (82/100)...",
    "context_used": "Profil: 18 ans, région Île-de-France, budget 15000€. QI: 115..."
}
```

**Thèmes compris par le conseiller :**
- Forces/faiblesses → analyse des traits de personnalité
- Métier/carrière/orientation → conseils sur le métier cible
- Budget/finances/coût → vérification budgétaire
- QI/test/intelligence → interprétation du score de QI

### 7.2 Assistant LMS (Suggestions de cours)

```
GET /api/assistant/courses
```

```json
{
    "recommendations": [
        {
            "skill": "Python",
            "current_level": 2,
            "required_level": 5,
            "progress": 40,
            "courses": [
                {"name": "Fondamentaux de Python", "platform": "Coursera"},
                {"name": "Perfectionnement en Python", "platform": "Udemy"},
                {"name": "Projet pratique : Python", "platform": "OpenClassrooms"}
            ]
        }
    ],
    "total_gaps": 3
}
```

---

## 8. Abonnements (Premium)

### 8.1 Activation

```
POST /api/subscriptions/activate
```

```json
{
    "payment_method": "carte",
    "transaction_id": "txn_123456",
    "duration_months": 1
}

→ 201 { "plan": "premium", "status": "active", "expires_at": "..." }
```

Durées acceptées : 1, 3, 6, 12 mois.

### 8.2 Statut

```
GET /api/subscriptions/status

→ 200
{
    "is_premium": true,
    "status": "premium",
    "expires_at": "2027-07-01T...",
    "subscriptions": [...]
}
```

### Paywall

Les routes Premium retournent `402 Payment Required` avec :
```json
{
    "message": "Passez à l'offre Premium pour accéder à cette fonctionnalité.",
    "code": "PREMIUM_REQUIRED"
}
```

---

## 9. Rapports (PDF)

### Génération & Téléchargement

```
GET  /api/reports                      → Liste des rapports
POST /api/reports/generate/{type}      → Générer un rapport
GET  /api/reports/{id}/download        → Télécharger le PDF
```

Types disponibles : `initial` (gratuit), `qi` (premium), `complete` (premium).

### Contenu des rapports

| Rapport | Contenu |
|---|---|
| **initial** | Profil, parcours académique, test personnalité, test QI, top 5 matching |
| **qi** | Score QI détaillé, centile, interprétation, 4 sous-sections |
| **complete** | **Analyse SWOT** complète + synthèse profil + top 8 matching |

### Exemple de la matrice SWOT (rapport complet)

```
┌──────────────────────────────┬──────────────────────────────┐
│         FORCES (S)           │       FAIBLESSES (W)         │
├──────────────────────────────┼──────────────────────────────┤
│ • Budget déclaré: 15 000€    │ • Aucun objectif de carrière │
│ • Trait: Conscienciosité 82  │ • Test de QI non complété    │
│ • QI élevé: 115 (cent. 84%) │                              │
├──────────────────────────────┼──────────────────────────────┤
│       OPPORTUNITÉS (O)       │        MENACES (T)           │
├──────────────────────────────┼──────────────────────────────┤
│ • 15 métiers compatibles     │ • Budget peut être           │
│ • Objectif: Développeur      │   insuffisant pour certaines  │
│                              │   formations                  │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 10. Base de Données

### Liste des 25 tables

| Table | Description |
|---|---|
| `users` | Utilisateurs (auth, subscription) |
| `user_profiles` | Profils (âge, région, budget, cible) |
| `academic_records` | Parcours scolaire (diplômes, matières) |
| `personality_tests` | Tests de personnalité |
| `personality_trait_results` | Résultats par trait |
| `qi_tests` | Tests de QI |
| `qi_subsections` | 4 sous-sections par test |
| `qi_questions` | 40 questions préchargées |
| `qi_answers` | Réponses utilisateur |
| `dream_job_analyses` | Analyse métier de rêve |
| `market_data` | 21 métiers (salaires, tension, skills) |
| `subscriptions` | Abonnements premium |
| `reports` | Rapports générés (PDF) |
| `career_roadmaps` | Roadmaps de carrière |
| `skill_gaps` | Écarts de compétences |
| `cache`, `cache_locks` | Cache Laravel |
| `jobs`, `job_batches`, `failed_jobs` | Queue |
| `sessions` | Sessions |
| `personal_access_tokens` | Tokens Sanctum |
| `password_reset_tokens` | Reset password |
| `migrations` | Historique des migrations |

### Données préchargées (Seeders)

```
php artisan migrate --seed    → 21 métiers + 40 questions QI
```

---

## 11. Tests (27 tests passent)

```
php artisan test

  ✓ user can register
  ✓ user cannot register with duplicate email
  ✓ user can login
  ✓ user cannot login with wrong password
  ✓ authenticated user can access me
  ✓ unauthenticated user cannot access me
  ✓ user can logout
  ✓ user can create profile
  ✓ user can get profile
  ✓ user can update profile
  ✓ user can start personality test
  ✓ user can submit answers
  ✓ user cannot submit others test
  ✓ user can start qi test
  ✓ user can submit subsection
  ✓ user can analyze dream job
  ✓ user can get matching
  ✓ user can check coherence
  ✓ premium user can generate roadmap
  ✓ free user cannot generate roadmap
  ✓ user can activate subscription
  ✓ user can check subscription status
  ✓ user can generate initial report
  ✓ free user cannot generate qi report
  ✓ premium user can generate complete report
  ✓ user can list reports
  
  Tests:    27 passed (62 assertions)
```

---

## 12. Guide de Démarrage

```bash
# 1. Cloner et installer
cd orientation
composer install
cp .env.example .env
php artisan key:generate

# 2. Base de données
php artisan migrate --seed

# 3. Lancer le serveur
php artisan serve

# 4. Lancer les tests
php artisan test
```

### Endpoints par niveau d'accès

| Accès | Routes |
|---|---|
| **Public** | `POST /register`, `POST /login` |
| **Gratuit (auth)** | `/me`, `/profile`, `/academic-records`, `/personality-tests/*`, `/qi-tests/*`, `/dream-job/*`, `/career/match`, `/career/coherence`, `/reports`, `/reports/generate/initial` |
| **Premium** | `/career/roadmap*`, `/assistant/*`, `/reports/generate/qi`, `/reports/generate/complete`, `/reports/{id}/download` |
| **Abonnement** | `/subscriptions/activate`, `/subscriptions/status` |

---

## 13. Ressources

- **Base URL :** `http://localhost:8000/api`
- **Auth :** Bearer Token (Sanctum)
- **Format :** JSON (request et response)
- **Fichiers :** PDF pour les rapports (DomPDF)
- **BDD :** SQLite (`database/database.sqlite`)
