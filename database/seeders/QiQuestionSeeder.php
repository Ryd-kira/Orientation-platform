<?php

namespace Database\Seeders;

use App\Models\QiQuestion;
use Illuminate\Database\Seeder;

class QiQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            // Logical Matrix
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Complétez la série : 2, 6, 18, 54, ?', 'options' => ['108', '162', '72', '90'], 'correct_answer' => '162', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Quel nombre complète la suite ? 1, 4, 9, 16, 25, ?', 'options' => ['30', '36', '49', '35'], 'correct_answer' => '36', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Si TOUTES LES ROSES SONT DES FLEURS et TOUTES LES FLEURS SONT BELLES, alors :', 'options' => ['Toutes les roses sont belles', 'Toutes les belles choses sont des roses', 'Certaines fleurs ne sont pas belles', 'Aucune rose nest belle'], 'correct_answer' => 'Toutes les roses sont belles', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Complétez : 3, 5, 8, 13, 21, ?', 'options' => ['34', '30', '26', '29'], 'correct_answer' => '34', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Trouvez lintrus : 12, 25, 37, 49, 51', 'options' => ['12', '25', '37', '49'], 'correct_answer' => '12', 'difficulty' => 'hard', 'points' => 3],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Quel est le prochain chiffre ? 1, 1, 2, 3, 5, 8, ?', 'options' => ['10', '12', '13', '15'], 'correct_answer' => '13', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Complétez : 100, 96, 91, 85, ?', 'options' => ['80', '78', '76', '74'], 'correct_answer' => '78', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Si A = 1, B = 2, C = 3, alors quel est le total de D + F ?', 'options' => ['8', '9', '10', '11'], 'correct_answer' => '10', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Pierre est plus grand que Paul, Paul est plus petit que Jacques. Qui est le plus petit ?', 'options' => ['Pierre', 'Paul', 'Jacques', 'Impossible à déterminer'], 'correct_answer' => 'Paul', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'logical_matrix', 'question_text' => 'Trouvez la valeur de ? : 2, 10, 12, 16, 17, 18, ?', 'options' => ['19', '22', '20', '25'], 'correct_answer' => '19', 'difficulty' => 'hard', 'points' => 3],

            // Numerical Series
            ['subsection_type' => 'numerical_series', 'question_text' => 'Résolvez : 5 + 3 × 2 = ?', 'options' => ['11', '16', '10', '13'], 'correct_answer' => '11', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Quel est le 10e nombre premier ?', 'options' => ['23', '29', '31', '37'], 'correct_answer' => '29', 'difficulty' => 'hard', 'points' => 3],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Combien font 15% de 200 ?', 'options' => ['15', '20', '30', '25'], 'correct_answer' => '30', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Complétez : 0.5, 1.5, 4.5, 13.5, ?', 'options' => ['27', '40.5', '36', '54'], 'correct_answer' => '40.5', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Si x/4 = 20, alors x/5 = ?', 'options' => ['16', '15', '20', '10'], 'correct_answer' => '16', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'numerical_series', 'question_text' => '(5² - 3²) / 2 = ?', 'options' => ['6', '8', '10', '12'], 'correct_answer' => '8', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Combien de secondes dans 3 heures ?', 'options' => ['7200', '10800', '5400', '3600'], 'correct_answer' => '10800', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Un stylo coûte 2€. Si j\'achète 15 stylos avec un billet de 50€, combien reste-t-il ?', 'options' => ['20€', '15€', '30€', '10€'], 'correct_answer' => '20€', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'numerical_series', 'question_text' => 'Quel nombre est divisible par 3 et par 4 ?', 'options' => ['16', '18', '24', '22'], 'correct_answer' => '24', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'numerical_series', 'question_text' => 'La moyenne de 4 nombres est 12. Si on retire un nombre, la moyenne devient 10. Quel nombre a été retiré ?', 'options' => ['16', '18', '14', '20'], 'correct_answer' => '18', 'difficulty' => 'hard', 'points' => 3],

            // Verbal Analogies
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Chaud est à Froid comme Lumière est à ?', 'options' => ['Lampe', 'Obscurité', 'Soleil', 'Jour'], 'correct_answer' => 'Obscurité', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Oiseau est à Voler comme Poisson est à ?', 'options' => ['Eau', 'Nager', 'Manger', 'Onduler'], 'correct_answer' => 'Nager', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Doigt est à Main comme Orteil est à ?', 'options' => ['Cheville', 'Pied', 'Jambe', 'Genou'], 'correct_answer' => 'Pied', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Médecin est à Hôpital comme Professeur est à ?', 'options' => ['École', 'Université', 'Cours', 'Élève'], 'correct_answer' => 'École', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Cercle est à Rond comme Carré est à ?', 'options' => ['Angle', 'Rectangle', 'Cube', 'Triangle'], 'correct_answer' => 'Rectangle', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Larmes est à Tristesse comme Rire est à ?', 'options' => ['Joie', 'Sourire', 'Bonheur', 'Amusement'], 'correct_answer' => 'Joie', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Forêt est à Arbres comme Bibliothèque est à ?', 'options' => ['Étagères', 'Livres', 'Lecteurs', 'Salle'], 'correct_answer' => 'Livres', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Heure est à Temps comme Mètre est à ?', 'options' => ['Poids', 'Distance', 'Volume', 'Mesure'], 'correct_answer' => 'Distance', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Grammaire est à Langue comme Règles est à ?', 'options' => ['Jeu', 'Loi', 'Sport', 'Conduite'], 'correct_answer' => 'Jeu', 'difficulty' => 'hard', 'points' => 3],
            ['subsection_type' => 'verbal_analogies', 'question_text' => 'Pinceau est à Peintre comme Scalpel est à ?', 'options' => ['Médecin', 'Chirurgien', 'Artiste', 'Boucher'], 'correct_answer' => 'Chirurgien', 'difficulty' => 'medium', 'points' => 2],

            // Spatial Rotation
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Un cube a combien de faces ?', 'options' => ['4', '6', '8', '12'], 'correct_answer' => '6', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Combien darêtes possède un tétraèdre ?', 'options' => ['4', '6', '8', '12'], 'correct_answer' => '6', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Une sphère a-t-elle des angles ?', 'options' => ['Oui', 'Non', 'Parfois', 'Cela dépend'], 'correct_answer' => 'Non', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Quelle est la somme des angles dun triangle ?', 'options' => ['90°', '180°', '270°', '360°'], 'correct_answer' => '180°', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Combien de sommets possède un cube ?', 'options' => ['4', '6', '8', '12'], 'correct_answer' => '8', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Si on fait tourner un carré de 90°, on obtient :', 'options' => ['Un rectangle', 'Un losange', 'Un carré', 'Un triangle'], 'correct_answer' => 'Un carré', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Un prisme rectangulaire a combien de faces ?', 'options' => ['4', '5', '6', '8'], 'correct_answer' => '6', 'difficulty' => 'medium', 'points' => 2],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'La symétrie axiale dun triangle isocèle donne :', 'options' => ['Un triangle isocèle', 'Un triangle équilatéral', 'Un rectangle', 'Un losange'], 'correct_answer' => 'Un triangle isocèle', 'difficulty' => 'hard', 'points' => 3],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Combien de dimensions possède un plan ?', 'options' => ['1', '2', '3', '4'], 'correct_answer' => '2', 'difficulty' => 'easy', 'points' => 1],
            ['subsection_type' => 'spatial_rotation', 'question_text' => 'Un cylindre a combien de faces courbes ?', 'options' => ['0', '1', '2', '3'], 'correct_answer' => '1', 'difficulty' => 'medium', 'points' => 2],
        ];

        foreach ($questions as $q) {
            QiQuestion::create($q);
        }

        $this->command->info('40 questions de QI créées avec succès.');
    }
}
