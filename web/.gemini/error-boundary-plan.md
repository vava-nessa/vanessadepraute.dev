# Plan d'action : Error Boundaries & Sécurité

## 🎯 Objectif
Ajouter des error boundaries et sécuriser toutes les opérations risquées dans la codebase selon les best practices du README.

## 📋 Composants à sécuriser

### 1. **Composants avec opérations risquées** (Priorité HAUTE)

#### ✅ Déjà sécurisés
- `ThemeContext.tsx` - utilise déjà `captureError` pour localStorage
- `GitHubCalendar.tsx` - utilise déjà `useErrorHandler`
- `ErrorBoundary.tsx` - composant d'error boundary existant

#### ⚠️ À sécuriser
- `CoderGirl.tsx` - utilise `console.error` au lieu de `captureError`
  - ResizeObserver
  - Calculs mathématiques complexes (matrix3d)
  - Manipulation DOM

- `ModelViewer.tsx` - probablement charge des modèles 3D (.glb)
  - Chargement de fichiers
  - WebGL/Three.js

- `Testimonials.tsx` - peut contenir des données dynamiques

- `TechStack.tsx` & `TechStackExtended.tsx` - affichage de données

- `TerminalInterests.tsx` & `TerminalDemo.tsx` - animations et contenu dynamique

### 2. **Pages** (Priorité MOYENNE)

- `HomePage.tsx` - page principale avec beaucoup de composants
- `BlogPage.tsx` - peut charger du contenu externe
- `NotFoundPage.tsx` - ✅ déjà mise à jour

### 3. **Composants UI critiques** (Priorité BASSE)

- Composants magicui (animations)
- Composants ui (primitives)

## 🔧 Actions à effectuer

### Phase 1 : Sécuriser les composants critiques

1. **CoderGirl.tsx**
   - Remplacer `console.error` par `captureError`
   - Ajouter `useErrorHandler` pour la gestion d'état
   - Wrapper dans un ErrorBoundary au niveau de HomePage

2. **ModelViewer.tsx**
   - Ajouter `useErrorHandler`
   - Gérer les erreurs de chargement de modèles 3D
   - Fallback UI en cas d'erreur

3. **Testimonials.tsx**
   - Vérifier s'il y a des opérations risquées
   - Ajouter error handling si nécessaire

4. **TechStack & TechStackExtended**
   - Vérifier le chargement d'images
   - Gérer les erreurs de rendu

### Phase 2 : Ajouter des Error Boundaries stratégiques

1. **HomePage.tsx**
   - Wrapper les sections principales dans des ErrorBoundary
   - Sections à wrapper :
     - CoderGirl section
     - TechStack section
     - Testimonials section
     - Terminal section

2. **Layout.tsx**
   - Vérifier si un ErrorBoundary global est nécessaire

### Phase 3 : Sécuriser les opérations risquées

1. **localStorage**
   - ✅ Déjà sécurisé dans ThemeContext
   - Vérifier s'il y a d'autres usages

2. **fetch/API calls**
   - ✅ GitHubCalendar déjà sécurisé
   - Vérifier s'il y a d'autres appels API

3. **JSON.parse**
   - Aucun usage trouvé pour l'instant

4. **DOM manipulation**
   - CoderGirl (ResizeObserver)
   - Autres composants avec refs

### Phase 4 : Tests et validation

1. Tester chaque composant modifié
2. Vérifier que les erreurs sont bien capturées par Sentry
3. S'assurer que les fallbacks UI sont appropriés
4. Run `pnpm build` pour vérifier qu'il n'y a pas d'erreurs TypeScript

## 📝 Checklist

