import { useState } from 'react';
import { Flag } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { reactToPost } from '../../api/posts';

interface ReportButtonProps {
  postId: string;
}

/**
 * A button that opens a modal to report a post.
 */
const ReportButton = ({ postId }: ReportButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReport = async () => {
    if (!reportReason) return;
    setIsSubmitting(true);
    try {
      await reactToPost(postId, 'flag');
      // In a real app, you would also send the reportReason to a different endpoint
      console.log(`Reported post ${postId} for: ${reportReason}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to report post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label="Report post"
      >
        <Flag size={16} />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Content">
        <div className="space-y-4">
            <p className="text-sm text-gray-400">
                You are flagging this content for review by a moderator. Please select a reason.
            </p>
            <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            >
                <option value="">Select a reason...</option>
                <option value="hate_speech">Hate Speech</option>
                <option value="harassment">Harassment</option>
                <option value="self_harm">Self-Harm</option>
                <option value="spam">Spam or Misleading</option>
                <option value="other">Other</option>
            </select>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleReport} isLoading={isSubmitting} disabled={!reportReason}>
                    Submit Report
                </Button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportButton;
