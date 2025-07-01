# Guide d'Installation et d'Utilisation - STA Travel Manager

## Description
STA Travel Manager est une application Electron complète pour la gestion d'une agence de voyage. Elle comprend :
- Interface de connexion moderne avec authentification
- Tableau de bord avec statistiques en temps réel
- Gestion complète des clients (ajout, modification, suppression)
- Système de facturation avec génération et impression de factures

## Prérequis
- Node.js (version 14 ou supérieure)
- npm (généralement inclus avec Node.js)

## Installation

### Option 1 : Exécution depuis les sources
1. Extraire le dossier `sana-travel-agency`
2. Ouvrir un terminal dans le dossier
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Lancer l'application :
   ```bash
   npm start
   ```

### Option 2 : Exécutable packagé
1. Naviguer vers le dossier `out/sana-travel-agency-linux-x64/`
2. Exécuter le fichier `sana-travel-agency`

## Utilisation

### Connexion
- **Administrateur** : admin / admin123
- **Agent Commercial 1** : agent1 / agent123
- **Agent Commercial 2** : agent2 / agent123
- **Comptable** : comptable / compta123

### Fonctionnalités principales

#### Tableau de bord
- Vue d'ensemble des statistiques (clients, voyages, chiffre d'affaires)
- Accès rapide aux fonctions principales
- Navigation intuitive

#### Gestion des clients
- Ajouter de nouveaux clients avec informations complètes
- Modifier les informations existantes
- Supprimer des clients
- Recherche et filtrage

#### Facturation
- Génération de factures professionnelles
- Calcul automatique des montants (HT, TVA, TTC)
- Aperçu avant impression
- Impression directe

## Structure des données
Les données sont stockées localement dans le navigateur (localStorage) :
- Clients : informations personnelles et de contact
- Factures : détails des voyages et montants
- Statistiques : données du tableau de bord

## Support technique
Pour toute question ou problème, contactez l'équipe de développement.

## Version
Version 1.0.0 - Application complète et fonctionnelle
# Gestion Voyage Stage - Sana Travel Agency

## Description

Projet réalisé lors de mon stage chez **Sana Travel Agency**.  
Application complète développée avec **Electron.js**, **HTML**, **CSS** et **JavaScript** pour gérer une agence de voyage.

---

## Fonctionnalités principales

- **Interface de connexion moderne**  
  Authentification avec sélection d'utilisateur, avatars, mot de passe et logo intégré.

- **Tableau de bord professionnel**  
  Statistiques clés, voyages récents, actions rapides et navigation intuitive.

- **Gestion complète des clients**  
  Ajout, modification, suppression, recherche en temps réel, avec persistance des données.

- **Système de facturation avancé**  
  Génération et impression de factures avec calcul automatique (HT, TVA, TTC) et numérotation automatique.

- **Auteur**  
Nour Chamakh
Stage chez Sana Travel Agency

- **License** 
Ce projet est open source et disponible sous licence MIT.

N’hésitez pas à me contacter pour toute question ou contribution !

