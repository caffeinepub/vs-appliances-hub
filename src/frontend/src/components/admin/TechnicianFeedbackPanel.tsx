import { useState } from 'react';
import { useGetFeedbackByTechnician, useGetAllTechnicians } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Star, MessageSquare } from 'lucide-react';

export default function TechnicianFeedbackPanel() {
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');
  const { data: technicians } = useGetAllTechnicians();
  const { data: feedbackList, isLoading } = useGetFeedbackByTechnician(
    selectedTechnician === 'all' ? undefined : selectedTechnician
  );

  const averageRating = feedbackList && feedbackList.length > 0
    ? feedbackList.reduce((sum, f) => sum + Number(f.rating), 0) / feedbackList.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Customer Feedback
        </CardTitle>
        <CardDescription>View customer ratings and comments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians?.map((tech) => (
                <SelectItem key={tech.id} value={tech.name}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : !feedbackList || feedbackList.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No feedback available</p>
        ) : (
          <>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {feedbackList.length} review{feedbackList.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {feedbackList.map((feedback, idx) => (
                <div key={idx} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{feedback.customerName}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Number(feedback.rating) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  {feedback.technician && (
                    <p className="text-xs text-muted-foreground">Technician: {feedback.technician}</p>
                  )}
                  {feedback.comments && (
                    <p className="text-sm text-foreground">{feedback.comments}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
