**Plateforme de Gestion de Clients & Facturation**

**Projet académique SUP'COM ® 2025-2026**

Application web complète permettant de gérer les clients, les factures, les paiements et les documents associés.
Permet la génération de PDF, l’envoi d’e-mails automatiques, ainsi que la consultation des statistiques depuis un Dashboard interactif.

**Fonctionnalités principales**
Création, modification et suppression de factures

Gestion des clients

Ajout de paiements avec calcul automatique de statut

Téléchargement PDF + envoi par mail (option intégrée)

Tableau de bord statistique (factures payées, impayées, virements, total revenus…)

Notifications PDF & Email

Interface responsive & moderne

**Technologies utilisées**

**Frontend**: Next.js, TypeScript, TailwindCSS, Chart.js

**Backend**: Node.js, JSON

**Sécurité**: JWT, Bcrypt

**Documents**: PDFKit

**Mail**: Nodemailer

**Icônes/UI**: Lucide React

**Prérequis**

Avant installation, vérifier que vous avez :

**Node.js v18+**

**npm ou yarn**

## Installation Backend JSON::

npm install

### Exécution des scripts de test

node test-invoice-system.js
node test-payment-script.js
node test-syntax.js

### Les fichiers JSON agissent comme base de données :

test-invoice.json
test-payment.json
test-cancel.json

## Architecture

```
facturaa/W/
├── app/                        # Pages Next.js (Dashboard, Invoices, Clients, Login...)
├── components/                 # Composants UI réutilisables
├── lib/                        # Utils, hooks, stores, API fetch
├── tests/ (ou racine selon ton structure)
│   ├── test-invoice-system.js  # Script simulation factures
│   ├── test-payment-script.js  # Simulation paiements
│   ├── test-syntax.js          # Vérification syntaxique
│   ├── test-invoice.json       # Données factures
│   ├── test-payment.json       # Données paiements
│   └── test-cancel.json        # Données d'annulation
├── public/                     # Images / assets
├── .env.local                  # Variables frontend (optionnel)
└── README.md

```

### Améliorations futures possibles:

Ajout d’un vrai backend (Express + DB)

Authentification (JWT + rôles)

Génération PDF & Envoi email

Dashboard avancé avec graphes de paiements

Export Excel

<<<<<<< HEAD
Passage à PostgreSQL/MongoDB/Prisma
=======
Passage à PostgreSQL/MongoDB/Prisma
>>>>>>> 10c201663e0ffa12d9523cf757c8e4cbb5626447
