import { useCallback, useState } from 'react';
import AuthModal from '@/components/AuthModal';
import BookshelfScreen from '@/components/BookshelfScreen';
import DetailsScreen from '@/components/DetailsScreen';
import StoryLoadingScreen from '@/components/StoryLoadingScreen';
import StoryPreviewScreen from '@/components/StoryPreviewScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import { getPlanName } from '@/data/pricingPlans';
import { useAuth, type AuthUser } from '@/hooks/useAuth';
import { useBookshelf } from '@/hooks/useBookshelf';
import type { PreviewSource, Screen, StoryBook, StoryProfile, StoryRequest } from '@/types';

type Direction = 'forward' | 'back';
type AuthIntent = 'bookshelf' | 'generate' | 'checkout';

const SLIDE_CLASS: Record<Direction, string> = {
  forward: 'animate-slide-in-right',
  back: 'animate-slide-in-left',
};

const EMPTY_PROFILE: StoryProfile = { name: '', age: null, gender: null, themeId: null };

function App() {
  const auth = useAuth();
  const bookshelf = useBookshelf();

  const [screen, setScreen] = useState<Screen>('welcome');
  const [direction, setDirection] = useState<Direction>('forward');
  const [profile, setProfile] = useState<StoryProfile>(EMPTY_PROFILE);
  const [previewSource, setPreviewSource] = useState<PreviewSource | null>(null);
  const [authIntent, setAuthIntent] = useState<AuthIntent | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const navigate = (next: Screen, nextDirection: Direction) => {
    setDirection(nextDirection);
    setScreen(next);
  };

  const updateProfile = (patch: Partial<StoryProfile>) => {
    setProfile((previous) => ({ ...previous, ...patch }));
  };

  const handleLoadingComplete = useCallback(() => {
    setDirection('forward');
    setScreen('preview');
  }, []);

  const openSavedBook = (book: StoryBook) => {
    setPreviewSource({ kind: 'saved', book });
    navigate('preview', 'forward');
  };

  const handleAuthSuccess = useCallback(
    (signedInUser: AuthUser | null) => {
      setAuthIntent(null);
      const activeUser = signedInUser ?? auth.user;
      if (activeUser) {
        bookshelf.migrateToUser(activeUser.id);
      }
      const action = pendingAction;
      setPendingAction(null);
      if (action) action();
    },
    [auth.user, bookshelf, pendingAction],
  );

  const requireAuth = (intent: AuthIntent, action: () => void) => {
    if (auth.user) {
      action();
      return;
    }
    setAuthIntent(intent);
    setPendingAction(() => action);
  };

  const handleOpenBookshelf = () => {
    requireAuth('bookshelf', () => navigate('bookshelf', 'forward'));
  };

  const handleCreateAnother = () => {
    setProfile(EMPTY_PROFILE);
    setPreviewSource(null);
    navigate('details', 'back');
  };

  const handleGenerate = (request: StoryRequest) => {
    requireAuth('generate', () => {
      setPreviewSource({ kind: 'new', request });
      navigate('loading', 'forward');
    });
  };

  const handleCheckout = (action: () => void) => {
    requireAuth('checkout', action);
  };

  const handleSignOut = useCallback(async () => {
    await auth.signOut();
    bookshelf.resetForLogout();
    navigate('welcome', 'back');
  }, [auth, bookshelf]);

  const planLabel = getPlanName(bookshelf.profile.currentSubscription) ?? 'Free preview';

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-cream">
      <div key={screen} className={`flex flex-1 flex-col ${SLIDE_CLASS[direction]}`}>
        {screen === 'welcome' && (
          <WelcomeScreen
            user={auth.user}
            onStart={() => navigate('details', 'forward')}
            onOpenBookshelf={handleOpenBookshelf}
            onSignIn={() => setAuthIntent('bookshelf')}
            onSignOut={handleSignOut}
            bookCount={bookshelf.books.length}
            planLabel={planLabel}
          />
        )}
        {screen === 'details' && (
          <DetailsScreen
            profile={profile}
            onUpdate={updateProfile}
            onBack={() => navigate('welcome', 'back')}
            onGenerate={handleGenerate}
          />
        )}
        {screen === 'loading' && previewSource?.kind === 'new' && (
          <StoryLoadingScreen request={previewSource.request} onComplete={handleLoadingComplete} />
        )}
        {screen === 'preview' && previewSource && (
          <StoryPreviewScreen
            source={previewSource}
            bookshelf={bookshelf}
            user={auth.user}
            onBack={() => navigate(previewSource.kind === 'saved' ? 'bookshelf' : 'details', 'back')}
            onCreateAnother={handleCreateAnother}
            onOpenBookshelf={handleOpenBookshelf}
            onSignIn={() => setAuthIntent('checkout')}
            onSignOut={handleSignOut}
            onRequireCheckout={handleCheckout}
          />
        )}
        {screen === 'bookshelf' && (
          <BookshelfScreen
            books={bookshelf.books}
            onBack={() => navigate('welcome', 'back')}
            onOpenBook={openSavedBook}
            onStart={() => navigate('details', 'forward')}
          />
        )}
      </div>

      {authIntent && (
        <AuthModal
          auth={auth}
          intent={authIntent}
          onClose={() => {
            setAuthIntent(null);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </main>
  );
}

export default App;
