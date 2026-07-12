# Migration authentification username / password

Le site est maintenant **entièrement privé**. Pour déployer cette version, 3 étapes :

## 1. Migrer la base D1

Ouvrir le [dashboard Cloudflare](https://dash.cloudflare.com/) → D1 → `japan2026-db` → onglet **Console**.

Coller et exécuter ces 3 commandes une par une (elles ajoutent 2 colonnes à `editors`) :

```sql
ALTER TABLE editors ADD COLUMN username TEXT;
```

```sql
ALTER TABLE editors ADD COLUMN password_hash TEXT;
```

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_editors_username ON editors(username);
```

Note : si une des commandes échoue avec `duplicate column name`, c'est OK — ça veut juste dire qu'elle a déjà été passée.

## 2. Ajouter la variable Worker `ADMIN_USERNAME`

Cloudflare Workers → `japan2026` → **Settings** → **Variables and Secrets** → **Add variable** :

- Type : Text
- Name : `ADMIN_USERNAME`
- Value : `david`

(Le mot de passe admin reste `ADMIN_KEY` qui est déjà configuré comme secret.)

## 3. Push et déployer

```bash
cd ~/Claude/Projects/Perso/Japan2026/Japan2026-git
set SRC = ..
cp $SRC/src/worker.js src/
cp $SRC/schema.sql .
cp $SRC/api-client.js .
cp $SRC/login.html .
cp $SRC/admin.html .
cp $SRC/index.html .
cp $SRC/journal.html .
cp $SRC/budget.html .
cp $SRC/voitures.html .
cp $SRC/checklist.html .
cp $SRC/carte-photos.html .

git add .
git commit -m "feat: auth username+password + gating global du site"
git push origin main
```

## 4. Premier login (après déploiement)

- Ouvre `japan2026.drlaboole.workers.dev` — tu dois être redirigé vers `/login.html`
- Identifiant : `david`
- Mot de passe : la valeur de ton `ADMIN_KEY` (secret Cloudflare)
- Une fois connecté, va sur `/admin.html` et crée les comptes des 7 autres voyageurs

## Comment ça marche maintenant

- **Toutes les pages HTML** exigent une session (cookie `japan2026_session`, 30 jours).
- Un visiteur non authentifié est redirigé vers `/login.html?next=<page>`.
- Les assets statiques (CSS, JS, images, fonts, favicon) restent accessibles pour que la page de login s'affiche.
- **Les photos R2** (`/api/photo/*`) sont désormais elles aussi privées.
- **`/admin.html`** exige une session **admin** (rôle admin uniquement, pas les éditeurs).
- **Mots de passe stockés** avec PBKDF2-SHA256, 100 000 itérations + salt aléatoire de 16 octets. Impossible de les récupérer, seulement de les réinitialiser depuis la console admin.
- Le magic link `/login.html?key=xxx` reste supporté en fallback (utile pour dépanner si un utilisateur oublie son mot de passe — tu peux régénérer sa clé depuis l'admin et lui envoyer un lien magique).
