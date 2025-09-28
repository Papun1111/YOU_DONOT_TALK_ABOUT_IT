import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GlitchHeading from '../components/ui/GlitchHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Eye, EyeOff } from 'lucide-react';

/**
 * The user profile page, displaying the Public and Hidden personas.
 */
const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [showHiddenSelf, setShowHiddenSelf] = useState(false);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <GlitchHeading text="No Identity Found" as="h1" className="text-3xl" />
        <p className="mt-4 text-gray-400">You must create an identity to view a profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GlitchHeading text="Your Personas" as="h1" className="text-3xl mb-8 text-center" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Public Self Card */}
        <Card>
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-widest text-red-400 mb-4">Public Self</h2>
            <img 
              src={user.publicAvatar} 
              alt="Public Avatar" 
              className="w-32 h-32 rounded-full mx-auto border-4 border-gray-600 mb-4"
            />
            <p className="text-xl font-bold">{user.publicName}</p>
            <p className="text-xs text-gray-500 mt-2">This is who they think you are.</p>
          </div>
        </Card>

        {/* Hidden Self Card */}
        <Card className="relative overflow-hidden">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-widest text-cyan-400 mb-4">Hidden Self</h2>
            <div className="relative w-32 h-32 mx-auto">
              <img 
                src={user.hiddenAvatar} 
                alt="Hidden Avatar" 
                className={`w-full h-full rounded-full border-4 border-gray-600 transition-all duration-500 ${showHiddenSelf ? 'blur-0 scale-100' : 'blur-lg scale-90'}`}
              />
               <div className={`absolute inset-0 bg-gray-900/80 rounded-full transition-opacity duration-500 ${showHiddenSelf ? 'opacity-0' : 'opacity-100'}`} />
            </div>
            <p className={`text-xl font-bold transition-all duration-500 mt-4 ${showHiddenSelf ? 'opacity-100' : 'opacity-20'}`}>
                {showHiddenSelf ? user.hiddenName : '???????????'}
            </p>
            <p className="text-xs text-gray-500 mt-2">This is who you really are.</p>
          </div>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
               <Button variant="secondary" onClick={() => setShowHiddenSelf(!showHiddenSelf)}>
                   {showHiddenSelf ? <EyeOff className="mr-2 h-4 w-4"/> : <Eye className="mr-2 h-4 w-4" />}
                   {showHiddenSelf ? 'Conceal' : 'Reveal'}
               </Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
