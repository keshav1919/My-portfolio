import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RoadmapViewer } from '../../components/dashboard/RoadmapViewer';
import { getRoadmap, getUserRoadmapProgress, toggleUserRoadmapStep } from '../../services/firestoreService';
import { Skeleton } from '../../components/ui/Skeleton';

export function JavaScriptRoadmapPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [steps, setSteps] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [roadmapSteps, progress] = await Promise.all([
          getRoadmap('javascript'),
          user ? getUserRoadmapProgress(user.uid, 'javascript') : Promise.resolve([]),
        ]);
        if (isMounted) {
          setSteps(roadmapSteps);
          setCompletedIds(progress);
        }
      } catch (err) {
        console.warn('[JSRoadmap error]', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [user]);

  const handleToggleStep = async (stepId) => {
    if (!user) {
      toast.info('Please log in to save roadmap progress');
      return;
    }
    setToggling(true);
    try {
      const updated = await toggleUserRoadmapStep(user.uid, 'javascript', stepId);
      setCompletedIds(updated);
      const isNowCompleted = updated.includes(stepId);
      if (isNowCompleted) {
        toast.success('Concept marked as completed!');
      } else {
        toast.info('Concept marked as incomplete');
      }
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <RoadmapViewer
      title="JavaScript Mastery Roadmap"
      subtitle="From fundamental syntax and scope closures to asynchronous event loops, promises, and modern ES6+ paradigms."
      steps={steps}
      completedIds={completedIds}
      onToggleStep={handleToggleStep}
      loading={toggling}
    />
  );
}
export default JavaScriptRoadmapPage;
