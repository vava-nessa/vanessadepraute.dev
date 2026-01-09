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
- [ ] Sécuriser CoderGirl.tsx
- [ ] Analyser et sécuriser ModelViewer.tsx
- [ ] Analyser Testimonials.tsx
- [ ] Analyser TechStack components
- [ ] Ajouter ErrorBoundaries dans HomePage
- [ ] Vérifier Layout.tsx
- [ ] Run pnpm build
- [ ] Tester en local

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