- [x] Mettre à jour AGENTS.md, CLAUDE.md, GEMINI.md avec règle Git
- [x] Sécuriser CoderGirl.tsx (remplacé console.error par captureError + useErrorHandler)
- [x] Analyser et sécuriser ModelViewer.tsx (ajouté useErrorHandler, Suspense, try-catch partout)
- [x] Analyser Testimonials.tsx (OK - pas d'opérations risquées)
- [x] Analyser TechStack components (OK - pas d'opérations risquées)
- [x] Ajouter ErrorBoundaries dans HomePage (7 sections wrappées)
- [x] Vérifier Layout.tsx (OK - simple wrapper, ErrorBoundary global existe dans main.tsx)
- [x] Run pnpm build (✅ Build successful - 3 fois)
- [ ] Tester en local

## ✅ Tâches complétées

### 1. Configuration des agents (2026-01-09 22:46)
- ✅ AGENTS.md : Ajout section "Git Workflow"
- ✅ CLAUDE.md : Ajout règle "NEVER commit or push automatically"
- ✅ GEMINI.md : Ajout règle "NEVER commit or push automatically"

### 2. Sécurisation CoderGirl.tsx (2026-01-09 22:48)
- ✅ Ajout imports : `useErrorHandler`, `captureError`, `ErrorSeverity`
- ✅ Remplacement de `useState<Error>` par `useErrorHandler`
- ✅ Remplacement de tous les `console.error` par `captureError` (14 occurrences)
- ✅ Contexte ajouté pour chaque erreur (component, action)
- ✅ Build vérifié : ✅ Succès

### 3. Corrections de bugs (2026-01-09 22:44-22:45)
- ✅ GitHubCalendar : Ajout vérification `data.length === 0` pour éviter "Activity data must not be empty"
- ✅ NotFoundPage : Design personnalisé avec photo de profil et bulle de dialogue
- ✅ vercel.json : Configuration SPA routing pour fix 404 sur Vercel

### 4. Sécurisation ModelViewer.tsx (2026-01-09 22:50)
- ✅ Ajout imports : `useErrorHandler`, `captureError`, `ErrorSeverity`, `Suspense`
- ✅ Ajout `useErrorHandler` dans composant principal
- ✅ Ajout `useErrorHandler` dans composant Model
- ✅ Wrapper Model avec `<Suspense>` pour gérer le chargement asynchrone
- ✅ Try-catch dans `useLoader` pour capturer erreurs de chargement GLTF
- ✅ Try-catch dans setup animation mixer
- ✅ Try-catch dans `useFrame` pour update animations
- ✅ Try-catch dans toggle animation
- ✅ Try-catch dans handleClick
- ✅ Try-catch dans onCreated canvas
- ✅ Fallback UI en cas d'erreur de chargement
- ✅ Build vérifié : ✅ Succès

### 5. Analyse des composants simples (2026-01-09 22:54)
- ✅ Testimonials.tsx : Analysé - Pas d'opérations risquées (imports statiques + mapping)
- ✅ TechStack.tsx : Analysé - Pas d'opérations risquées (imports statiques + rendu simple)
- ✅ TechStackExtended.tsx : Analysé - Pas d'opérations risquées (données statiques + rendu)

### 6. Ajout ErrorBoundaries dans HomePage (2026-01-09 22:55)
- ✅ Import ErrorBoundary component
- ✅ Wrapper CoderGirl section
- ✅ Wrapper TechStack section
- ✅ Wrapper Testimonials section
- ✅ Wrapper LightRays section
- ✅ Wrapper GitHubCalendar section
- ✅ Wrapper TechStackExtended section
- ✅ Wrapper FAQ section
- ✅ Build vérifié : ✅ Succès

### 7. Vérification Layout et main.tsx (2026-01-09 22:57)
- ✅ Layout.tsx vérifié : Simple wrapper avec GradualBlur, pas d'opérations risquées
- ✅ main.tsx vérifié : ErrorBoundary global déjà en place wrappant toute l'application
- ✅ Architecture d'error handling complète confirmée

## 🚧 En cours / À faire

### Tâches restantes
- [ ] Vérifier Layout.tsx (probablement OK, déjà wrapper global dans main.tsx)
- [ ] Tester en local pour vérifier que tout fonctionne
- [ ] Tester les error boundaries en déclenchant des erreurs volontaires
- [ ] Vérifier que les erreurs sont bien capturées dans Sentry

## 🎨 Pattern à suivre

```tsx
// Pour les composants avec opérations risquées
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { captureError } from "@/utils/errorHandling";

function MyComponent() {
  const { handleError, isError, getErrorMessage } = useErrorHandler("MyComponent");

  useEffect(() => {
    try {
      // Opération risquée
    } catch (error) {
      handleError(error, { action: "specific_action" });
    }
  }, [handleError]);

  if (isError) {
    return <div>Error: {getErrorMessage()}</div>;
  }

  return // ... normal render
}
```

```tsx
// Pour wrapper des sections dans HomePage
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";

<ErrorBoundary>
  <CoderGirl />
</ErrorBoundary>
```
