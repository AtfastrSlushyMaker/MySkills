[⚠️ Suspicious Content] #### ÉCOLE SUPÉRIEURE PRIVÉE D'INGÉNIERIE ET DE TECHNOLOGIE

#### ESPRIT

## CAHIER DES CHARGES

## Conception et Développement d'un Module de Gestion de la

## Formation

# MySkills

**Réalisé par** Malek Bsaissa
**Encadrant entreprise** Hajer Korbi
**Entreprise d'accueil** SMART SKILLS
**Adresse entreprise** Bâtiment 23 - 1er Étage - Bureau 11 Bis
Pôle Technologique El Ghazela, 2083
Ariana
**Période du stage** Du 26 Juin 2025 au 6 Août 2025
**Durée** 6 semaines
**Année universitaire** 2024 – 2025


## TABLE DES MATIÈRES

#### 1. CONTEXTE DU PROJET

1.1 Présentation de l'entreprise

1.2 Problématique

1.3 Solution proposée

2. **OBJECTIFS DU PROJET**

2.1 Objectif principal

2.2 Objectifs spécifiques

3. **ANALYSE DES BESOINS**

3.1 Besoins fonctionnels

4. **ÉTUDE DE L'EXISTANT**

4.1 Solutions concurrentes

4.2 Analyse comparative

5. **UTILISATEURS CIBLES**
6. **EXIGENCES FONCTIONNELLES**

6.1 Fonctions Admin

6.2 Fonction Coordinator

6. 3 Fonctions Trainer
6. 4 Fonctions Trainee
7. **EXIGENCES NON FONCTIONNELLES**
8. **ARCHITECTURE TECHNIQUE**

8.1 Architecture générale

#### 9. MODÈLE DE DONNÉES

```
9.1 Entités principales
9.2 Diagramme de Class
```
10. **INTERFACES UTILISATEUR**
10.1 Maquettes conceptuelles
10.2 Charte graphique
11. **SÉCURITÉ ET CONFORMITÉ**
11.1 Mesures de sécurité
12. **CONTRAINTES ET LIMITES**
13. **PLANNING PRÉVISIONNEL**
14. **CRITÈRES D'ACCEPTATION**
15. **LIVRABLES ATTENDUS
ANNEXES**


### 1. CONTEXTE DU PROJET

**1.1 Présentation de l'entreprise**

SMART SKILLS est une entreprise tunisienne spécialisée dans le développement des
compétences professionnelles et la formation continue. Située au cœur du Pôle

Technologique El Ghazela à Ariana,

```
Secteur d'activité Formation professionnelle et
développement des compétences
Localisation Bâtiment 23 - 1er Étage - Bureau 11 Bis
Pôle Technologique El Ghazela, 2083 Ariana
Spécialisations • Technologies de l'information
```
- Management et leadership
- Compétences transversales
**Mission** Accompagner les entreprises et les
individus dans leur montée en
compétences
**Vision** Devenir la référence en formation
professionnelle en Tunisie

**1.2 Problématique**

Actuellement, on fait face à plusieurs défis dans la gestion de ses programmes de

formation :

- **Gestion manuelle** : Les processus d'inscription et de planification sont largement
manuels
- **Traçabilité limitée** : Difficultés pour suivre la participation et les résultats des

formations

- **Communication fragmentée** : Échanges dispersés entre formateurs, apprenants et

administration

- **Reporting incomplet** : Manque d'outils pour analyser l'efficacité des formations
- **Scalabilité réduite** : Les processus actuels ne permettent pas une montée en charge

efficace

**1.3 Solution proposée**


```
Pour répondre à ces défis, le développement de la plateforme MySkills vise à digitaliser
et centraliser l'ensemble des processus de gestion de formation. Cette solution web
permettra d'automatiser les tâches répétitives, d'améliorer la traçabilité et d'optimiser
l'expérience utilisateur pour tous les acteurs impliqués.
```
```
Automatisation Processus d'inscription
Centralisation Toutes les informations
regroupées en un lieu
unique
Traçabilité Suivi complet des parcours
de formation
Scalabilité Architecture conçue pour
supporter la croissance
Analytics Tableaux de bord et
rapports automatisés
```
### 2. OBJECTIFS DU PROJET

