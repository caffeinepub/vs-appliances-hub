import { useState } from 'react';
import { useSubmitFeedback } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';

interface FeedbackFormProps {
  ticketId: string;
  customerName: string;
  technician?: string;
}

export default function FeedbackForm({ ticketId, customerName, technician }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitFeedback = useSubmitFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await submitFeedback.mutateAsync({
        ticketId,
        customerName,
        technician,
        rating,
        comments: comments.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (submitted) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>Thank you for your feedback! We appreciate your input.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Rate Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Rating *</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments">Comments (Optional)</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share your experience with us..."
            rows={3}
          />
        </div>

        {submitFeedback.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to submit feedback. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={rating === 0 || submitFeedback.isPending} className="w-full">
          {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </div>
  );
}
