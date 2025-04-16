import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ItemStatus, ClaimStatus } from "@/types";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Package,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const ReviewClaims = () => {
  const { items, reviewClaim, getClaimAttempts } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState<{
    itemId: string;
    claimId: string;
  } | null>(null);
  const [reporterResponse, setReporterResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get items reported by the current user
  const reportedItems = items.filter(item => item.reportedBy === user?.id);
  
  // Get all claims for reported items
  const allClaims = reportedItems.flatMap(item => {
    const claims = getClaimAttempts(item.id);
    return claims.map(claim => ({
      ...claim,
      item: items.find(i => i.id === claim.itemId)
    }));
  });

  // Filter pending claims
  const pendingClaims = allClaims.filter(claim => claim.status === ClaimStatus.PENDING);
  const reviewedClaims = allClaims.filter(claim => claim.status !== ClaimStatus.PENDING);

  const handleReviewClaim = (status: ClaimStatus) => {
    if (!selectedClaim) return;

    reviewClaim(selectedClaim.itemId, selectedClaim.claimId, status, reporterResponse);
    setSelectedClaim(null);
    setReporterResponse("");
    setIsDialogOpen(false);
    
    toast.success(`Claim ${status === ClaimStatus.APPROVED ? "approved" : "rejected"} successfully`);
  };

  return (
    <div className="container py-20">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle 
          title="Review Claims" 
          subtitle="Review and approve/reject claims for your reported items" 
        />
      </div>

      {/* Pending Claims */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Pending Claims</h2>
          <span className="text-sm text-muted-foreground">
            ({pendingClaims.length})
          </span>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No pending claims to review</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingClaims.map(claim => (
              <div key={claim.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{claim.item?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Claimed by {claim.userName}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedClaim({
                        itemId: claim.itemId,
                        claimId: claim.id
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    Review Claim
                  </Button>
                </div>

                <div className="space-y-4">
                  {claim.item?.questions.map(question => {
                    const answer = claim.answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="space-y-1">
                        <p className="text-sm font-medium">{question.question}</p>
                        <p className="text-sm text-muted-foreground">{answer?.answer}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Claims */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Reviewed Claims</h2>
          <span className="text-sm text-muted-foreground">
            ({reviewedClaims.length})
          </span>
        </div>

        {reviewedClaims.length === 0 ? (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No reviewed claims yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviewedClaims.map(claim => (
              <div key={claim.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{claim.item?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Claimed by {claim.userName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {claim.status === ClaimStatus.APPROVED ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      {claim.status}
                    </span>
                  </div>
                </div>

                {claim.reporterResponse && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-sm font-medium mb-2">Your Response:</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.reporterResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Claim</DialogTitle>
            <DialogDescription>
              Review the claim and provide a response (optional)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your response (optional)"
              value={reporterResponse}
              onChange={(e) => setReporterResponse(e.target.value)}
              className="glass-input min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedClaim(null);
                setReporterResponse("");
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                onClick={() => handleReviewClaim(ClaimStatus.REJECTED)}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleReviewClaim(ClaimStatus.APPROVED)}
              >
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewClaims; 