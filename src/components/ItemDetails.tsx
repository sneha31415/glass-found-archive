import React, { useState } from "react";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Item, ClaimStatus, ItemStatus } from "@/types";
import { toast } from "sonner";

interface ItemDetailsProps {
  item: Item;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  const { user } = useAuth();
  const { submitClaim, reviewClaim, getClaimAttempts } = useItems();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showClaimReview, setShowClaimReview] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [reporterResponse, setReporterResponse] = useState("");

  const claimAttempts = getClaimAttempts(item.id);
  const userClaimAttempt = claimAttempts.find(claim => claim.userId === user?.id);
  const pendingClaims = claimAttempts.filter(claim => claim.status === ClaimStatus.PENDING);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitClaim = () => {
    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    submitClaim(item.id, answerArray);
    setShowClaimForm(false);
    setAnswers({});
  };

  const handleReviewClaim = (claimId: string, status: ClaimStatus) => {
    reviewClaim(item.id, claimId, status, reporterResponse);
    setShowClaimReview(false);
    setSelectedClaimId(null);
    setReporterResponse("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{item.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location Found</p>
            <p className="font-medium">{item.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date Found</p>
            <p className="font-medium">{new Date(item.dateFound || item.dateLost || "").toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{item.status}</p>
          </div>
        </div>

        {item.status === ItemStatus.FOUND && user && !userClaimAttempt && (
          <button
            onClick={() => setShowClaimForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Claim This Item
          </button>
        )}

        {userClaimAttempt && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Your Claim Status</h3>
            <p className="text-sm text-gray-600">
              Status: {userClaimAttempt.status}
              {userClaimAttempt.reporterResponse && (
                <span className="block mt-2">
                  Reporter's Response: {userClaimAttempt.reporterResponse}
                </span>
              )}
            </p>
          </div>
        )}

        {item.reportedBy === user?.id && pendingClaims.length > 0 && (
          <button
            onClick={() => setShowClaimReview(true)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Review Claims ({pendingClaims.length})
          </button>
        )}
      </div>

      {showClaimForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Claim This Item</h3>
            {item.questions.map(question => (
              <div key={question.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {question.question}
                </label>
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowClaimForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClaim}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {showClaimReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Review Claims</h3>
            {pendingClaims.map(claim => (
              <div key={claim.id} className="mb-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Claimant: {claim.userName}</p>
                <div className="mt-2">
                  {item.questions.map(question => {
                    const answer = claim.answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="mb-2">
                        <p className="text-sm text-gray-600">{question.question}</p>
                        <p className="font-medium">{answer?.answer}</p>
                      </div>
                    );
                  })}
                </div>
                <textarea
                  value={reporterResponse}
                  onChange={(e) => setReporterResponse(e.target.value)}
                  placeholder="Enter your response (optional)"
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleReviewClaim(claim.id, ClaimStatus.REJECTED)}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleReviewClaim(claim.id, ClaimStatus.APPROVED)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowClaimReview(false)}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails; 