import GlitchHeading from '../components/ui/GlitchHeading';
import Card from '../components/ui/Card';

/**
 * A static page that displays the safety and moderation policy of the platform.
 */
const SafetyPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <GlitchHeading text="Safety & Moderation Policy" as="h1" className="text-3xl mb-8 text-center" />
      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-bold text-red-400 mb-2">Our Philosophy</h2>
          <p className="text-gray-300">
            Digital Fight Club is a space for exploring identity and rebellion through creative and intellectual challenges. It is not a platform for harm, hate, or abuse. Our policies are designed to protect this space and its users, ensuring that the experience remains thought-provoking and safe for everyone.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Zero-Tolerance Policy</h2>
          <p className="text-gray-300 mb-4">
            The following content and behaviors are strictly forbidden and will result in immediate content removal and potential permanent suspension of your anonymous identity:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Threats of violence or promotion of violent acts.</li>
            <li>Hate speech, harassment, or targeted attacks on individuals or groups.</li>
            <li>Instructions or encouragement of self-harm or suicide.</li>
            <li>Sharing of private information (doxxing).</li>
            <li>Content related to illegal acts or regulated goods.</li>
            <li>Explicitly sexual or graphically violent content.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-red-400 mb-2">Moderation & Reporting</h2>
          <p className="text-gray-300">
            All user-submitted content is subject to moderation. We use a combination of automated filtering and user-based reporting. Every post and submission has a "Flag" icon to report it for review. We take all reports seriously and aim to review them promptly.
          </p>
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold text-red-400 mb-2">Privacy & Anonymity</h2>
          <p className="text-gray-300">
            We are committed to your privacy. We do not collect personally identifiable information (PII). Your identity is a pseudonym. Your optional "Secret Phrase" is hashed and is the only way to recover your account. If you lose it, we cannot recover it for you.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SafetyPage;