```
Ce projet vise à atteindre les objectifs suivants :
```
```
2.1 Objectif principal
```
```
Concevoir et développer une application web de gestion des formations permettant à
SMART SKILLS d'automatiser et d'optimiser l'ensemble du processus de formation,
depuis la création des cours jusqu'au suivi post-formation.
```
```
2.2 Objectifs spécifiques
```
**Gestion des contenus** • Créer et organiser des cours par catégories

- Planifier des sessions de formation
- Assigner des formateurs aux sessions
**Gestion des utilisateurs** • Gérer les inscriptions
- Suivre la participation des apprenants
- Gérer les rôles et permissions
**Suivi et évaluation** • Enregistrer la présence aux sessions
- Collecter les retours des participants(si implémenté)
- Générer des rapports de suivi

### 3. ANALYSE DES BESOINS

```
3.1 Besoins fonctionnels
```

L'analyse des besoins a permis d'identifier les fonctionnalités essentielles que doit offrir

la plateforme **MySkills** pour répondre aux attentes des différents utilisateurs.

```
Authentification Connexion sécurisée basée
sur les rôles
Gestion des cours CRUD complet des cours
de formation
Planification Création et gestion des
sessions
Inscriptions Système d'inscription
Présence Suivi de l'assiduité des
participants
Feedback Collecte des retours post-
formation
Reporting Génération de rapports
statistiques
```
### 4. ÉTUDE DE L'EXISTANT

**4.1 Solutions concurrentes**

Une analyse des solutions existantes sur le marché révèle plusieurs catégories d'outils

de gestion de formation :

```
Moodle LMS Open Source • Gratuit et
customisable
```
- Communauté
active
- Fonctionnalités
étendues
    - Complexité
    élevée
    - Interface datée
    - Courbe
    d'apprentissage

```
Canvas LMS Commercial • Interface
moderne
```
- Mobile-friendly
- Intégrations
tierces
    - Coût élevé
    - Orienté
    académique
    -
    Surfonctionnalités
**TalentLMS** Solution Cloud • Simple à utiliser
- Déploiement
rapide
- Support multi-
tenant
- Personnalisation
limitée
- Dépendance
cloud
- Coûts récurrents
**Solutions internes** Développement sur
mesure
- Adaptées aux
besoins
- Coût de
développement


- Contrôle total
- Intégration SI
    - Maintenance
    complexe
    - Risques
    techniques

**4.2 Analyse comparative**

Le choix de développer une solution sur mesure ( **MySkills** ) se justifie par :

