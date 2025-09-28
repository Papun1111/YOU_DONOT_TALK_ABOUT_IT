import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GlitchHeading from '../components/ui/GlitchHeading';

/**
 * The page for creating a new anonymous identity or restoring an existing one.
 */
const AuthPage = () => {
  const [secretPhrase, setSecretPhrase] = useState('');
  const [publicName, setPublicName] = useState('');
  const [mode, setMode] = useState<'create' | 'restore'>('create');
  const [error, setError] = useState<string | null>(null);
  const { login, restoreSession, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleCreateIdentity = async () => {
    setError(null);
    try {
      const user = await login(secretPhrase || undefined);
      if (user) {
        navigate('/rooms');
      } else {
        setError('Failed to create identity. Please try again.');
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to create identity.');
    }
  };

  const handleRestoreSession = async () => {
    if (!publicName.trim() || !secretPhrase.trim()) {
      setError('Both public name and secret phrase are required to restore your session.');
      return;
    }

    setError(null);
    try {
      const user = await restoreSession(publicName.trim(), secretPhrase.trim());
      if (user) {
        navigate('/rooms');
      } else {
        setError('Failed to restore session. Please check your credentials.');
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to restore session.');
    }
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      handleCreateIdentity();
    } else {
      handleRestoreSession();
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full">
        <GlitchHeading 
          text={mode === 'create' ? 'Create Your Identity' : 'Restore Your Identity'} 
          as="h1" 
          className="text-2xl text-center mb-2" 
        />
        <p className="text-center text-gray-400 text-sm mb-6">
          {mode === 'create' 
            ? 'No names. No personal info. Your identity is generated for you.'
            : 'Enter your public name and secret phrase to restore your account.'
          }
        </p>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
              mode === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            disabled={isLoading}
          >
            Create New
          </button>
          <button
            onClick={() => setMode('restore')}
            className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
              mode === 'restore' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            disabled={isLoading}
          >
            Restore Existing
          </button>
        </div>

        <div className="space-y-4">
          {/* Public Name - only for restore mode */}
          {mode === 'restore' && (
            <div>
              <label htmlFor="publicName" className="block text-sm font-medium text-gray-300 mb-1">
                Public Name *
              </label>
              <Input
                id="publicName"
                type="text"
                placeholder="Your public name"
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Secret Phrase */}
          <div>
            <label htmlFor="secretPhrase" className="block text-sm font-medium text-gray-300 mb-1">
              Secret Phrase {mode === 'create' ? '(Optional)' : '*'}
            </label>
            <Input
              id="secretPhrase"
              type="password"
              placeholder={
                mode === 'create' 
                  ? 'Use this to restore your account later.' 
                  : 'Your secret phrase'
              }
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              disabled={isLoading}
            />
            {mode === 'create' && (
              <p className="text-xs text-gray-500 mt-1">
                This is the ONLY way to recover your profile. We cannot help you if you lose it.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-yellow-400 text-center">{error}</p>}

          <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
            {mode === 'create' ? 'Generate Identity' : 'Restore Identity'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;