- **Contrôle total** sur les fonctionnalités et l'évolution de la plateforme
- **Coût maîtrisé** à long terme (pas d'abonnements récurrents)
- **Simplicité d'usage** avec une interface épurée et ciblée
- **Potentiel commercial** pour proposer la solution à d'autres centres de formation

### 5. UTILISATEURS CIBLES

Le système **MySkills** est conçu pour servir trois types d'utilisateurs principaux, chacun

ayant des besoins et des niveaux d'accès spécifiques :

```
Admin Admin • Gestion globale de la plateforme
```
- Configuration système
- Gestion des utilisateurs et rôles
- Supervision générale
**Coordiantor** Coordinateur
pédagogique
- Création et gestion des cours
- Planification des sessions
- Attribution des formateurs
- Gestion des inscriptions
**Trainer** Expert métier /
Consultant
- Animation des sessions
- Gestion de la présence
- Consultation des plannings
- Accès aux feedbacks
**Trainee** Employé / Stagiaire • Consultation du catalogue
- Inscription aux sessions
- Participation aux formations
- Évaluation des sessions

### 6. EXIGENCES FONCTIONNELLES

**6.1 Fonctions administrateur**


L'administrateur dispose des privilèges les plus étendus :

- Gestion des utilisateurs (Création, modification, suppression des comptes
utilisateurs)
- Attribution des rôles : Assignation des rôles (Admin, Coordinator, Trainer,
Trainee)
- Consultation des statistiques de participation et de satisfaction
- Configuration générale de la plateforme

**6.2 Fonctions Coordinateur**

Le coordinateur gère l'aspect pédagogique et organisationnel :

- Gestion des cours de formation (Création, modification, suppression des cours)
- Gestion des inscriptions (Validation ou refus des demandes d'inscription ,Gestion
    des listes d'attente)
- Suivi pédagogique (Consultation des statistiques de participation, Génération de
    rapports pédagogiques)
**6. 3 Fonctions Trainer**

Le Trainer à l’accès aux fonctionnalités liées à ses sessions :

- Consultation du planning personnel des sessions assignées
- Accès aux détails des sessions (participants inscrits, matériel requis)
- Gestion de la présence des participants
- Consultation des profils des apprenants inscrits
- Accès aux retours et évaluations de ses sessions(si implémenté)
**6. 4 Fonctions Trainee**

L'apprenant peut interagir avec le système pour ses besoins de formation :

- Navigation dans le catalogue des formations disponibles
- Filtrage des sessions par catégorie, date, formateur
- Inscription aux sessions ouvertes


- Consultation du statut des inscriptions (en attente, confirmée, refusée)
- Accès à l'historique personnel de formation
- Évaluation post-formation (note et commentaires)
- Consultation des certificats ou attestations (si implémenté)

### 7. EXIGENCES NON FONCTIONNELLES

```
Architecture Application web 3-tiers Séparation des
préoccupations,
maintenabilité
Backend Laravel 1 1 (PHP 8.1+) Framework robuste,
écosystème riche, sécurité
Frontend React.js 18.3 Interface réactive,
composants réutilisables
Base de données MySQL 8.0 Performance, fiabilité,
support étendu
Authentification middleware Laravel Sécurité, gestion des
sessions
Styling Tailwind Design moderne,
responsive, accessibilité
Versioning Git avec GitHub Collaboration, historique,
sauvegarde
```
### 8. ARCHITECTURE TECHNIQUE

**8.1 Architecture générale**

L'architecture retenue suit le pattern MVC (Model-View-Controller) avec une séparation

claire entre le backend API et le frontend SPA (Single Page Application) :

- **Frontend (Client)** : Interface React.js communiquant avec l'API via HTTP/AJAX
- **Backend (Serveur)** : API RESTful Laravel exposant les endpoints métier
- **Base de données** : MySQL stockant les données relationnelles
- **Authentification** : Middleware pour la sécurisation des routes

### 9. MODÈLE DE DONNÉES


```
9.1 Entités principales
```
```
Le modèle de données s'articule autour de 7 entités principales liées par des relations
bien définies :
```
**User** id, name, email, password,
role, created_at

Utilisateurs du système (admin,
formateur, apprenant)
**Category** id, name, description,
created_at

Catégories de formations pour
l'organisation
**TrainingCourse** id, title, description,
category_id

Cours de formation avec contenu
pédagogique
**TrainingSession** id, course_id,coordinator_id,
trainer_id, date, start_time,
end_time, location,
max_participants

```
Sessions spécifiques d'un cours
avec planning
```
**Registration** id, user_id, session_id, status,
created_at

Inscriptions des apprenants aux
sessions
**Attendance** id, registration_id, present,
marked_at

Suivi de présence pour chaque
inscription
**Feedback** id, registration_id, rating,
comment, created_at

```
Évaluations post-formation des
participants
```
```
9.2 Diagramme de Class
```

### 10. INTERFACES UTILISATEUR

**10.1 Maquettes conceptuelles**

Les interfaces utilisateur sont conçues selon les principes de l'UX/UI moderne avec une
approche mobile-first et une navigation intuitive :

```
Dashboard Admin Admin • Vue d'ensemble des
statistiques
```
- Accès rapide aux
fonctions principales
- Graphiques de
performance
**Gestion des cours** Admin • Liste des cours avec
filtres
- Formulaires de
création/édition
- Assignation des
formateurs
**Planning Trainer** Trainer • Calendrier des sessions
assignées
- Détails des sessions
- Gestion de la présence
**Catalogue formations** Trainee • Navigation par
catégories
- Recherche et filtres
- Inscription en un clic
**Mon parcours** Trainee • Historique des
formations
- Sessions à venir
- Évaluations à compléter

**10.2 Charte graphique**

```
Palette de couleurs • Primaire : Bleu professionnel (#1E40AF)
```
- Secondaire : Gris moderne (#6B7280)
- Accent : Vert succès (#10B981)
**Typographie** • Titres : Inter/Roboto Bold
- Corps : Inter/Roboto Regular
- Taille base : 16px
**Composants** • Boutons avec coins arrondis
- Cards avec ombres subtiles


- Icônes Heroicons/Lucide

### 11. SÉCURITÉ ET CONFORMITÉ

**11.1 Mesures de sécurité**

- **Authentification forte** : Mots de passe hashés avec **bcrypt** , sessions sécurisées
- **Autorisation basée sur les rôles** : Contrôle d'accès granulaire selon le profil
- **Validation des données** : Validation côté serveur pour toutes les entrées utilisateur

### 12. CONTRAINTES ET LIMITES

```
Temporelle Développement en 6
semaines
```
```
Limitation au MVP,
fonctionnalités essentielles
uniquement
Ressources Développeur unique Architecture simple,
documentation limitée
Sécurité Validation côté serveur
obligatoire
```
```
Contrôles stricts sur toutes
les entrées
Déploiement Environnement de test
uniquement
```
```
Pas de mise en production
immédiate
```
### 13. PLANNING PRÉVISIONNEL

```
Analyse &
Conception
```
```
1 semaine • Analyse des
besoins
```
- Conception UML
- Architecture
technique
    - Cahier des
    charges
    - Diagrammes UML

```
Développement
Backend
```
```
2 semaines • Migrations et
modèles
```
- API endpoints
- Authentification
    - API fonctionnelle

```
Développement
Frontend
```
```
2 semaines • Composants
React
```
- Intégration API
- Interface
utilisateur
    - Application web
    - Interface
    responsive

```
Tests & Intégration 0.5 semaine • Tests
d'intégration
```
- Correction des
    - Application
    testée
    - Documentation


```
bugs
```
- Optimisations

```
utilisateur
```
```
Documentation 0.5 semaine • Rédaction
rapport
```
- Documentation
technique
    - Rapport de stage
    - Guide
    d'installation

### 14. CRITÈRES D'ACCEPTATION

Le projet sera considéré comme réussi si les critères suivants sont remplis :

- **Fonctionnalité** : Toutes les fonctions MVP sont opérationnelles
- **Sécurité** : Authentification fonctionnelle, données protégées
- **Utilisabilité** : Interface intuitive et responsive
- **Code** : Structuré, commenté et versionné sur GitHub
- **Documentation** : Rapport complet et guide d'installation fournis

### 15. LIVRABLES ATTENDUS

```
Application
MySkills
```
```
Web App Plateforme
fonctionnelle
complète
```
```
6 août 2025
```
```
Code source Dépôt GitHub Code structuré et
documenté
```
```
6 août 2025
```
```
Base de données Script SQL Structure et
données de test
```
```
6 août 2025
```
```
Documentation
technique
```
```
PDF Guide d'installation
et d'utilisation
```
```
6 août 2025
```
```
Diagrammes UML Images/PDF Conception
détaillée du
système
```
```
10 juillet 2025
```
```
Rapport de stage PDF Analyse complète
du projet
```
```
6 août 2025
```

### ANNEXES

**Annexe A : Glossaire**

**API** : Application Programming Interface - Interface de programmation

**CRUD** : Create, Read, Update, Delete - Opérations de base sur les données

**MVP** : Minimum Viable Product - Produit minimum viable

**SPA** : Single Page Application - Application web monopage

**UML** : Unified Modeling Language - Langage de modélisation unifié

**Annexe B : Références technologiques**

**- Laravel Documentation** : https://laravel.com/docs
- **React.js Documentation** : https://react.dev
- **Tailwind CSS** : https://tailwindcss.com
- **MySQL Documentation** : https://dev.mysql.com/doc
- **Git Documentation** : https://git-scm.com/doc


